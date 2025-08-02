import {
  ClaudeError} from '~/types/claude.types';
import type {
  ClaudeRequest,
  ClaudeResponse,
  ClaudeModel,
  ClaudeParameters,
  ClaudeConfig,
  ClaudeUsage,
  ClaudeCache,
  ClaudeMonitoring,
  RateLimitConfig
} from '~/types/claude.types';

// Claude API Response Types
interface AnthropicApiResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicApiError {
  type: string;
  error: {
    type: string;
    message: string;
  };
}

export class ClaudeClientService {
  private config: ClaudeConfig;
  private cache: Map<string, ClaudeCache> = new Map();
  private rateLimitTracker: Map<string, number[]> = new Map();
  private monitoring: ClaudeMonitoring[] = [];

  constructor(config: ClaudeConfig) {
    this.config = config;
    this.initializeRateLimitTracking();
    this.startMonitoring();
  }

  // Main request method
  async makeRequest(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): Promise<ClaudeResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    try {
      // Check rate limits
      await this.checkRateLimit();
      
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse && this.config.features.caching) {
        this.updateCacheStats(cacheKey);
        return cachedResponse;
      }

      // Validate request
      this.validateRequest(request);

      // Build API request
      const apiRequest = this.buildApiRequest(request);
      
      // Make API call
      const apiResponse = await this.callAnthropicApi(apiRequest);
      
      // Parse response
      const claudeResponse = this.parseApiResponse(apiResponse, request, startTime);
      
      // Cache response if enabled
      if (this.config.features.caching) {
        this.cacheResponse(cacheKey, claudeResponse);
      }

      // Track usage
      if (this.config.features.analytics) {
        await this.trackUsage(request, claudeResponse);
      }

      // Update monitoring
      this.updateMonitoring(request.shopId, claudeResponse, Date.now() - startTime);

