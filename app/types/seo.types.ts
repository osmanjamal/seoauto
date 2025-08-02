// SEO Analysis & Audit Types
export interface SEOAudit {
  id: string;
  shopId: string;
  shopDomain: string;
  resourceType: 'product' | 'collection' | 'page' | 'blog' | 'article';
  resourceId: string;
  resourceHandle: string;
  
  // Scoring details
  score: number; // Overall score 0-100
  scoreBreakdown: ScoreBreakdown;
  previousScore?: number; // For tracking improvements
  
  // Issues and fixes
  issues: SEOIssue[];
  criticalIssues: number; // Count of critical issues
  warnings: number; // Count of warnings
  suggestions: SEOSuggestion[];
  autoFixed: boolean;
  fixedIssues: SEOImprovement[];
  
  // Analysis metadata
  lastScanned: Date;
  scanDuration: number; // milliseconds
  scanMethod: 'manual' | 'scheduled' | 'webhook';
  analyzedBy: 'claude' | 'internal' | 'hybrid';
  
  // Performance metrics
  pageSpeed?: PageSpeedMetrics;
  mobileScore?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ScoreBreakdown {
  overall: number;
  technical: TechnicalScore;
  content: ContentScore;
  performance: PerformanceScore;
  mobile: MobileScore;
  accessibility: AccessibilityScore;
}

export interface TechnicalScore {
  score: number;
  title: number;
  meta: number;
  headings: number;
  images: number;
  schema: number;
  urls: number;
}

export interface ContentScore {
  score: number;
  quality: number;
  keywords: number;
  readability: number;
  uniqueness: number;
}

export interface PerformanceScore {
  score: number;
  loadTime: number;
  coreWebVitals: number;
  mobileSpeed: number;
}

export interface MobileScore {
  score: number;
  responsive: number;
  usability: number;
  speed: number;
}

export interface AccessibilityScore {
  score: number;
  altText: number;
  contrast: number;
  navigation: number;
}

export interface SEOIssue {
  id: string;
  type: IssueType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  field: string;
  fieldPath?: string; // For nested fields like images[0].alt
  currentValue?: string;
  expectedValue?: string;
  description: string;
  impact: string;
  fixable: boolean;
  autoFixAvailable: boolean;
  priority: number; // 1-10, 10 highest
}

export interface SEOSuggestion {
  id: string;
  field: string;
  suggestedValue: string;
  reasoning: string;
  impact: number; // Expected score improvement
  confidence: number; // AI confidence 0-1
  alternatives?: string[];
  examples?: string[];
}

export interface SEOImprovement {
  id: string;
  auditId: string;
  field: string;
  fieldPath?: string;
  
  // Change tracking
  beforeValue?: string;
  afterValue: string;
  changeType: 'add' | 'update' | 'remove' | 'optimize';
  
  // Impact analysis
  impact: number; // SEO score impact (-100 to +100)
  impactDetails: ImpactDetails;
  confidence: number; // AI confidence level (0-1)
  
  // Execution details
  status: 'pending' | 'applied' | 'failed' | 'reverted';
  appliedAt?: Date;
  appliedBy?: string; // user, auto, scheduled
  failureReason?: string;
  
  // A/B testing
  isVariant: boolean;
  variantGroup?: string;
  performance?: PerformanceData;
  
  createdAt: Date;
}

export interface ImpactDetails {
  scoreDelta: number;
  affectedMetrics: string[];
  estimatedTrafficIncrease?: number;
  estimatedRevenueIncrease?: number;
}

export interface PerformanceData {
  ctr?: number; // Click-through rate
  impressions?: number;
  clicks?: number;
  position?: number;
  conversionRate?: number;
}

export interface PageSpeedMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
  tbt: number; // Total Blocking Time
}

// Issue Types
export type IssueType = 
  | 'missing-title'
  | 'title-too-long'
  | 'title-too-short'
  | 'missing-meta'
  | 'meta-too-long'
  | 'meta-too-short'
  | 'missing-h1'
  | 'multiple-h1'
  | 'missing-alt-text'
  | 'missing-schema'
  | 'duplicate-content'
  | 'broken-links'
  | 'slow-loading'
  | 'mobile-issues'
  | 'accessibility-issues'
  | 'keyword-stuffing'
  | 'low-keyword-density'
  | 'poor-readability';

// Competitor Analysis Types
export interface CompetitorAnalysis {
  id: string;
  auditId: string;
  competitorUrl: string;
  
  // Comparison metrics
  theirScore: number;
  ourScore: number;
  gap: number; // Score difference
  
