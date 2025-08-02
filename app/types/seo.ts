// SEO Types and Interfaces
export interface SEOAudit {
  id: string;
  shopId: string;
  resourceType: 'product' | 'collection' | 'page';
  resourceId: string;
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  lastScanned: Date;
  autoFixed: boolean;
}

export interface SEOIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  field: string;
  currentValue: string;
  description: string;
  fixable: boolean;
}

export interface SEOSuggestion {
  id: string;
  field: string;
  suggestedValue: string;
  reasoning: string;
  impact: number;
  confidence: number;
}

export interface SEOImprovement {
  id: string;
  auditId: string;
  field: string;
  beforeValue: string;
  afterValue: string;
  impact: number;
  status: 'pending' | 'applied' | 'failed';
  appliedAt?: Date;
}

export interface CompetitorAnalysis {
  id: string;
  auditId: string;
  competitorUrl: string;
  theirScore: number;
  ourScore: number;
  comparison: CompetitorComparison;
  analyzedAt: Date;
}

export interface CompetitorComparison {
  title: ComparisonField;
  meta: ComparisonField;
  headings: ComparisonField;
  images: ComparisonField;
  schema: ComparisonField;
}

export interface ComparisonField {
  ours: string;
  theirs: string;
  winner: 'ours' | 'theirs' | 'tie';
  suggestion?: string;
}

export interface KeywordTracking {
  id: string;
  auditId: string;
  keyword: string;
  density: number;
  occurrences: number;
  isTarget: boolean;
}

export interface BulkOperation {
  id: string;
  shopId: string;
  type: 'analyze' | 'fix' | 'optimize';
  resourceType: 'product' | 'collection' | 'page';
  resourceIds: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  results?: BulkOperationResult[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface BulkOperationResult {
  resourceId: string;
  success: boolean;
  changes?: SEOImprovement[];
  error?: string;
}