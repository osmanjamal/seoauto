// Application Types
import type { ShopifySession } from './shopify.types';
import type { SEOAudit, BulkOperation } from './seo.types';
import type { ClaudeRequest } from './claude.types';

// Core Application Types
export interface AppContext {
  // Session and authentication
  session: ShopifySession;
  shop: ShopInfo;
  user: UserInfo;
  
  // Application state
  theme: ThemeConfig;
  settings: AppSettings;
  permissions: UserPermissions;
  
  // Feature flags
  features: FeatureFlags;
  
  // Environment
  environment: 'development' | 'staging' | 'production';
  version: string;
}

export interface ShopInfo {
  id: string;
  domain: string;
  name: string;
  description?: string;
  
  // Plan and billing
  plan: ShopifyPlan;
  billingCycle: 'monthly' | 'annual';
  trialEndsAt?: Date;
  
  // Configuration
  timezone: string;
  currency: string;
  locale: string;
  
  // SEO app specific
  seoEnabled: boolean;
  onboardingCompleted: boolean;
  lastSyncAt?: Date;
  
  // Usage statistics
  totalProducts: number;
  totalCollections: number;
  totalPages: number;
  totalAnalyses: number;
  
  // Limits
  monthlyAnalysisLimit: number;
  monthlyAnalysisUsed: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo {
  id: string;
  shopId: string;
  
  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  
  // Role and permissions
  role: UserRole;
  permissions: UserPermissions;
  
  // Preferences
  preferences: UserPreferences;
  
  // Activity tracking
  lastActiveAt: Date;
  lastLoginAt: Date;
  loginCount: number;
  
  // Onboarding
  onboardingStep?: number;
  onboardingCompleted: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface UserPermissions {
  canAnalyze: boolean;
  canEdit: boolean;
  canBulkEdit: boolean;
  canExport: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canInviteUsers: boolean;
  canAccessAdvanced: boolean;
}

export interface UserPreferences {
  // UI preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  
  // Notification preferences
  emailNotifications: NotificationSettings;
  inAppNotifications: NotificationSettings;
  
  // Analysis preferences
  defaultAnalysisDepth: 'quick' | 'standard' | 'comprehensive';
  autoFixEnabled: boolean;
  bulkEditWarnings: boolean;
  
  // Dashboard preferences
  dashboardLayout: DashboardLayout;
  defaultDateRange: DateRangePreset;
  showTips: boolean;
}

export interface NotificationSettings {
  analysisComplete: boolean;
  issuesFound: boolean;
  fixesApplied: boolean;
  exportReady: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  columns: number;
  compactMode: boolean;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  visible: boolean;
}

export type WidgetType = 
  | 'overview'
  | 'recent_analyses'
  | 'top_issues'
  | 'score_trends'
  | 'quick_actions'
  | 'performance_metrics'
  | 'usage_stats'
  | 'tips_suggestions';

export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_month'
  | 'last_month'
  | 'custom';

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
}

export interface AppSettings {
  // General settings
  appName: string;
  appVersion: string;
  maintenance: boolean;
  
  // Analysis settings
  analysisSettings: AnalysisSettings;
  
  // Claude integration
  claudeSettings: ClaudeIntegrationSettings;
  
  // Limits and quotas
  limits: AppLimits;
  
  // Integration settings
  integrations: IntegrationSettings;
  
  // Security settings
  security: SecuritySettings;
  
  // Notification settings
  notifications: GlobalNotificationSettings;
}

export interface AnalysisSettings {
  // Default settings
  defaultDepth: 'quick' | 'standard' | 'comprehensive';
  defaultStrategy: 'conservative' | 'balanced' | 'aggressive';
  
  // Quality thresholds
  scoreThresholds: {
    excellent: number;
    good: number;
    needs_improvement: number;
    poor: number;
  };
  
  // Auto-fix settings
  autoFix: {
    enabled: boolean;
    safeOnly: boolean;
    createBackups: boolean;
    requireApproval: boolean;
  };
  
  // Scheduling
  scheduling: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:MM format
    timezone: string;
  };
}

export interface ClaudeIntegrationSettings {
  enabled: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  
  // Cost controls
  dailyCostLimit: number;
  monthlyCostLimit: number;
  
  // Quality controls
  minQualityThreshold: number;
  enableQualityCheck: boolean;
  
  // Features
  batchProcessing: boolean;
  caching: boolean;
  analytics: boolean;
}

export interface AppLimits {
  // Analysis limits
  analysisPerMonth: number;
  bulkAnalysisSize: number;
  concurrentAnalyses: number;
  
  // Data limits
  exportSize: number;
  historyRetention: number; // days
  
  // API limits
  apiRequestsPerHour: number;
  webhookRetries: number;
}

export interface IntegrationSettings {
  // Analytics integrations
  googleAnalytics?: {
    enabled: boolean;
    trackingId: string;
    viewId: string;
  };
  
  // Search Console
  searchConsole?: {
    enabled: boolean;
    propertyUrl: string;
  };
  
  // Third-party SEO tools
  semrush?: {
    enabled: boolean;
    apiKey: string;
  };
  
