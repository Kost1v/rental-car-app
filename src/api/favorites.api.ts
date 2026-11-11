import api from './axios'
import type { Car } from './cars.api'

export const getFavorites = async () => {
  const response = await api.get<Car[]>('/favorites')
  return response.data
}

export const addFavorite = async (carId: number) => {
  await api.put<void>(`/favorites/${carId}`)
}

export const removeFavorite = async (carId: number) => {
  await api.delete<void>(`/favorites/${carId}`)
}
