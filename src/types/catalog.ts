export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  parent?: number | null;
  children?: Category[];
  product_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string;
  product_count?: number;
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
  alt_text?: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: string | number;
  compare_at_price?: string | number | null;
  stock_quantity: number;
  in_stock: boolean;
  image?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category: Category | number;
  brand?: Brand | null;
  base_price: string | number;
  discount_price?: string | number | null;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  in_stock?: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes?: Record<string, any>;
  created_at?: string;
}

export interface DynamicFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface DynamicFilterAttribute {
  code: string;
  name: string;
  options: DynamicFilterOption[];
}

export interface DynamicFilters {
  categories: Category[];
  brands: Brand[];
  price_range: {
    min: number;
    max: number;
  };
  attributes: DynamicFilterAttribute[];
}

export interface SearchSuggestionItem {
  id: number;
  name: string;
  slug: string;
  price?: number;
  image?: string;
}

export interface SearchSuggestions {
  products: SearchSuggestionItem[];
  categories: { id: number; name: string; slug: string }[];
  brands: { id: number; name: string; slug: string }[];
}

export interface ProductQueryParams {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  q?: string;
  ordering?: "-created_at" | "created_at" | "base_price" | "-base_price" | "-rating";
  page?: number;
  page_size?: number;
  [key: `attr_${string}`]: string | undefined;
}