      return claudeResponse;

    } catch (error) {
      const claudeError = this.handleError(error, request, Date.now() - startTime);
      throw claudeError;
    }
  }

  // Batch processing
  async makeBatchRequest(requests: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>[]): Promise<ClaudeResponse[]> {
    if (!this.config.features.batchProcessing) {
      throw new Error('Batch processing is not enabled');
    }

    const responses: ClaudeResponse[] = [];
    const concurrency = Math.min(this.config.rateLimits.requestsPerMinute / 2, 5);
    
    // Process in batches
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchPromises = batch.map(request => this.makeRequest(request));
      
      try {
        const batchResponses = await Promise.allSettled(batchPromises);
        
        for (const result of batchResponses) {
          if (result.status === 'fulfilled') {
            responses.push(result.value);
          } else {
            // Handle batch errors
            const errorResponse: ClaudeResponse = {
              success: false,
              error: {
                code: 'BATCH_REQUEST_FAILED',
                message: result.reason.message || 'Batch request failed',
                type: 'system_error',
                retryable: true,
                retryAfter: 60
              },
              model: this.config.defaultModel,
              tokensUsed: { input: 0, output: 0, total: 0 },
              latency: 0,
              cost: 0
            };
            responses.push(errorResponse);
          }
        }
      } catch (error) {
        console.error('Batch processing error:', error);
        throw error;
      }

      // Add delay between batches to respect rate limits
      if (i + concurrency < requests.length) {
        await this.delay(1000);
      }
    }

    return responses;
  }

  // Stream request (for real-time applications)
  async *streamRequest(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): AsyncGenerator<Partial<ClaudeResponse>, ClaudeResponse> {
    const startTime = Date.now();
    
    try {
      await this.checkRateLimit();
      this.validateRequest(request);

      const apiRequest = {
        ...this.buildApiRequest(request),
        stream: true
      };

      const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          'Anthropic-Version': this.config.version
        },
        body: JSON.stringify(apiRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      let partialContent = '';
      let totalTokens = { input: 0, output: 0, total: 0 };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'content_block_delta') {
                  partialContent += parsed.delta?.text || '';
                  
                  yield {
                    success: true,
                    data: {
                      primary: {
                        type: 'analysis',
                        value: partialContent,
                        confidence: 0.8
                      }
                    },
                    model: request.parameters.model,
                    tokensUsed: totalTokens,
                    latency: Date.now() - startTime,
                    cost: this.calculateCost(totalTokens, request.parameters.model)
                  };
                }
                
                if (parsed.usage) {
                  totalTokens = {
                    input: parsed.usage.input_tokens || 0,
                    output: parsed.usage.output_tokens || 0,
                    total: (parsed.usage.input_tokens || 0) + (parsed.usage.output_tokens || 0)
                  };
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Return final response
      const finalResponse: ClaudeResponse = {
        success: true,
        data: {
          primary: {
            type: 'analysis',
            value: partialContent,
            confidence: 0.9
          }
        },
        model: request.parameters.model,
        tokensUsed: totalTokens,
        latency: Date.now() - startTime,
        cost: this.calculateCost(totalTokens, request.parameters.model),
        rateLimitRemaining: await this.getRateLimitRemaining()
      };

      return finalResponse;

    } catch (error) {
      throw this.handleError(error, request, Date.now() - startTime);
    }
  }

  // Private methods
  private initializeRateLimitTracking(): void {
    // Initialize rate limit tracking for different time windows
    setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const oneHourAgo = now - 3600000;

      // Clean up old entries
      for (const [key, timestamps] of this.rateLimitTracker.entries()) {
        this.rateLimitTracker.set(
          key,
          timestamps.filter(timestamp => timestamp > oneHourAgo)
        );
      }
    }, 30000); // Clean up every 30 seconds
  }

  private startMonitoring(): void {
    if (!this.config.features.analytics) return;

    setInterval(() => {
      this.collectMetrics();
    }, 60000); // Collect metrics every minute
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    // Get current request counts
    const requestsThisMinute = this.getRequestCount('requests_per_minute', oneMinuteAgo);
    const requestsThisHour = this.getRequestCount('requests_per_hour', oneHourAgo);
    const tokensThisMinute = this.getRequestCount('tokens_per_minute', oneMinuteAgo);

    // Check limits
    if (requestsThisMinute >= this.config.rateLimits.requestsPerMinute) {
      throw new ClaudeError('Rate limit exceeded: requests per minute', 'rate_limit', true, 60);
    }

    if (requestsThisHour >= this.config.rateLimits.requestsPerHour) {
      throw new ClaudeError('Rate limit exceeded: requests per hour', 'rate_limit', true, 3600);
    }

    if (tokensThisMinute >= this.config.rateLimits.tokensPerMinute) {
      throw new ClaudeError('Rate limit exceeded: tokens per minute', 'rate_limit', true, 60);
    }

    // Track this request
    this.trackRateLimit('requests_per_minute', now);
    this.trackRateLimit('requests_per_hour', now);
  }

  private getRequestCount(key: string, since: number): number {
    const timestamps = this.rateLimitTracker.get(key) || [];
    return timestamps.filter(timestamp => timestamp > since).length;
  }

  private trackRateLimit(key: string, timestamp: number): void {
    const existing = this.rateLimitTracker.get(key) || [];
    existing.push(timestamp);
    this.rateLimitTracker.set(key, existing);
  }

  private validateRequest(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): void {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required and cannot be empty');
    }

    if (request.prompt.length > 200000) {
      throw new Error('Prompt is too long (max 200,000 characters)');
    }

    if (request.parameters.maxTokens > 4096) {
      throw new Error('Max tokens cannot exceed 4096');
    }

    if (request.parameters.temperature < 0 || request.parameters.temperature > 1) {
      throw new Error('Temperature must be between 0 and 1');
    }
  }

  private buildApiRequest(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): any {
    return {
      model: request.parameters.model || this.config.defaultModel,
      max_tokens: request.parameters.maxTokens || this.config.defaultMaxTokens,
      temperature: request.parameters.temperature || this.config.defaultTemperature,
      top_p: request.parameters.topP,
      top_k: request.parameters.topK,
      messages: [
        {
          role: 'user',
          content: request.prompt
        }
      ],
      system: this.buildSystemMessage(request),
      metadata: {
        user_id: request.userId || 'anonymous',
        request_type: request.type,
        resource_type: request.resourceType,
        resource_id: request.resourceId
      }
    };
  }

  private buildSystemMessage(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): string {
    let systemMessage = 'You are an expert SEO analyst specializing in e-commerce and Shopify stores. ';
    
    switch (request.type) {
      case 'seo_analysis':
        systemMessage += 'Analyze the provided content for SEO opportunities and issues. Provide specific, actionable recommendations.';
        break;
      case 'title_generation':
        systemMessage += 'Generate compelling, SEO-optimized titles that will improve click-through rates and search rankings.';
        break;
      case 'meta_generation':
        systemMessage += 'Create engaging meta descriptions that encourage clicks while incorporating relevant keywords naturally.';
        break;
      case 'content_optimization':
        systemMessage += 'Optimize the provided content for search engines while maintaining readability and user engagement.';
        break;
      case 'keyword_analysis':
        systemMessage += 'Analyze keyword usage and suggest improvements for better search visibility and ranking.';
        break;
      case 'competitor_analysis':
        systemMessage += 'Compare the provided content against competitors and identify opportunities for improvement.';
        break;
      case 'schema_generation':
        systemMessage += 'Generate appropriate schema.org structured data markup for the provided content.';
        break;
      case 'image_alt_generation':
        systemMessage += 'Create descriptive, SEO-friendly alt text for images that improves accessibility and search visibility.';
        break;
      default:
        systemMessage += 'Provide SEO analysis and recommendations based on current best practices.';
    }

    if (request.parameters.format === 'json') {
      systemMessage += ' Always respond with valid JSON format.';
    }

    return systemMessage;
  }

  private async callAnthropicApi(apiRequest: any): Promise<AnthropicApiResponse> {
    const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'Anthropic-Version': this.config.version,
        'User-Agent': 'SEO-Automation/1.0.0'
      },
      body: JSON.stringify(apiRequest)
    });

    if (!response.ok) {
      const errorData: AnthropicApiError = await response.json();
      throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  private parseApiResponse(apiResponse: AnthropicApiResponse, request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>, startTime: number): ClaudeResponse {
    const latency = Date.now() - startTime;
    const tokensUsed = {
      input: apiResponse.usage.input_tokens,
      output: apiResponse.usage.output_tokens,
      total: apiResponse.usage.input_tokens + apiResponse.usage.output_tokens
    };

    const cost = this.calculateCost(tokensUsed, apiResponse.model as ClaudeModel);
    const content = apiResponse.content[0]?.text || '';

    let parsedData;
    try {
      if (request.parameters.format === 'json') {
        parsedData = JSON.parse(content);
      } else {
        parsedData = content;
      }
    } catch (error) {
      parsedData = content; // Fallback to raw content if JSON parsing fails
    }

    const claudeResponse: ClaudeResponse = {
      success: true,
      data: {
        primary: {
          type: this.mapRequestTypeToResultType(request.type),
          value: parsedData,
          confidence: this.calculateConfidence(request, apiResponse)
        }
      },
      model: apiResponse.model as ClaudeModel,
      tokensUsed,
      latency,
      cost,
      rateLimitRemaining: this.config.rateLimits.requestsPerMinute - this.getRequestCount('requests_per_minute', Date.now() - 60000)
    };

    // Add quality metrics if enabled
    if (this.config.features.qualityMonitoring) {
      claudeResponse.quality = this.assessQuality(content, request);
    }

    return claudeResponse;
  }

  private mapRequestTypeToResultType(requestType: string): 'title' | 'description' | 'content' | 'keywords' | 'schema' | 'alt_text' | 'analysis' {
    const mapping: Record<string, 'title' | 'description' | 'content' | 'keywords' | 'schema' | 'alt_text' | 'analysis'> = {
      'title_generation': 'title',
      'meta_generation': 'description',
      'content_optimization': 'content',
      'keyword_analysis': 'keywords',
      'schema_generation': 'schema',
      'image_alt_generation': 'alt_text',
      'seo_analysis': 'analysis',
      'competitor_analysis': 'analysis',
      'bulk_optimization': 'analysis'
    };

    return mapping[requestType] || 'analysis';
  }

  private calculateConfidence(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>, apiResponse: AnthropicApiResponse): number {
    let confidence = 0.8; // Base confidence

    // Adjust based on response quality indicators
    const content = apiResponse.content[0]?.text || '';
    
    if (content.length > 100) confidence += 0.1;
    if (apiResponse.usage.input_tokens > 500) confidence += 0.05;
    if (request.parameters.temperature < 0.3) confidence += 0.05;

    return Math.min(confidence, 1.0);
  }

  private assessQuality(content: string, request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): any {
    return {
      coherence: this.assessCoherence(content),
      relevance: this.assessRelevance(content, request),
      factualAccuracy: 0.9, // Placeholder - would need fact-checking service
      brandAlignment: 0.8, // Placeholder - would need brand guidelines check
      seoEffectiveness: this.assessSEOEffectiveness(content, request),
      readability: this.assessReadability(content)
    };
  }

  private assessCoherence(content: string): number {
    // Simple coherence assessment based on content structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) return 0.5;
    
    // Check for logical flow (simplified)
    const avgSentenceLength = content.length / sentences.length;
    if (avgSentenceLength < 10 || avgSentenceLength > 100) return 0.6;
    
    return 0.8;
  }

  private assessRelevance(content: string, request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): number {
    // Check if content contains context-relevant terms
    const contextTerms = this.extractContextTerms(request);
    const contentLower = content.toLowerCase();
    
    const relevantTermsFound = contextTerms.filter(term => 
      contentLower.includes(term.toLowerCase())
    ).length;
    
    return Math.min(relevantTermsFound / Math.max(contextTerms.length, 1), 1.0);
  }

  private extractContextTerms(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): string[] {
    const terms: string[] = [];
    
    if (request.resourceType) terms.push(request.resourceType);
    
    // Extract terms from context
    const contextStr = JSON.stringify(request.context);
    const words = contextStr.match(/\b[a-zA-Z]{3,}\b/g) || [];
    terms.push(...words.slice(0, 10)); // Take first 10 meaningful words
    
    return terms;
  }

  private assessSEOEffectiveness(content: string, request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): number {
    let score = 0.5;
    
    // Check for SEO best practices
    if (request.type === 'title_generation') {
      const titleLength = content.length;
      if (titleLength >= 30 && titleLength <= 60) score += 0.3;
    }
    
    if (request.type === 'meta_generation') {
      const metaLength = content.length;
      if (metaLength >= 120 && metaLength <= 160) score += 0.3;
    }
    
    // Check for keyword usage (simplified)
    const hasKeywords = /\b(seo|optimization|search|ranking)\b/i.test(content);
    if (hasKeywords) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private assessReadability(content: string): number {
    // Simplified readability assessment
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    
    if (words === 0 || sentences === 0) return 0.5;
    
    const avgWordsPerSentence = words / sentences;
    
    // Ideal range: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
      return 0.9;
    } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      return 0.7;
    } else {
      return 0.5;
    }
  }

  private calculateCost(tokensUsed: { input: number; output: number; total: number }, model: ClaudeModel): number {
    // Pricing per 1K tokens (as of 2024)
    const pricing = {
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 },
      'claude-2.1': { input: 0.008, output: 0.024 },
      'claude-2.0': { input: 0.008, output: 0.024 }
    };

    const modelPricing = pricing[model] || pricing['claude-3-sonnet'];
    
    const inputCost = (tokensUsed.input / 1000) * modelPricing.input;
    const outputCost = (tokensUsed.output / 1000) * modelPricing.output;
    
    return inputCost + outputCost;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>): string {
    const keyData = {
      type: request.type,
      prompt: request.prompt,
      parameters: request.parameters,
      resourceId: request.resourceId
    };
    
    return `claude_${this.hashObject(keyData)}`;
  }

  private hashObject(obj: any): string {
    const str = JSON.stringify(obj);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  private getCachedResponse(cacheKey: string): ClaudeResponse | null {
    const cached = this.cache.get(cacheKey);
    
    if (!cached || !cached.isValid || cached.expiresAt < new Date()) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached.response;
  }

  private updateCacheStats(cacheKey: string): void {
    const cached = this.cache.get(cacheKey);
    if (cached) {
      cached.hitCount++;
      cached.lastAccessed = new Date();
    }
  }

  private cacheResponse(cacheKey: string, response: ClaudeResponse): void {
    const ttl = 3600000; // 1 hour
    const expiresAt = new Date(Date.now() + ttl);
    
    this.cache.set(cacheKey, {
      key: cacheKey,
      requestHash: cacheKey,
      response,
      hitCount: 0,
      lastAccessed: new Date(),
      expiresAt,
      isValid: true,
      validationScore: 1.0,
      createdAt: new Date()
    });
  }

  private async getRateLimitRemaining(): Promise<number> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const requestsThisMinute = this.getRequestCount('requests_per_minute', oneMinuteAgo);
    
    return Math.max(0, this.config.rateLimits.requestsPerMinute - requestsThisMinute);
  }

  private async trackUsage(request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>, response: ClaudeResponse): Promise<void> {
    // This would typically save to database
    // For now, we'll just track in memory
    console.log('Usage tracked:', {
      shopId: request.shopId,
      type: request.type,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      timestamp: new Date()
    });
  }

  private updateMonitoring(shopId: string, response: ClaudeResponse, processingTime: number): void {
    if (!this.config.features.analytics) return;

    const metric: ClaudeMonitoring = {
      timestamp: new Date(),
      shopId,
      responseTime: response.latency,
      queueTime: response.queueTime || 0,
      tokensPerSecond: response.tokensUsed.total / (response.latency / 1000),
      averageQuality: response.quality ? Object.values(response.quality).reduce((a, b) => a + b, 0) / Object.keys(response.quality).length : 0.8,
      errorRate: response.success ? 0 : 1,
      successRate: response.success ? 1 : 0,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: 0, // Would need proper CPU monitoring
      costPerHour: response.cost * 3600 / (response.latency / 1000),
      tokenCostRatio: response.cost / response.tokensUsed.total,
      alerts: []
    };

    this.monitoring.push(metric);
    
    // Keep only last 1000 metrics
    if (this.monitoring.length > 1000) {
      this.monitoring = this.monitoring.slice(-1000);
    }
  }

  private collectMetrics(): void {
    // Aggregate and report metrics
    if (this.monitoring.length === 0) return;

    const recentMetrics = this.monitoring.slice(-60); // Last hour
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
    const avgCost = recentMetrics.reduce((sum, m) => sum + (m.costPerHour || 0), 0) / recentMetrics.length;
    
    console.log('Claude Service Metrics:', {
      avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
      avgCostPerHour: `$${avgCost.toFixed(4)}`,
      requestCount: recentMetrics.length,
      timestamp: new Date().toISOString()
    });
  }

  private handleError(error: any, request: Omit<ClaudeRequest, 'id' | 'createdAt' | 'attempts' | 'status'>, processingTime: number): ClaudeError {
    let claudeError: ClaudeError;
    
    if (error.message?.includes('rate limit')) {
      claudeError = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'API rate limit exceeded',
        type: 'rate_limit',
        retryable: true,
        retryAfter: 60
      };
    } else if (error.message?.includes('400')) {
      claudeError = {
        code: 'INVALID_REQUEST',
        message: 'Invalid request parameters',
        type: 'invalid_request',
        retryable: false
      };
    } else if (error.message?.includes('401')) {
      claudeError = {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key',
        type: 'api_error',
        retryable: false
      };
    } else if (error.message?.includes('timeout')) {
      claudeError = {
        code: 'TIMEOUT',
        message: 'Request timeout',
        type: 'timeout',
        retryable: true,
        retryAfter: 30
      };
    } else {
      claudeError = {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'Unknown error occurred',
        type: 'system_error',
        retryable: true,
        retryAfter: 60
      };
    }

    // Log error for monitoring
    console.error('Claude API Error:', {
      error: claudeError,
      request: {
        type: request.type,
        shopId: request.shopId,
        resourceType: request.resourceType
      },
      processingTime
    });

    return claudeError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public utility methods
  public getConfig(): ClaudeConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ClaudeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getCacheStats(): { size: number; hitRate: number } {
    const totalRequests = Array.from(this.cache.values()).reduce((sum, cache) => sum + cache.hitCount, 0);
    const cacheHits = Array.from(this.cache.values()).filter(cache => cache.hitCount > 0).length;
    
    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? cacheHits / totalRequests : 0
    };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getMonitoringData(): ClaudeMonitoring[] {
    return [...this.monitoring];
  }
}

// Custom error class
class ClaudeError extends Error {
  constructor(
    message: string,
    public type: 'rate_limit' | 'api_error' | 'invalid_request' | 'system_error' | 'timeout',
    public retryable: boolean = false,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ClaudeError';
  }
}

export { ClaudeError };