  // Detailed comparison
  titleComparison: ComparisonField;
  metaComparison: ComparisonField;
  contentAnalysis: ContentAnalysis;
  keywordOverlap: number; // Percentage
  
  // Recommendations
  opportunities: Opportunity[]; // What they do better
  advantages: Advantage[]; // What we do better
  
  analyzedAt: Date;
}

export interface ComparisonField {
  ours: string;
  theirs: string;
  winner: 'ours' | 'theirs' | 'tie';
  suggestion?: string;
  scoreDifference: number;
}

export interface ContentAnalysis {
  wordCount: { ours: number; theirs: number };
  readabilityScore: { ours: number; theirs: number };
  keywordDensity: { ours: number; theirs: number };
  headingStructure: { ours: HeadingStructure; theirs: HeadingStructure };
}

export interface HeadingStructure {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  total: number;
  hierarchy: boolean; // Proper heading hierarchy
}

export interface Opportunity {
  area: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface Advantage {
  area: string;
  description: string;
  maintain: string; // How to maintain this advantage
}

// Keyword Tracking Types
export interface KeywordTracking {
  id: string;
  auditId: string;
  keyword: string;
  
  // Tracking metrics
  density: number; // Percentage in content
  prominence: number; // Position score (0-1)
  occurrences: number;
  distribution: KeywordDistribution;
  
  // Optimization status
  isTarget: boolean; // Is this a target keyword?
  isOptimized: boolean;
  recommendations: KeywordRecommendation[];
  
  // Performance tracking
  position?: number; // Search ranking position
  searchVolume?: number;
  difficulty?: number; // Competition difficulty
  cpc?: number; // Cost per click
}

export interface KeywordDistribution {
  title: number;
  meta: number;
  headings: number;
  body: number;
  alt: number;
  url: number;
}

export interface KeywordRecommendation {
  type: 'increase' | 'decrease' | 'redistribute' | 'add-variant';
  description: string;
  expectedImpact: number;
}

// Bulk Operations Types
export interface BulkOperation {
  id: string;
  shopId: string;
  type: 'analyze' | 'fix' | 'optimize' | 'export';
  resourceType: 'product' | 'collection' | 'page' | 'all';
  resourceIds: string[];
  
  // Operation details
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: OperationProgress;
  results?: BulkOperationResult[];
  
  // Configuration
  config: BulkOperationConfig;
  priority: 'low' | 'normal' | 'high';
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletionAt?: Date;
}

export interface OperationProgress {
  current: number;
  total: number;
  percentage: number;
  processedItems: number;
  failedItems: number;
  skippedItems: number;
  estimatedTimeRemaining: number; // seconds
  currentItem?: string;
  logs: OperationLog[];
}

export interface OperationLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  resourceId?: string;
  details?: any;
}

export interface BulkOperationResult {
  resourceId: string;
  resourceType: string;
  success: boolean;
  changes?: SEOImprovement[];
  error?: OperationError;
  scoreBefore?: number;
  scoreAfter?: number;
  processingTime: number; // milliseconds
}

export interface OperationError {
  code: string;
  message: string;
  details?: any;
  recoverable: boolean;
}

export interface BulkOperationConfig {
  issueTypes?: IssueType[];
  strategy: 'conservative' | 'balanced' | 'aggressive';
  
  // Advanced options
  dryRun: boolean;
  createBackup: boolean;
  notifyOnComplete: boolean;
  maxConcurrent: number;
  batchSize: number;
  pauseBetweenBatches: number; // milliseconds
  
  // Filtering
  filters: BulkOperationFilters;
  
  // AI options
  useAI: boolean;
  aiModel?: 'claude-3' | 'claude-2' | 'internal';
  aiOptions?: AIOptions;
}

export interface BulkOperationFilters {
  minScore?: number;
  maxScore?: number;
  tags?: string[];
  collections?: string[];
  excludeIds?: string[];
  dateRange?: { from: Date; to: Date };
  hasIssues?: boolean;
  issueTypes?: IssueType[];
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  customPrompts?: Record<string, string>;
  preserveBrand?: boolean;
  tone?: 'professional' | 'casual' | 'technical' | 'friendly';
  includeKeywords?: string[];
  excludeWords?: string[];
}

// Template Types
export interface SEOTemplate {
  id: string;
  name: string;
  description: string;
  resourceType: 'product' | 'collection' | 'page' | 'blog' | 'all';
  category: string;
  
  // Template rules
  rules: TemplateRule[];
  variables: TemplateVariable[];
  
