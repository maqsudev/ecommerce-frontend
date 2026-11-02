export interface ReviewUser {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface ReviewImage {
  id: number;
  image: string;
  created_at?: string;
}

export interface ReviewReply {
  id?: number;
  comment: string;
  author: string;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user: ReviewUser;
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  unhelpful_votes: number;
  user_vote?: "HELPFUL" | "UNHELPFUL" | null;
  reply?: ReviewReply | null;
  images: ReviewImage[];
  status?: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  updated_at?: string;
}

export interface RatingSummary {
  average_rating: number;
  total_reviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recommendation_percentage: number;
}

export interface CreateReviewPayload {
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
  pros?: string;
  cons?: string;
}

export interface VoteReviewPayload {
  vote_type: "HELPFUL" | "UNHELPFUL";
}

export interface ReplyReviewPayload {
  comment: string;
}

export interface ModerateReviewPayload {
  status: "APPROVED" | "REJECTED";
  rejection_reason?: string;
}
