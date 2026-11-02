"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";
import { ProductQueryParams } from "@/types/catalog";

export function useCategories() {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: () => catalogService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useBrands(q: string = "") {
  return useQuery({
    queryKey: ["catalog", "brands", q],
    queryFn: () => catalogService.getBrands(q),
    staleTime: 1000 * 60 * 10,
  });
}

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ["catalog", "products", params],
    queryFn: () => catalogService.getProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["catalog", "product", slug],
    queryFn: () => catalogService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductVariant(slug: string, sku: string) {
  return useQuery({
    queryKey: ["catalog", "product-variant", slug, sku],
    queryFn: () => catalogService.getProductVariant(slug, sku),
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
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["catalog", "featured"],
    queryFn: () => catalogService.getFeaturedProducts(),
    staleTime: 1000 * 60 * 5,
  });
}
