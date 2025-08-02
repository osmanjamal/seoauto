import { PrismaClient } from '@prisma/client';
import type { 
  Shop, 
  User, 
  ShopSettings, 
  SEOTemplate, 
  SEORule, 
  SystemConfig 
} from '@prisma/client';

const prisma = new PrismaClient();

// Default shop settings
const defaultShopSettings = {
  appName: "SEO Automation",
  appVersion: "1.0.0",
  maintenance: false,
  analysisSettings: {
    defaultDepth: "standard",
    defaultStrategy: "balanced",
    scoreThresholds: {
      excellent: 90,
      good: 70,
      needs_improvement: 50,
      poor: 30
    },
    autoFix: {
      enabled: false,
      safeOnly: true,
      createBackups: true,
      requireApproval: true
    },
    scheduling: {
      enabled: false,
      frequency: "weekly",
      time: "02:00",
      timezone: "UTC"
    }
  },
  claudeSettings: {
    enabled: true,
    model: "claude-3-sonnet",
    temperature: 0.3,
    maxTokens: 2000,
    dailyCostLimit: 50,
    monthlyCostLimit: 1000,
    minQualityThreshold: 0.7,
    enableQualityCheck: true,
    batchProcessing: true,
    caching: true,
    analytics: true
  },
  limits: {
    analysisPerMonth: 1000,
    bulkAnalysisSize: 50,
    concurrentAnalyses: 3,
    exportSize: 5000,
    historyRetention: 90,
    apiRequestsPerHour: 100,
    webhookRetries: 3
  },
  integrations: {
    googleAnalytics: {
      enabled: false,
      trackingId: "",
      viewId: ""
    },
    searchConsole: {
      enabled: false,
      propertyUrl: ""
    }
  },
  security: {
    sessionTimeout: 480,
    maxSessions: 5,
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      burstLimit: 200
    },
    dataRetention: 365,
    encryptSensitiveData: true,
    auditTrail: true
  },
  notifications: {
    maintenance: true,
    updates: true,
    security: true,
    defaultEmailNotifications: {
      analysisComplete: true,
      issuesFound: true,
      fixesApplied: true,
      exportReady: true,
      systemAlerts: true,
      weeklyReports: false,
      monthlyReports: false
    },
    defaultInAppNotifications: {
      analysisComplete: true,
      issuesFound: true,
      fixesApplied: true,
      exportReady: true,
      systemAlerts: true,
      weeklyReports: true,
      monthlyReports: true
    },
    channels: {
      email: true,
      slack: false,
      webhook: false
    }
  },
  features: {
    bulkOperations: true,
    competitorAnalysis: true,
    advancedAnalytics: true,
    realTimeUpdates: true,
    claudeIntegration: true,
    claudeBatch: true,
    claudeAnalytics: true,
    darkMode: true,
    advancedFilters: true,
    customDashboard: true,
    keyboardShortcuts: true,
    betaFeatures: false,
    experimentalAI: false,
    performanceProfiling: false
  }
};

