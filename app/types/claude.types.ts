// Claude AI Integration Types
export interface ClaudeRequest {
  id: string;
  shopId: string;
  type: ClaudeRequestType;
  
  // Request details
  prompt: string;
  context: ClaudeContext;
  parameters: ClaudeParameters;
  
  // Resource information
  resourceType?: 'product' | 'collection' | 'page' | 'blog' | 'article';
  resourceId?: string;
  resourceData?: any;
  
  // Status tracking
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  response?: ClaudeResponse;
  
  // Usage tracking
  tokensUsed?: number;
  cost?: number;
  processingTime?: number; // milliseconds
  
  // Retry logic
  attempts: number;
  maxAttempts: number;
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export type ClaudeRequestType = 
  | 'seo_analysis'
  | 'title_generation'
  | 'meta_generation'
  | 'content_optimization'
  | 'keyword_analysis'
  | 'competitor_analysis'
  | 'schema_generation'
  | 'image_alt_generation'
  | 'bulk_optimization'
  | 'custom_analysis';

export interface ClaudeContext {
  // SEO context
  currentSEO?: {
    title?: string;
    description?: string;
    content?: string;
    keywords?: string[];
  };
  
  // Business context
  shopInfo: ShopContext;
  brandGuidelines?: BrandGuidelines;
  targetAudience?: string;
  
  // Technical context
  resourceContext: ResourceContext;
  competitorData?: CompetitorContext[];
  
  // Historical context
  previousResults?: ClaudeResponse[];
  performanceHistory?: PerformanceMetrics[];
}

export interface ShopContext {
  name: string;
  domain: string;
  description?: string;
  industry?: string;
  location?: string;
  primaryLanguage: string;
  currencies: string[];
  targetMarkets: string[];
}

export interface BrandGuidelines {
  tone: 'professional' | 'casual' | 'friendly' | 'technical' | 'luxury' | 'playful';
  voice: string; // Brand voice description
  keywords: string[]; // Brand keywords to include
  avoidWords: string[]; // Words to avoid
  style: {
    useEmojis: boolean;
    useCapsLock: boolean;
    preferredLength: 'short' | 'medium' | 'long';
  };
  messaging: {
    valuePropositions: string[];
    keyBenefits: string[];
    differentiators: string[];
  };
}

export interface ResourceContext {
  type: string;
  handle: string;
  currentData: any;
  
  // Related resources
  collections?: string[];
  tags?: string[];
  category?: string;
  
  // Performance data
  views?: number;
  conversions?: number;
  revenue?: number;
  
  // SEO data
  currentRank?: number;
  searchVolume?: number;
  competition?: 'low' | 'medium' | 'high';
}

export interface CompetitorContext {
  url: string;
  title?: string;
  description?: string;
  keywords?: string[];
  rank?: number;
  traffic?: number;
}

export interface PerformanceMetrics {
  date: Date;
  rank?: number;
  traffic?: number;
  ctr?: number;
  conversions?: number;
  revenue?: number;
}

export interface ClaudeParameters {
  // Model configuration
  model: ClaudeModel;
  temperature: number; // 0-1, creativity level
  maxTokens: number;
  topP?: number;
  topK?: number;
  
  // Task-specific parameters
  strategy: 'conservative' | 'balanced' | 'aggressive' | 'creative';
  focus: ClaudeFocus[];
  constraints: ClaudeConstraints;
  
  // Output preferences
  format: 'text' | 'json' | 'structured';
  includeReasoning: boolean;
  includeAlternatives: boolean;
  includeConfidence: boolean;
  
  // Quality controls
  factCheck: boolean;
  brandConsistency: boolean;
  grammarCheck: boolean;
  plagiarismCheck: boolean;
}

export type ClaudeModel = 
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-2.1'
  | 'claude-2.0';

export type ClaudeFocus = 
  | 'seo_optimization'
  | 'user_engagement'
  | 'conversion_rate'
  | 'brand_consistency'
  | 'readability'
  | 'keyword_targeting'
  | 'competitor_analysis'
  | 'technical_seo';

export interface ClaudeConstraints {
  // Length constraints
  minLength?: number;
  maxLength?: number;
  targetLength?: number;
  
  // Content constraints
  requiredKeywords?: string[];
  forbiddenWords?: string[];
  mustInclude?: string[];
  
  // Style constraints
  tone?: string;
  readingLevel?: 'elementary' | 'middle' | 'high' | 'college' | 'graduate';
  formality?: 'very_formal' | 'formal' | 'neutral' | 'informal' | 'very_informal';
  
  // Technical constraints
  schema?: boolean;
  structuredData?: boolean;
  htmlTags?: boolean;
}

export interface ClaudeResponse {
  success: boolean;
  data?: ClaudeResponseData;
  error?: ClaudeError;
  
  // Metadata
  model: ClaudeModel;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  
  // Timing
  latency: number; // milliseconds
  queueTime?: number; // milliseconds
  
