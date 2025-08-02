// Shopify Resource Types
export interface ShopifyProduct {
  id: string;
  gid: string; // Global ID
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: 'active' | 'archived' | 'draft';
  
  // SEO fields
  seo: ShopifySEO;
  
  // Media
  images: ShopifyImage[];
  featuredImage?: ShopifyImage;
  media: ShopifyMedia[];
  
  // Variants
  variants: ShopifyVariant[];
  
  // Organization
  collections: ShopifyCollection[];
  
  // Pricing
  priceRange: PriceRange;
  compareAtPriceRange?: PriceRange;
  
  // Inventory
  totalInventory: number;
  tracksInventory: boolean;
  
  // Publishing
  publishedAt?: Date;
  publishedScope: 'web' | 'global';
  
  // Options
  options: ProductOption[];
  hasOnlyDefaultVariant: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Shopify Admin URLs
  onlineStoreUrl?: string;
  onlineStorePreviewUrl?: string;
}

export interface ShopifyVariant {
  id: string;
  gid: string;
  title: string;
  sku?: string;
  barcode?: string;
  
  // Pricing
  price: string;
  compareAtPrice?: string;
  
  // Inventory
  inventoryQuantity: number;
  inventoryManagement?: 'shopify' | 'not_managed';
  inventoryPolicy: 'deny' | 'continue';
  
  // Physical properties
  weight?: number;
  weightUnit: 'g' | 'kg' | 'oz' | 'lb';
  
  // Fulfillment
  requiresShipping: boolean;
  taxable: boolean;
  
  // Options
  selectedOptions: SelectedOption[];
  
  // Media
  image?: ShopifyImage;
  
  // Availability
  availableForSale: boolean;
  
  // Meta
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopifyCollection {
  id: string;
  gid: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  
  // SEO
  seo: ShopifySEO;
  
  // Media
  image?: ShopifyImage;
  
  // Products
  products: ShopifyProduct[];
  productsCount: number;
  
  // Rules (for smart collections)
  rules?: CollectionRule[];
  ruleSet?: 'all' | 'any';
  sortOrder: CollectionSortOrder;
  
  // Publishing
  publishedAt?: Date;
  publishedScope: 'web' | 'global';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // URLs
  onlineStoreUrl?: string;
}

export interface ShopifyPage {
  id: string;
  gid: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  
  // SEO
  seo: ShopifySEO;
  
  // Publishing
  publishedAt?: Date;
  
  // Template
  templateSuffix?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // URLs
  onlineStoreUrl?: string;
}

export interface ShopifyBlog {
  id: string;
  gid: string;
  title: string;
  handle: string;
  
  // SEO
  seo: ShopifySEO;
  
  // Articles
  articles: ShopifyArticle[];
  
  // Settings
  commentable: 'no' | 'moderate' | 'yes';
  feedburner?: string;
  feedburnerLocation?: string;
  
  // Templates
  templateSuffix?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // URLs
  onlineStoreUrl?: string;
}

export interface ShopifyArticle {
  id: string;
  gid: string;
  title: string;
  handle: string;
  content: string;
  excerpt?: string;
  summary: string;
  
  // SEO
  seo: ShopifySEO;
  
  // Author
  authorV2?: string;
  
  // Media
  image?: ShopifyImage;
  
  // Blog
  blog: ShopifyBlog;
  
  // Tags
  tags: string[];
  
  // Publishing
  publishedAt?: Date;
  
  // Comments
  commentable: boolean;
  
  // Templates
  templateSuffix?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // URLs
  onlineStoreUrl?: string;
}

export interface ShopifyImage {
  id?: string;
  gid?: string;
  src: string;
  originalSrc: string;
  transformedSrc: string;
  altText?: string;
  width: number;
  height: number;
  
  // Transformations
  url: (transform?: ImageTransform) => string;
}

export interface ImageTransform {
  width?: number;
  height?: number;
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  scale?: number;
  format?: 'jpg' | 'png' | 'webp';
  quality?: number;
}

export interface ShopifyMedia {
  id: string;
  mediaContentType: 'IMAGE' | 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D';
  alt?: string;
  
  // Preview
  preview?: {
    image?: ShopifyImage;
    status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  };
  
