// Strapi v5 Response Types
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
  meta?: any;
}

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: StrapiMediaFormat;
      small?: StrapiMediaFormat;
      medium?: StrapiMediaFormat;
      large?: StrapiMediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
  url?: string; // Direct URL access for convenience
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Common content types
export interface StrapiSeo {
  title?: string;
  description?: string;
  metaImage?: StrapiData<StrapiMedia>;
  keywords?: string;
  metaRobots?: string;
  metaViewport?: string;
  canonicalURL?: string;
}

export interface StrapiLocalization {
  locale: string;
  localizations?: {
    data: StrapiData<any>[];
  };
}

// Blog Post Types
export interface BlogPost {
  title: string;
  slug: string;
  content?: any;
  excerpt?: string;
  publishedAt?: string;
  metadata: StrapiSeo;
  featuredImage?: StrapiData<StrapiMedia>;
}

// Helper types for content
export type StrapiContent<T> = StrapiData<T & StrapiLocalization>;
export type StrapiContentList<T> = StrapiResponse<StrapiContent<T>[]>;
export type StrapiSingleContent<T> = StrapiResponse<StrapiContent<T>>;
