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
  image_url?: string | null
  imageUrl?: string | null
  photo_url?: string | null
  photoUrl?: string | null
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

export interface FavoriteRecord {
  id?: number
  car_id?: number
  brand?: string
  make?: string
  model?: string
  car?: Partial<Car> & { make?: string }
}