  ahrefs?: {
    enabled: boolean;
    apiKey: string;
  };
}

export interface SecuritySettings {
  // Session settings
  sessionTimeout: number; // minutes
  maxSessions: number;
  
  // Rate limiting
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
  };
  
  // Data protection
  dataRetention: number; // days
  encryptSensitiveData: boolean;
  auditTrail: boolean;
}

export interface GlobalNotificationSettings {
  // System notifications
  maintenance: boolean;
  updates: boolean;
  security: boolean;
  
  // Default user settings
  defaultEmailNotifications: NotificationSettings;
  defaultInAppNotifications: NotificationSettings;
  
  // Notification channels
  channels: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
  };
}

export interface FeatureFlags {
  // Core features
  bulkOperations: boolean;
  competitorAnalysis: boolean;
  advancedAnalytics: boolean;
  realTimeUpdates: boolean;
  
  // Claude features
  claudeIntegration: boolean;
  claudeBatch: boolean;
  claudeAnalytics: boolean;
  
  // UI features
  darkMode: boolean;
  advancedFilters: boolean;
  customDashboard: boolean;
  keyboardShortcuts: boolean;
  
  // Beta features
  betaFeatures: boolean;
  experimentalAI: boolean;
  performanceProfiling: boolean;
}

export type ShopifyPlan = 
  | 'basic'
  | 'shopify'
  | 'advanced'
  | 'plus'
  | 'development';

// Navigation and Menu Types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path: string;
  
  // Hierarchy
  parentId?: string;
  children?: NavigationItem[];
  order: number;
  
  // Permissions
  requiredPermission?: keyof UserPermissions;
  requiredPlan?: ShopifyPlan[];
  requiredFeature?: keyof FeatureFlags;
  
  // Appearance
  badge?: NavigationBadge;
  isNew?: boolean;
  isBeta?: boolean;
  disabled?: boolean;
}

export interface NavigationBadge {
  text: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  count?: number;
}

// Form and Validation Types
export interface FormField {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  
  // Validation
  required?: boolean;
  validation?: ValidationRule[];
  
  // Options for select/checkbox/radio
  options?: FormOption[];
  
  // Dependencies
  dependsOn?: string;
  dependsOnValue?: any;
  
  // Appearance
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  
  // Default value
  defaultValue?: any;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  | 'date'
  | 'datetime'
  | 'file'
  | 'color'
  | 'range'
  | 'url';

export interface FormOption {
  value: any;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
}

export type ValidationType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom';

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Table and List Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  
  // Rendering
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  
  // Visibility
  hidden?: boolean;
  hiddenOnMobile?: boolean;
}

export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TableFilter {
  column: string;
  operator: FilterOperator;
  value: any;
}

export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in'
  | 'not_in';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Modal and Dialog Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  
  // Behavior
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  preventClose?: boolean;
  
  // Content
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  
  // Actions
  onConfirm: () => void;
  onCancel: () => void;
  
  // Appearance
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  
  // Loading state
  isLoading?: boolean;
}

// Toast and Notification Types
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  
  // Behavior
  duration?: number;
  persistent?: boolean;
  dismissible?: boolean;
  
  // Actions
  actions?: ToastAction[];
  
  // Meta
  timestamp: Date;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

export interface ApiMeta {
  pagination?: Pagination;
  filters?: Record<string, any>;
  sort?: TableSort;
  total?: number;
  execution_time?: number;
}

// Loading and State Types
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string | ApiError;
  isEmpty?: boolean;
  isRefreshing?: boolean;
}

export interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string | ApiError;
  lastFetched?: Date;
}

// File and Upload Types
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  
  // Callbacks
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  
  // UI
  disabled?: boolean;
  dragAndDrop?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  
  // Status
  status: 'uploading' | 'completed' | 'error';
  progress?: number;
  error?: string;
  
  // Meta
  uploadedAt: Date;
  uploadedBy: string;
}

// Search Types
export interface SearchConfig {
  placeholder?: string;
  debounceMs?: number;
  minLength?: number;
  
  // Filters
  filters?: SearchFilter[];
  
  // Results
  maxResults?: number;
  showCategories?: boolean;
  
  // Callbacks
  onSearch: (query: string, filters: Record<string, any>) => void;
  onSelect?: (result: SearchResult) => void;
}

export interface SearchFilter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: { value: any; label: string }[];
  defaultValue?: any;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  url?: string;
  metadata?: Record<string, any>;
}

// Keyboard Shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  
  description: string;
  action: () => void;
  
  // Context
  context?: string;
  disabled?: boolean;
}

// Analytics and Tracking
export interface AnalyticsEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  
  // Context
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  
  // Timing
  timestamp: Date;
}

// Performance Monitoring
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  
  // Context
  page?: string;
  component?: string;
  
  // Timing
  timestamp: Date;
  duration?: number;
}

// Error Boundary Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  componentStack?: string;
}

// Export default app types
export interface App {
  context: AppContext;
  navigation: NavigationItem[];
  theme: ThemeConfig;
  settings: AppSettings;
  user: UserInfo;
  shop: ShopInfo;
}