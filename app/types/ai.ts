// AI Service Types
export interface ClaudeRequest {
  model: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ClaudeResponse {
  id: string;
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface SEOAnalysisRequest {
  url: string;
  content: string;
  resourceType: 'product' | 'collection' | 'page';
  checkFor: SEOCheckType[];
}

export interface SEOAnalysisResponse {
  score: number;
  issues: AIDetectedIssue[];
  suggestions: AISuggestion[];
  keywordAnalysis: KeywordAnalysis;
  competitorInsights?: CompetitorInsight[];
}

export interface AIDetectedIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  field: string;
  currentValue: string;
  problem: string;
  impact: string;
  fixable: boolean;
}

export interface AISuggestion {
  field: string;
  suggestedValue: string;
  reasoning: string;
  impact: number;
  confidence: number;
  examples?: string[];
}

export interface KeywordAnalysis {
  primaryKeywords: Keyword[];
  secondaryKeywords: Keyword[];
  density: number;
  distribution: KeywordDistribution;
}

export interface Keyword {
  term: string;
  frequency: number;
  relevance: number;
  competition: 'low' | 'medium' | 'high';
}

export interface KeywordDistribution {
  title: number;
  meta: number;
  headings: number;
  body: number;
  alt: number;
}

export interface CompetitorInsight {
  url: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export type SEOCheckType = 
  | 'title'
  | 'meta'
  | 'headings'
  | 'images'
  | 'schema'
  | 'keywords'
  | 'content'
  | 'technical';

export interface ContentOptimizationRequest {
  currentContent: string;
  targetKeywords: string[];
  contentType: 'title' | 'meta' | 'description' | 'alt';
  constraints: ContentConstraints;
}

export interface ContentConstraints {
  maxLength?: number;
  minLength?: number;
  includeKeywords: string[];
  excludeWords?: string[];
  tone?: 'professional' | 'casual' | 'technical' | 'marketing';
}

export interface ContentOptimizationResponse {
  optimizedContent: string;
  improvements: string[];
  keywordUsage: KeywordUsage[];
  score: number;
}

export interface KeywordUsage {
  keyword: string;
  used: boolean;
  frequency: number;
  placement: string[];
}