// Built-in SEO templates
const seoTemplates = [
  {
    id: 'product-basic',
    name: 'Basic Product SEO',
    description: 'Standard SEO optimization for products',
    resourceType: 'product',
    category: 'basic',
    rules: [
      {
        field: 'title',
        condition: { operator: 'empty' },
        action: {
          type: 'generate',
          value: '{{product.title}} - {{shop.name}}',
          parameters: { maxLength: 60, includeKeywords: true }
        },
        priority: 10
      },
      {
        field: 'description',
        condition: { operator: 'empty' },
        action: {
          type: 'generate',
          value: '{{product.description | truncate: 140}} Shop now at {{shop.name}}!',
          parameters: { maxLength: 160, includeCTA: true }
        },
        priority: 9
      }
    ],
    variables: [
      {
        name: 'product',
        type: 'object',
        description: 'Product data',
        required: true
      },
      {
        name: 'shop',
        type: 'object',
        description: 'Shop information',
        required: true
      }
    ],
    usageCount: 0,
    successRate: 0,
    averageImprovement: 0,
    active: true,
    isBuiltIn: true
  },
  {
    id: 'collection-basic',
    name: 'Basic Collection SEO',
    description: 'Standard SEO optimization for collections',
    resourceType: 'collection',
    category: 'basic',
    rules: [
      {
        field: 'title',
        condition: { operator: 'empty' },
        action: {
          type: 'generate',
          value: '{{collection.title}} - {{shop.name}}',
          parameters: { maxLength: 60, includeKeywords: true }
        },
        priority: 10
      },
      {
        field: 'description',
        condition: { operator: 'empty' },
        action: {
          type: 'generate',
          value: 'Discover our {{collection.title}} collection. {{collection.description | truncate: 120}}',
          parameters: { maxLength: 160, includeCTA: true }
        },
        priority: 9
      }
    ],
    variables: [
      {
        name: 'collection',
        type: 'object',
        description: 'Collection data',
        required: true
      },
      {
        name: 'shop',
        type: 'object',
        description: 'Shop information',
        required: true
      }
    ],
    usageCount: 0,
    successRate: 0,
    averageImprovement: 0,
    active: true,
    isBuiltIn: true
  },
  {
    id: 'page-basic',
    name: 'Basic Page SEO',
    description: 'Standard SEO optimization for pages',
    resourceType: 'page',
    category: 'basic',
    rules: [
      {
        field: 'title',
        condition: { operator: 'empty' },
        action: {
          type: 'generate',
          value: '{{page.title}} - {{shop.name}}',
          parameters: { maxLength: 60, includeKeywords: true }
        },
        priority: 10
      },
      {
        field: 'description',
        condition: { operator: 'empty' },
        action: {
          type: 'generate',
          value: '{{page.content | strip_html | truncate: 140}}',
          parameters: { maxLength: 160 }
        },
        priority: 9
      }
    ],
    variables: [
      {
        name: 'page',
        type: 'object',
        description: 'Page data',
        required: true
      },
      {
        name: 'shop',
        type: 'object',
        description: 'Shop information',
        required: true
      }
    ],
    usageCount: 0,
    successRate: 0,
    averageImprovement: 0,
    active: true,
    isBuiltIn: true
  }
];

// Built-in SEO rules
const seoRules = [
  {
    id: 'title-missing',
    name: 'Missing Title',
    description: 'Page must have a title tag',
    category: 'title',
    condition: {
      field: 'title',
      operator: 'empty',
      value: null
    },
    action: {
      type: 'validate',
      parameters: { severity: 'critical' },
      message: 'Title tag is missing. This is critical for SEO.',
      fixTemplate: 'Generate an SEO-optimized title'
    },
    priority: 10,
    severity: 'critical',
    enabled: true,
    autoFix: true,
    scope: {
      resourceTypes: ['product', 'collection', 'page', 'blog']
    },
    version: '1.0.0'
  },
  {
    id: 'title-too-long',
    name: 'Title Too Long',
    description: 'Title should be 60 characters or less',
    category: 'title',
    condition: {
      field: 'title',
      operator: 'length_greater',
      value: 60
    },
    action: {
      type: 'fix',
      parameters: { maxLength: 60, preserveKeywords: true },
      message: 'Title is too long and may be truncated in search results',
      fixTemplate: 'Shorten title to 60 characters while maintaining keywords'
    },
    priority: 8,
    severity: 'high',
    enabled: true,
    autoFix: true,
    scope: {
      resourceTypes: ['product', 'collection', 'page', 'blog']
    },
    version: '1.0.0'
  },
  {
    id: 'meta-missing',
    name: 'Missing Meta Description',
    description: 'Page must have a meta description',
    category: 'meta',
    condition: {
      field: 'description',
      operator: 'empty',
      value: null
    },
    action: {
      type: 'validate',
      parameters: { severity: 'high' },
      message: 'Meta description is missing. This affects click-through rates.',
      fixTemplate: 'Generate a compelling meta description'
    },
    priority: 9,
    severity: 'high',
    enabled: true,
    autoFix: true,
    scope: {
      resourceTypes: ['product', 'collection', 'page', 'blog']
    },
    version: '1.0.0'
  },
  {
    id: 'alt-text-missing',
    name: 'Missing Alt Text',
    description: 'All images must have alt text',
    category: 'image',
    condition: {
      field: 'images[].alt',
      operator: 'empty',
      value: null
    },
    action: {
      type: 'validate',
      parameters: { severity: 'high' },
      message: 'Images without alt text hurt accessibility and SEO',
      fixTemplate: 'Generate descriptive alt text for images'
    },
    priority: 8,
    severity: 'high',
    enabled: true,
    autoFix: true,
    scope: {
      resourceTypes: ['product', 'collection', 'page', 'blog']
    },
    version: '1.0.0'
  }
];

