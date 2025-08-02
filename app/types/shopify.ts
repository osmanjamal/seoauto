// Shopify Resource Types
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  seo: ShopifySEO;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage;
  seo: ShopifySEO;
  products: ShopifyProduct[];
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText?: string;
  width: number;
  height: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  sku?: string;
  barcode?: string;
  image?: ShopifyImage;
}

export interface ShopifySEO {
  title?: string;
  description?: string;
}

export interface ShopifyPage {
  id: string;
  title: string;
  handle: string;
  body: string;
  seo: ShopifySEO;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyShop {
  id: string;
  name: string;
  domain: string;
  email: string;
  currency: string;
  timezone: string;
  plan: string;
}