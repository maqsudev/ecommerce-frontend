import apiClient from "@/lib/api-client";
import {
  CreateReviewPayload,
  RatingSummary,
  Review,
  VoteReviewPayload,
} from "@/types/reviews";
import { PaginatedResponse } from "@/types/common";

export const reviewsService = {
  async getRatingSummary(productId: number): Promise<RatingSummary> {
    const response = await apiClient.get<RatingSummary>(
      `/api/v1/reviews/products/${productId}/summary/`
    );
    return response.data;
  },

  async getProductReviews(
    productId: number,
    params: { rating?: number; verified_only?: boolean; ordering?: string } = {}
  ): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/api/v1/reviews/products/${productId}/`,
      { params }
    );
    return response.data;
  },

  async createReview(
    productId: number,
    payload: CreateReviewPayload
  ): Promise<Review> {
    const response = await apiClient.post<Review>(
      `/api/v1/reviews/products/${productId}/`,
      payload
    );
    return response.data;
  },

  async voteReview(
    reviewId: number,
    payload: VoteReviewPayload
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `/api/v1/reviews/${reviewId}/vote/`,
      payload
    );
    return response.data;
  },
};