  // Media specific data
  image?: ShopifyImage;
  video?: ShopifyVideo;
  externalVideo?: ShopifyExternalVideo;
  model3d?: ShopifyModel3d;
}

export interface ShopifyVideo {
  id: string;
  sources: VideoSource[];
  originalSource: VideoSource;
  duration?: number;
}

export interface VideoSource {
  url: string;
  mimeType: string;
  format: string;
  height: number;
  width: number;
}

export interface ShopifyExternalVideo {
  id: string;
  host: 'YOUTUBE' | 'VIMEO';
  originUrl: string;
  embedUrl: string;
}

export interface ShopifyModel3d {
  id: string;
  sources: Model3dSource[];
  originalSource: Model3dSource;
  boundingBox: {
    size: {
      x: number;
      y: number;
      z: number;
    };
  };
}

export interface Model3dSource {
  url: string;
  mimeType: string;
  format: string;
  filesize: number;
}

export interface ShopifySEO {
  title?: string;
  description?: string;
}

export interface PriceRange {
  minVariantPrice: MoneyV2;
  maxVariantPrice: MoneyV2;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
  position: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface CollectionRule {
  field: string;
  relation: string;
  condition: string;
}

export type CollectionSortOrder = 
  | 'alpha-asc'
  | 'alpha-desc'
  | 'best-selling'
  | 'created'
  | 'created-desc'
  | 'manual'
  | 'price-asc'
  | 'price-desc';

// Shop Configuration
export interface ShopifyShop {
  id: string;
  name: string;
  description?: string;
  
  // Contact
  email: string;
  contactEmail: string;
  customerEmail: string;
  
  // Location
  primaryDomain: ShopifyDomain;
  domains: ShopifyDomain[];
  
  // Currency and locale
  currencyCode: string;
  enabledPresentmentCurrencies: string[];
  
  // Features
  features: ShopifyFeatures;
  
  // Plan
  plan: ShopifyPlan;
  
  // Policies
  privacyPolicy?: ShopifyShopPolicy;
  refundPolicy?: ShopifyShopPolicy;
  shippingPolicy?: ShopifyShopPolicy;
  termsOfService?: ShopifyShopPolicy;
  
