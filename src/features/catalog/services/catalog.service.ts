import apiClient from "@/lib/api-client";
import {
  Brand,
  Category,
  DynamicFilters,
  Product,
  ProductQueryParams,
  ProductVariant,
  SearchSuggestions,
} from "@/types/catalog";
import { PaginatedResponse } from "@/types/common";

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[] | PaginatedResponse<Category>>(
      "/api/v1/catalog/categories/"
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<Category>).results || [];
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<Category>(
      `/api/v1/catalog/categories/${slug}/`
    );
    return response.data;
  },

  async getBrands(q: string = ""): Promise<Brand[]> {
    const response = await apiClient.get<Brand[] | PaginatedResponse<Brand>>(
      "/api/v1/catalog/brands/",
      { params: { q } }
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<Brand>).results || [];
  },

  async getBrandBySlug(slug: string): Promise<Brand> {
    const response = await apiClient.get<Brand>(`/api/v1/catalog/brands/${slug}/`);
    return response.data;
  },

  async getProducts(
    params: ProductQueryParams = {}
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "/api/v1/catalog/products/",
      { params }
    );
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(
      `/api/v1/catalog/products/${slug}/`
    );
    return response.data;
  },

  async getProductVariant(slug: string, sku: string): Promise<ProductVariant> {
    const response = await apiClient.get<ProductVariant>(
      `/api/v1/catalog/products/${slug}/variants/${sku}/`
    );
    return response.data;
  },

  async getFilters(category?: string): Promise<DynamicFilters> {
    const response = await apiClient.get<DynamicFilters>("/api/v1/catalog/filters/", {
      params: category ? { category } : undefined,
    });
    return response.data;
  },

  async getSearchSuggestions(query: string): Promise<SearchSuggestions> {
    if (!query || query.trim().length === 0) {
      return { products: [], categories: [], brands: [] };
    }
    const response = await apiClient.get<SearchSuggestions>(
      "/api/v1/catalog/search/suggest/",
      { params: { q: query } }
    );
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[] | PaginatedResponse<Product>>(
      "/api/v1/catalog/featured/"
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<Product>).results || [];
  },
};
