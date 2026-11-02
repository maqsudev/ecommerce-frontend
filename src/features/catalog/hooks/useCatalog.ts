"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";
import { ProductQueryParams } from "@/types/catalog";
import { MOCK_CATEGORIES, MOCK_BRANDS, MOCK_PRODUCTS } from "@/lib/mock-engine";

export function useCategories() {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: () => catalogService.getCategories(),
    placeholderData: MOCK_CATEGORIES,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBrands(q: string = "") {
  return useQuery({
    queryKey: ["catalog", "brands", q],
    queryFn: () => catalogService.getBrands(q),
    placeholderData: MOCK_BRANDS,
    staleTime: 1000 * 60 * 10,
  });
}

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ["catalog", "products", params],
    queryFn: () => catalogService.getProducts(params),
    placeholderData: (previousData) =>
      previousData || {
        count: MOCK_PRODUCTS.length,
        next: null,
        previous: null,
        results: MOCK_PRODUCTS,
      },
    staleTime: 1000 * 60 * 2,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["catalog", "product", slug],
    queryFn: () => catalogService.getProductBySlug(slug),
    placeholderData: () => MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0],
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductVariant(slug: string, sku: string) {
  return useQuery({
    queryKey: ["catalog", "product-variant", slug, sku],
    queryFn: () => catalogService.getProductVariant(slug, sku),
    placeholderData: () => {
      for (const p of MOCK_PRODUCTS) {
        const v = p.variants.find((v) => v.sku === sku);
        if (v) return v;
      }
      return MOCK_PRODUCTS[0].variants[0];
    },
    enabled: !!slug && !!sku,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCatalogFilters(category?: string) {
  return useQuery({
    queryKey: ["catalog", "filters", category],
    queryFn: () => catalogService.getFilters(category),
    staleTime: 1000 * 60 * 10,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["catalog", "suggestions", query],
    queryFn: () => catalogService.getSearchSuggestions(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["catalog", "featured"],
    queryFn: () => catalogService.getFeaturedProducts(),
    placeholderData: MOCK_PRODUCTS.filter((p) => p.is_featured),
    staleTime: 1000 * 60 * 5,
  });
}