  // Settings
  checkoutSettings: CheckoutSettings;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopifyDomain {
  id: string;
  host: string;
  sslEnabled: boolean;
  url: string;
}

export interface ShopifyFeatures {
  avalaraAvatax: boolean;
  branding: boolean;
  captcha: boolean;
  captchaExternalDomains: boolean;
  cartRedirects: boolean;
  checkoutTooltips: boolean;
  dynamicCheckout: boolean;
  eligibleForPayments: boolean;
  eligibleForSubscriptions: boolean;
  giftCards: boolean;
  harmonizedSystemCode: boolean;
  internationalDomains: boolean;
  internationalPriceOverrides: boolean;
  internationalPriceRules: boolean;
  legacySubscriptionGatewayEnabled: boolean;
  liveChat: boolean;
  multiLocation: boolean;
  onboardingVisual: boolean;
  paypalExpressCheckout: boolean;
  reports: boolean;
  sellsSubscriptions: boolean;
  showMetrics: boolean;
  storefront: boolean;
  usingShopifyBalance: boolean;
}

export interface ShopifyPlan {
  displayName: string;
  partnerDevelopment: boolean;
  shopifyPlus: boolean;
}

export interface ShopifyShopPolicy {
  id: string;
  title: string;
  body: string;
  handle: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutSettings {
  colorScheme: 'light' | 'dark' | 'auto';
  headerImage?: ShopifyImage;
  customizations: {
    brandingSettings: BrandingSettings;
    buyerIdentity: BuyerIdentitySettings;
    cartLink: CartLinkSettings;
    checkout: CheckoutCustomization;
    colors: ColorSettings;
    cornerRadius: CornerRadiusSettings;
    designSystem: DesignSystemSettings;
    expressCheckout: ExpressCheckoutSettings;
    favicon?: ShopifyImage;
    globalBanner: GlobalBannerSettings;
    header: HeaderSettings;
    headingFont: string;
    bodyFont: string;
    orderStatus: OrderStatusSettings;
    primaryButton: ButtonSettings;
    secondaryButton: ButtonSettings;
    typography: TypographySettings;
  };
}

export interface BrandingSettings {
  checkbox: 'show' | 'hide';
  favicon: 'show' | 'hide';
  headerImage: 'show' | 'hide';
  logo: 'show' | 'hide';
}

export interface BuyerIdentitySettings {
  membershipCards: 'show' | 'hide';
}

export interface CartLinkSettings {
  color?: string;
  cornerRadius?: CornerRadius;
  labelText?: string;
  typography?: TypographyStyle;
}

export interface CheckoutCustomization {
  buyerAcceptsMerchantTerms: boolean;
  requiresSubscriptionTerms: boolean;
}

export interface ColorSettings {
  accent?: string;
  accent2?: string;
  accent3?: string;
  background?: string;
  backgroundSecondary?: string;
  border?: string;
  decorative?: string;
  interactive?: string;
  interactiveSecondary?: string;
  interactiveSubdued?: string;
  critical?: string;
  warning?: string;
  success?: string;
  info?: string;
}

export interface CornerRadiusSettings {
  base?: CornerRadius;
  large?: CornerRadius;
  small?: CornerRadius;
}

export type CornerRadius = 'none' | 'small' | 'base' | 'large';

export interface DesignSystemSettings {
  colors: 'base' | 'transparent';
  cornerRadius: 'base' | 'none' | 'small' | 'large';
  labelPosition: 'inside' | 'outside';
}

export interface ExpressCheckoutSettings {
  buttonColor: 'gold' | 'blue' | 'silver' | 'white' | 'black';
  buttonText: 'book' | 'buy' | 'donate' | 'plain';
}

export interface GlobalBannerSettings {
  backgroundImage?: ShopifyImage;
  cornerRadius?: CornerRadius;
  position: 'above' | 'below';
}

export interface HeaderSettings {
  alignment: 'start' | 'center' | 'end';
  banner: 'show' | 'hide';
  favicon: 'show' | 'hide';
  logo: LogoSettings;
  position: 'start' | 'center' | 'end';
}

export interface LogoSettings {
  image?: ShopifyImage;
  maxWidth?: number;
  text?: string;
}

export interface OrderStatusSettings {
  backgroundColor?: string;
  backgroundImage?: ShopifyImage;
}

export interface ButtonSettings {
  backgroundColor?: string;
  blockPadding?: string;
  border?: string;
  cornerRadius?: CornerRadius;
  inlinePadding?: string;
  typography?: TypographyStyle;
}

export interface TypographySettings {
  size?: 'base' | 'large' | 'medium' | 'small' | 'extraSmall';
  kerning?: 'base' | 'loose';
  letterCase?: 'none' | 'upper';
  weight?: 'base' | 'bold';
}

export interface TypographyStyle {
  font?: string;
  kerning?: 'base' | 'loose';
  letterCase?: 'none' | 'upper';
  size?: 'base' | 'large' | 'medium' | 'small' | 'extraSmall';
  weight?: 'base' | 'bold';
}

// Metafields
export interface ShopifyMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: MetafieldType;
  description?: string;
  
  // Owner
  ownerType: 'PRODUCT' | 'VARIANT' | 'COLLECTION' | 'CUSTOMER' | 'ORDER' | 'SHOP' | 'PAGE' | 'BLOG' | 'ARTICLE';
  ownerId: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type MetafieldType = 
  | 'boolean'
  | 'color'
  | 'date'
  | 'date_time'
  | 'dimension'
  | 'file_reference'
  | 'json'
  | 'money'
  | 'multi_line_text_field'
  | 'number_decimal'
  | 'number_integer'
  | 'page_reference'
  | 'product_reference'
  | 'rating'
  | 'rich_text_field'
  | 'single_line_text_field'
  | 'url'
  | 'variant_reference'
  | 'volume'
  | 'weight';

// Shopify API Response Types
export interface ShopifyApiResponse<T> {
  data: T;
  extensions?: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
  errors?: ShopifyApiError[];
}

export interface ShopifyApiError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: {
    code: string;
    typeName?: string;
    fieldName?: string;
  };
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ShopifyConnection<T> {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: ShopifyPageInfo;
  totalCount?: number;
}

// Bulk Operations
export interface ShopifyBulkOperation {
  id: string;
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  errorCode?: string;
  
  // Progress
  createdAt: Date;
  completedAt?: Date;
  objectCount: number;
  
  // Results
  fileSize?: number;
  url?: string;
  partialDataUrl?: string;
  
