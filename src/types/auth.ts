export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  is_staff: boolean;
  is_active: boolean;
  date_joined?: string;
  avatar?: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  phone_number?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface SendOTPPayload {
  email: string;
}

export interface VerifyOTPPayload {
  email: string;
  code: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  message?: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}
