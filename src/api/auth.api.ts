import api from './axios'

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
  user: Record<string, unknown>
  access_token: string
  refresh_token: string
}

export const login = async (data: LoginData) => {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const logout = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export const getMe = async () => {
  const response = await api.get<AuthResponse['user']>('/auth/me')
  return response.data
}

export const authApi = {
  login,
  register,
  logout,
  getMe,
}
