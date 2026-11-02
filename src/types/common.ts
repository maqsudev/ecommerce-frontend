export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

export interface BaseQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}