  // Usage stats
  usageCount: number;
  successRate: number;
  averageImprovement: number;
  
  // Meta
  active: boolean;
  isBuiltIn: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateRule {
  field: string;
  condition?: TemplateCondition;
  action: TemplateAction;
  priority: number;
}

export interface TemplateCondition {
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'length' | 'empty';
  value: any;
  negate?: boolean;
}

export interface TemplateAction {
  type: 'set' | 'append' | 'prepend' | 'replace' | 'remove' | 'transform';
  value: string;
  parameters?: Record<string, any>;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: TemplateCondition;
}

// SEO Rules Engine Types
export interface SEORule {
  id: string;
  name: string;
  description: string;
  category: 'title' | 'meta' | 'image' | 'content' | 'technical' | 'performance';
  
  // Rule logic
  condition: RuleCondition;
  action: RuleAction;
  
  // Configuration
  priority: number; // 1-10, 10 highest
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  autoFix: boolean;
  
  // Scope
  scope: RuleScope;
  
  // Meta
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR' | 'NOT';
  nested?: RuleCondition[];
}

export type ConditionOperator = 
  | 'equals' | 'not_equals'
  | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'regex' | 'not_regex'
  | 'length_equals' | 'length_greater' | 'length_less'
  | 'empty' | 'not_empty'
  | 'exists' | 'not_exists';

export interface RuleAction {
  type: 'validate' | 'fix' | 'suggest' | 'warn' | 'block';
  parameters: Record<string, any>;
  message?: string;
  fixTemplate?: string;
}

export interface RuleScope {
  resourceTypes: ('product' | 'collection' | 'page' | 'blog')[];
  tags?: string[];
  collections?: string[];
  excludeIds?: string[];
}

// Queue Types
export interface SEOQueue {
  id: string;
  shopId: string;
  taskType: 'analyze' | 'fix' | 'generate' | 'export' | 'crawl';
  payload: QueuePayload;
  
  // Priority and scheduling
  priority: number; // 1-10, 10 highest
  scheduledFor?: Date;
  
  // Status tracking
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  attempts: number;
  maxAttempts: number;
  
  // Execution details
  startedAt?: Date;
  completedAt?: Date;
  processingTime?: number; // milliseconds
  
  // Results
  result?: any;
  error?: QueueError;
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}

export interface QueuePayload {
  resourceId?: string;
  resourceType?: string;
  resourceIds?: string[];
  config?: any;
  options?: any;
  metadata?: Record<string, any>;
}

export interface QueueError {
  code: string;
  message: string;
  stack?: string;
  recoverable: boolean;
  retryAfter?: Date;
}

// Export Types
export interface ExportRequest {
  id: string;
  shopId: string;
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  type: 'audit' | 'issues' | 'improvements' | 'competitors' | 'keywords';
  
  // Filters and options
  filters: ExportFilters;
  options: ExportOptions;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  
  // Meta
  createdAt: Date;
  completedAt?: Date;
}

export interface ExportFilters {
  dateRange?: { from: Date; to: Date };
  resourceTypes?: string[];
  issueTypes?: IssueType[];
  scoreRange?: { min: number; max: number };
  tags?: string[];
  collections?: string[];
}

export interface ExportOptions {
  includeHeaders: boolean;
  includeMetadata: boolean;
  includeCharts?: boolean; // For PDF exports
  customFields?: string[];
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// Notification Types
export interface SEONotification {
  id: string;
  shopId: string;
  type: 'analysis_complete' | 'fix_applied' | 'issue_detected' | 'export_ready' | 'system_alert';
  
  // Content
  title: string;
  message: string;
  data?: NotificationData;
  
  // Delivery
  channels: NotificationChannel[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Status
  status: 'pending' | 'sent' | 'failed';
  readAt?: Date;
  
  // Meta
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationData {
  resourceId?: string;
  resourceType?: string;
  score?: number;
  issueCount?: number;
  improvementCount?: number;
  url?: string;
  metadata?: Record<string, any>;
}

export type NotificationChannel = 'in_app' | 'email' | 'slack' | 'webhook';

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  resourceTypes?: string[];
  scoreRange?: { min: number; max: number };
  issueTypes?: IssueType[];
  tags?: string[];
  collections?: string[];
  status?: string[];
  dateRange?: { from: Date; to: Date };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  aggregations?: SearchAggregations;
}

export interface SearchAggregations {
  scoreDistribution: { range: string; count: number }[];
  issueTypes: { type: IssueType; count: number }[];
  resourceTypes: { type: string; count: number }[];
  tags: { tag: string; count: number }[];
}