  // Quality metrics
  confidence?: number; // 0-1
  quality?: QualityMetrics;
  
  // Usage tracking
  cost: number;
  rateLimitRemaining?: number;
}

export interface ClaudeResponseData {
  // Primary results
  primary: ClaudeResult;
  alternatives?: ClaudeResult[];
  
  // Analysis and insights
  analysis?: AnalysisResult;
  recommendations?: Recommendation[];
  
  // Structured outputs
  structured?: StructuredOutput;
  
  // Reasoning (if requested)
  reasoning?: string;
  steps?: ReasoningStep[];
}

export interface ClaudeResult {
  type: 'title' | 'description' | 'content' | 'keywords' | 'schema' | 'alt_text' | 'analysis';
  value: string | object;
  
  // Metadata
  confidence: number;
  seoScore?: number;
  readabilityScore?: number;
  
  // Optimization details
  improvements?: string[];
  keywords?: KeywordUsage[];
  
  // Performance prediction
  predictedImpact?: {
    seoImprovement: number;
    trafficIncrease: number;
    engagementBoost: number;
  };
}

export interface KeywordUsage {
  keyword: string;
  frequency: number;
  density: number;
  placement: KeywordPlacement[];
  naturalness: number; // 0-1, how naturally the keyword fits
}

export type KeywordPlacement = 'title' | 'description' | 'h1' | 'h2' | 'body' | 'alt' | 'url';

export interface AnalysisResult {
  currentState: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  
  competitivePosition: {
    rank: number;
    gapAnalysis: Gap[];
    advantages: string[];
  };
  
  technicalIssues: TechnicalIssue[];
  contentQuality: ContentQualityAnalysis;
}

export interface Gap {
  area: string;
  current: number;
  competitor: number;
  difference: number;
  impact: 'low' | 'medium' | 'high';
}

export interface TechnicalIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fix: string;
  effort: 'easy' | 'medium' | 'hard';
}

export interface ContentQualityAnalysis {
  readability: {
    score: number;
    level: string;
    improvements: string[];
  };
  
  engagement: {
    score: number;
    factors: EngagementFactor[];
  };
  
  seoOptimization: {
    score: number;
    onPage: number;
    technical: number;
    content: number;
  };
}

export interface EngagementFactor {
  factor: string;
  impact: number;
  suggestion: string;
}

export interface Recommendation {
  id: string;
  type: 'immediate' | 'short_term' | 'long_term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  title: string;
  description: string;
  
  // Implementation details
  steps: RecommendationStep[];
  estimatedEffort: string;
  estimatedImpact: ImpactEstimate;
  
  // Dependencies
  dependencies?: string[];
  prerequisites?: string[];
}

export interface RecommendationStep {
  order: number;
  action: string;
  details: string;
  tools?: string[];
  estimatedTime: string;
}

export interface ImpactEstimate {
  seoScore: number; // Expected score increase
  traffic: number; // Expected traffic increase %
  conversions: number; // Expected conversion increase %
  confidence: number; // Confidence in estimate 0-1
}

export interface StructuredOutput {
  schema?: SchemaMarkup;
  meta?: MetaTags;
  headings?: HeadingStructure;
  images?: ImageOptimization[];
}

export interface SchemaMarkup {
  type: string;
  data: Record<string, any>;
  validation?: ValidationResult;
}

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  canonical?: string;
  og?: OpenGraphTags;
  twitter?: TwitterTags;
}

export interface OpenGraphTags {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export interface TwitterTags {
  card: string;
  title: string;
  description: string;
  image?: string;
  creator?: string;
}

export interface HeadingStructure {
  h1: string;
  h2: string[];
  h3: string[];
  hierarchy: boolean;
  seoOptimized: boolean;
}

export interface ImageOptimization {
  src: string;
  altText: string;
  title?: string;
  caption?: string;
  seoValue: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ReasoningStep {
  step: number;
  description: string;
  rationale: string;
  data?: any;
}

export interface QualityMetrics {
  coherence: number; // 0-1
  relevance: number; // 0-1
  factualAccuracy: number; // 0-1
  brandAlignment: number; // 0-1
  seoEffectiveness: number; // 0-1
  readability: number; // 0-1
}

export interface ClaudeError {
  code: string;
  message: string;
  type: 'rate_limit' | 'api_error' | 'invalid_request' | 'system_error' | 'timeout';
  details?: any;
  
  // Retry information
  retryable: boolean;
  retryAfter?: number; // seconds
  
  // Cost tracking (even for errors)
  tokensUsed?: number;
  cost?: number;
}

// Prompt Management Types
export interface ClaudePrompt {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  
  // Prompt content
  template: string;
  variables: PromptVariable[];
  examples?: PromptExample[];
  
  // Configuration
  defaultParameters: ClaudeParameters;
  supportedModels: ClaudeModel[];
  
  // Performance tracking
  usage: {
    totalUses: number;
    successRate: number;
    averageQuality: number;
    averageCost: number;
  };
  
