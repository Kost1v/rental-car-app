import api from './axios'
import type { Car } from './cars.api'

export interface FavoriteRecord {
  id?: number
  car_id?: number
  brand?: string
  make?: string
  model?: string
  car?: Partial<Car> & { make?: string }
}

export const getFavorites = async () => {
  const response = await api.get<FavoriteRecord[] | Car[]>('/favorites')
  return response.data
}

export const addFavorite = async (carId: number) => {
  await api.put<void>(`/favorites/${carId}`)
}

export const removeFavorite = async (carId: number) => {
  await api.delete<void>(`/favorites/${carId}`)
}
