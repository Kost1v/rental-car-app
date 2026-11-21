import api from './axios'
import type { Car, GetCarsParams, GetCarsResponse } from '../types'

export const getCars = async (params: GetCarsParams) => {
  const filteredParams = Object.entries(params).reduce<
    Record<string, string | number>
  >((result, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value
    }

    return result
  }, {})

  const response = await api.get<GetCarsResponse>('/cars', {
    params: filteredParams,
  })

  return response.data
}

export const getCarById = async (id: string | number) => {
  const response = await api.get<Car>(`/cars/${id}`)
  return response.data
}