  // Versioning
  version: string;
  parentId?: string; // For prompt iterations
  
  // Meta
  active: boolean;
  isBuiltIn: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PromptCategory = 
  | 'seo_analysis'
  | 'content_generation'
  | 'optimization'
  | 'competitor_analysis'
  | 'technical_seo'
  | 'bulk_operations'
  | 'custom';

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    allowedValues?: any[];
  };
}

export interface PromptExample {
  input: Record<string, any>;
  expectedOutput: string;
  explanation?: string;
}

// Batch Processing Types
export interface ClaudeBatch {
  id: string;
  shopId: string;
  type: ClaudeRequestType;
  
  // Batch details
  requests: ClaudeRequest[];
  totalRequests: number;
  
  // Progress tracking
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: BatchProgress;
  
  // Configuration
  config: BatchConfig;
  
  // Resource management
  concurrency: number;
  rateLimit: RateLimitConfig;
  
  // Results
  results: BatchResult[];
  summary?: BatchSummary;
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletionAt?: Date;
}

export interface BatchProgress {
  completed: number;
  failed: number;
  pending: number;
  processing: number;
  percentage: number;
  estimatedTimeRemaining: number; // seconds
  currentThroughput: number; // requests per minute
}

export interface BatchConfig {
  priority: 'low' | 'normal' | 'high';
  retryFailures: boolean;
  continueOnError: boolean;
  saveIntermediateResults: boolean;
  notifyOnComplete: boolean;
  
  // Cost controls
  maxCostPerRequest?: number;
  maxTotalCost?: number;
  
  // Quality controls
  minQualityThreshold?: number;
  reviewRequired?: boolean;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  tokensPerMinute: number;
  costPerHour: number;
}

export interface BatchResult {
  requestId: string;
  success: boolean;
  response?: ClaudeResponse;
  error?: ClaudeError;
  processingTime: number;
  cost: number;
}

export interface BatchSummary {
  totalCost: number;
  totalTokens: number;
  averageLatency: number;
  successRate: number;
  qualityMetrics: QualityMetrics;
  
  // Performance breakdown
  performanceByType: Record<ClaudeRequestType, {
    count: number;
    successRate: number;
    averageCost: number;
    averageQuality: number;
  }>;
  
  // Error analysis
  errorBreakdown: Record<string, number>;
  commonIssues: string[];
}

// Usage Analytics Types
export interface ClaudeUsage {
  shopId: string;
  period: 'hour' | 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
  
  // Request metrics
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  
  // Token usage
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  
  // Cost tracking
  totalCost: number;
  costByModel: Record<ClaudeModel, number>;
  costByType: Record<ClaudeRequestType, number>;
  
  // Performance metrics
  averageLatency: number;
  averageQuality: number;
  
  // Usage patterns
  peakHours: number[];
  popularTypes: ClaudeRequestType[];
  topPrompts: string[];
  
  // Efficiency metrics
  costPerSuccessfulRequest: number;
  tokensPerRequest: number;
  qualityTrendline: number[]; // Quality over time
}

// Configuration Types
export interface ClaudeConfig {
  // API Configuration
  apiKey: string;
  baseUrl: string;
  version: string;
  
  // Default parameters
  defaultModel: ClaudeModel;
  defaultTemperature: number;
  defaultMaxTokens: number;
  
  // Rate limiting
  rateLimits: RateLimitConfig;
  
  // Cost controls
  costLimits: {
    daily: number;
    monthly: number;
    perRequest: number;
  };
  
  // Quality controls
  qualityThresholds: {
    minimum: number;
    warning: number;
    excellent: number;
  };
  
  // Retry configuration
  retryConfig: {
    maxAttempts: number;
    backoffMultiplier: number;
    maxBackoffTime: number;
  };
  
  // Feature flags
  features: {
    batchProcessing: boolean;
    caching: boolean;
    analytics: boolean;
    qualityMonitoring: boolean;
  };
}

// Cache Types
export interface ClaudeCache {
  key: string;
  requestHash: string;
  response: ClaudeResponse;
  
  // Cache metadata
  hitCount: number;
  lastAccessed: Date;
  expiresAt: Date;
  
  // Validation
  isValid: boolean;
  validationScore: number;
  
  createdAt: Date;
}

// Monitoring Types
export interface ClaudeMonitoring {
  timestamp: Date;
  shopId: string;
  
  // Performance metrics
  responseTime: number;
  queueTime: number;
  tokensPerSecond: number;
  
  // Quality metrics
  averageQuality: number;
  errorRate: number;
  successRate: number;
  
  // Resource usage
  memoryUsage: number;
  cpuUsage: number;
  
  // Cost metrics
  costPerHour: number;
  tokenCostRatio: number;
  
  // Alert thresholds
  alerts: MonitoringAlert[];
}

export interface MonitoringAlert {
  type: 'performance' | 'cost' | 'quality' | 'rate_limit' | 'error';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  threshold: number;
  actualValue: number;
  timestamp: Date;
}