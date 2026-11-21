export type AuthUser = Record<string, unknown>

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  full_name: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: AuthUser
  access_token: string
  refresh_token: string
}
