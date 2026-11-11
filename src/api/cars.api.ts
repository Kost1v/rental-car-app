import api from './axios'

export interface Car {
  id: number
  brand: string
  model: string
  year: number
  category: string
  transmission: string
  fuel_type: string
  seats: number
  daily_price: string
  currency: string
  description: string
}

export interface GetCarsResponse {
  items: Car[]
  total: number
  page: number
  page_size: number
}

export interface GetCarsParams {
  category?: string | null
  sort?: string | null
  min_price?: string | number | null
  max_price?: string | number | null
  page?: string | number | null
  page_size?: string | number | null
}

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
