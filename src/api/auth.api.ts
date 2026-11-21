import api from './axios'
import type { AuthResponse, LoginData, RegisterData } from '../types'

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