// System configuration
const systemConfigs = [
  {
    key: 'app.version',
    value: '1.0.0',
    type: 'string',
    description: 'Application version',
    category: 'app',
    isSecret: false,
    isReadOnly: true
  },
  {
    key: 'claude.api.baseUrl',
    value: 'https://api.anthropic.com',
    type: 'string',
    description: 'Claude API base URL',
    category: 'integrations',
    isSecret: false,
    isReadOnly: false
  },
  {
    key: 'claude.api.version',
    value: '2023-06-01',
    type: 'string',
    description: 'Claude API version',
    category: 'integrations',
    isSecret: false,
    isReadOnly: false
  },
  {
    key: 'claude.models.primary',
    value: 'claude-3-sonnet-20240229',
    type: 'string',
    description: 'Primary Claude model',
    category: 'integrations',
    isSecret: false,
    isReadOnly: false
  },
  {
    key: 'claude.models.fallback',
    value: 'claude-3-haiku-20240307',
    type: 'string',
    description: 'Fallback Claude model',
    category: 'integrations',
    isSecret: false,
    isReadOnly: false
  },
  {
    key: 'shopify.api.version',
    value: '2024-01',
    type: 'string',
    description: 'Shopify API version',
    category: 'integrations',
    isSecret: false,
    isReadOnly: false
  },
  {
    key: 'seo.scoring.weights',
    value: JSON.stringify({
      title: 25,
      metaDescription: 20,
      content: 20,
      images: 15,
      technical: 10,
      performance: 10
    }),
    type: 'json',
    description: 'SEO scoring weights by category',
    category: 'seo',
    isSecret: false,
    isReadOnly: false
  },
  {
    key: 'seo.thresholds',
    value: JSON.stringify({
      excellent: 90,
      good: 70,
      needsImprovement: 50,
      poor: 30,
      critical: 0
    }),
    type: 'json',
    description: 'SEO score thresholds',
    category: 'seo',
    isSecret: false,
    isReadOnly: false
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clean existing data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Cleaning existing data...');
      
      // Delete in order of dependencies
      await prisma.sEOImprovement.deleteMany();
      await prisma.competitorAnalysis.deleteMany();
      await prisma.keywordTracking.deleteMany();
      await prisma.sEOAudit.deleteMany();
      await prisma.bulkOperation.deleteMany();
      await prisma.claudeRequest.deleteMany();
      await prisma.sEOQueue.deleteMany();
      await prisma.exportRequest.deleteMany();
      await prisma.sEONotification.deleteMany();
      await prisma.usageAnalytics.deleteMany();
      await prisma.cacheEntry.deleteMany();
      await prisma.monitoringMetric.deleteMany();
      await prisma.userPreferences.deleteMany();
      await prisma.user.deleteMany();
      await prisma.shopSettings.deleteMany();
      await prisma.shop.deleteMany();
      await prisma.sEOTemplate.deleteMany();
      await prisma.sEORule.deleteMany();
      await prisma.systemConfig.deleteMany();
      await prisma.session.deleteMany();
    }

    // Seed system configurations
    console.log('⚙️ Seeding system configurations...');
    for (const config of systemConfigs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config
      });
    }

    // Seed SEO rules
    console.log('📏 Seeding SEO rules...');
    for (const rule of seoRules) {
      await prisma.sEORule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule
      });
    }

    // Seed SEO templates
    console.log('📄 Seeding SEO templates...');
    for (const template of seoTemplates) {
      await prisma.sEOTemplate.upsert({
        where: { id: template.id },
        update: template,
        create: template
      });
    }

    // Create demo shop if in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🏪 Creating demo shop...');
      
      const demoShop = await prisma.shop.create({
        data: {
          domain: 'demo-store.myshopify.com',
          name: 'Demo SEO Store',
          description: 'A demo store for testing SEO automation features',
          plan: 'professional',
          billingCycle: 'monthly',
          timezone: 'America/New_York',
          currency: 'USD',
          locale: 'en',
          seoEnabled: true,
          onboardingCompleted: true,
          totalProducts: 25,
          totalCollections: 5,
          totalPages: 8,
          monthlyAnalysisLimit: 5000,
          monthlyAnalysisUsed: 150
        }
      });

      // Create shop settings
      console.log('⚙️ Creating shop settings...');
      await prisma.shopSettings.create({
        data: {
          shopId: demoShop.id,
          ...defaultShopSettings
        }
      });

      // Create demo user
      console.log('👤 Creating demo user...');
      const demoUser = await prisma.user.create({
        data: {
          shopId: demoShop.id,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          role: 'owner',
          onboardingCompleted: true,
          loginCount: 1
        }
      });

      // Create user preferences
      console.log('🎨 Creating user preferences...');
      await prisma.userPreferences.create({
        data: {
          userId: demoUser.id,
          theme: 'light',
          language: 'en',
          timezone: 'America/New_York',
          defaultAnalysisDepth: 'standard',
          autoFixEnabled: false,
          bulkEditWarnings: true,
          emailNotifications: {
            analysisComplete: true,
            issuesFound: true,
            fixesApplied: true,
            exportReady: true,
            systemAlerts: true,
            weeklyReports: false,
            monthlyReports: true
          },
          inAppNotifications: {
            analysisComplete: true,
            issuesFound: true,
            fixesApplied: true,
            exportReady: true,
            systemAlerts: true,
            weeklyReports: true,
            monthlyReports: true
          },
          dashboardLayout: {
            widgets: [
              {
                id: 'overview',
                type: 'overview',
                position: { x: 0, y: 0 },
                size: { width: 2, height: 1 },
                config: {},
                visible: true
              },
              {
                id: 'recent_analyses',
                type: 'recent_analyses',
                position: { x: 2, y: 0 },
                size: { width: 2, height: 1 },
                config: { limit: 5 },
                visible: true
              },
              {
                id: 'top_issues',
                type: 'top_issues',
                position: { x: 0, y: 1 },
                size: { width: 2, height: 1 },
                config: { limit: 10 },
                visible: true
              },
              {
                id: 'quick_actions',
                type: 'quick_actions',
                position: { x: 2, y: 1 },
                size: { width: 2, height: 1 },
                config: {},
                visible: true
              }
            ],
            columns: 4,
            compactMode: false
          },
          defaultDateRange: 'last_30_days',
          showTips: true
        }
      });

      // Create sample SEO audit
      console.log('📊 Creating sample SEO audit...');
      await prisma.sEOAudit.create({
        data: {
          shopId: demoShop.id,
          shopDomain: demoShop.domain,
          resourceType: 'product',
          resourceId: 'demo-product-1',
          resourceHandle: 'demo-product-handle',
          score: 75.5,
          scoreBreakdown: {
            overall: 75.5,
            technical: { score: 80, title: 85, meta: 75, headings: 80, images: 75, schema: 85, urls: 90 },
            content: { score: 70, quality: 75, keywords: 65, readability: 75, uniqueness: 80 },
            performance: { score: 75, loadTime: 80, coreWebVitals: 70, mobileSpeed: 75 },
            mobile: { score: 80, responsive: 85, usability: 75, speed: 80 },
            accessibility: { score: 85, altText: 90, contrast: 80, navigation: 85 }
          },
          issues: [
            {
              id: 'issue-1',
              type: 'meta_too_short',
              severity: 'medium',
              field: 'description',
              currentValue: 'Short description',
              expectedValue: 'A more detailed description with 120-160 characters',
              description: 'Meta description is too short',
              impact: 'Reduced click-through rates from search results',
              fixable: true,
              autoFixAvailable: true,
              priority: 7
            }
          ],
          criticalIssues: 0,
          warnings: 1,
          suggestions: [
            {
              id: 'suggestion-1',
              field: 'description',
              suggestedValue: 'Discover our amazing demo product with premium features and excellent quality. Perfect for testing SEO automation capabilities.',
              reasoning: 'Expanded description includes key benefits and call-to-action',
              impact: 15,
              confidence: 0.9,
              alternatives: [
                'Premium demo product featuring advanced capabilities for comprehensive SEO testing and optimization workflow validation.',
                'Experience our featured demo product designed for thorough SEO automation testing with professional-grade features.'
              ]
            }
          ],
          scanDuration: 2500,
          scanMethod: 'manual',
          analyzedBy: 'claude'
        }
      });

      console.log('✅ Demo data created successfully!');
    }

    console.log('🎉 Database seeding completed successfully!');
    
    // Log statistics
    const stats = {
      systemConfigs: await prisma.systemConfig.count(),
      seoRules: await prisma.sEORule.count(),
      seoTemplates: await prisma.sEOTemplate.count(),
      shops: await prisma.shop.count(),
      users: await prisma.user.count()
    };
    
    console.log('📊 Seeding statistics:', stats);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  main();
}

export { seedDatabase, defaultShopSettings, seoTemplates, seoRules, systemConfigs };