  // Query
  query: string;
  rootField: string;
  type: 'QUERY' | 'MUTATION';
}

// Webhooks
export interface ShopifyWebhook {
  id: string;
  topic: WebhookTopic;
  address: string;
  format: 'json' | 'xml';
  
  // Configuration
  fields?: string[];
  metafieldNamespaces?: string[];
  privateMetafieldNamespaces?: string[];
  
  // Status
  createdAt: Date;
  updatedAt: Date;
  apiVersion: string;
}

export type WebhookTopic = 
  | 'app/uninstalled'
  | 'app/subscriptions/update'
  | 'app/subscriptions/approaching_capped_amount'
  | 'app/subscriptions/capped_amount_used'
  | 'carts/create'
  | 'carts/update'
  | 'checkouts/create'
  | 'checkouts/update'
  | 'checkouts/delete'
  | 'collections/create'
  | 'collections/delete'
  | 'collections/update'
  | 'customer_groups/create'
  | 'customer_groups/delete'
  | 'customer_groups/update'
  | 'customers/create'
  | 'customers/delete'
  | 'customers/disable'
  | 'customers/enable'
  | 'customers/update'
  | 'draft_orders/create'
  | 'draft_orders/delete'
  | 'draft_orders/update'
  | 'fulfillments/create'
  | 'fulfillments/update'
  | 'fulfillment_events/create'
  | 'fulfillment_events/delete'
  | 'inventory_items/create'
  | 'inventory_items/update'
  | 'inventory_items/delete'
  | 'inventory_levels/connect'
  | 'inventory_levels/update'
  | 'inventory_levels/disconnect'
  | 'locations/create'
  | 'locations/delete'
  | 'locations/update'
  | 'orders/cancelled'
  | 'orders/create'
  | 'orders/delete'
  | 'orders/fulfilled'
  | 'orders/paid'
  | 'orders/partially_fulfilled'
  | 'orders/updated'
  | 'order_transactions/create'
  | 'products/create'
  | 'products/delete'
  | 'products/update'
  | 'product_listings/add'
  | 'product_listings/remove'
  | 'product_listings/update'
  | 'refunds/create'
  | 'shop/update'
  | 'subscription_billing_attempts/challenged'
  | 'subscription_billing_attempts/failure'
  | 'subscription_billing_attempts/success'
  | 'subscription_contracts/create'
  | 'subscription_contracts/update'
  | 'themes/create'
  | 'themes/delete'
  | 'themes/publish'
  | 'themes/update';

// Session & Authentication
export interface ShopifySession {
  id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  
  // Token
  accessToken: string;
  expires?: Date;
  
  // User info (for online sessions)
  onlineAccessInfo?: {
    expires_in: number;
    associated_user_scope: string;
    associated_user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      email_verified: boolean;
      account_owner: boolean;
      locale: string;
      collaborator: boolean;
    };
  };
  
  // Scope
  scope?: string;
}

// GraphQL Query Building
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLMutation {
  mutation: string;
  variables?: Record<string, any>;
  operationName?: string;
}

// Product Status
export type ProductStatus = 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
export type ProductSortKeys = 
  | 'CREATED_AT'
  | 'ID'
  | 'INVENTORY_TOTAL'
  | 'PRODUCT_TYPE'
  | 'PUBLISHED_AT'
  | 'TITLE'
  | 'UPDATED_AT'
  | 'VENDOR';

// Collection Types
export type CollectionSortKeys = 
  | 'ID'
  | 'RELEVANCE'
  | 'TITLE'
  | 'UPDATED_AT';

// Common filters
export interface ProductFilters {
  ids?: string[];
  status?: ProductStatus[];
  productType?: string;
  vendor?: string;
  handle?: string;
  tag?: string;
  tagNot?: string;
  query?: string;
  createdAt?: DateFilter;
  updatedAt?: DateFilter;
  publishedAt?: DateFilter;
}

export interface CollectionFilters {
  ids?: string[];
  handle?: string;
  query?: string;
  publishedStatus?: 'PUBLISHED' | 'UNPUBLISHED';
  createdAt?: DateFilter;
  updatedAt?: DateFilter;
  publishedAt?: DateFilter;
}

export interface DateFilter {
  after?: Date;
  before?: Date;
  on?: Date;
}

// Pagination
export interface PaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface SortArgs<T> {
  sortKey: T;
  reverse?: boolean;
}