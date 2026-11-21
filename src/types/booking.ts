import type { Car } from './car'

export interface Booking {
  id: number
  car_id: number
  start_date: string
  end_date: string
  total_price: string
  status: string
}

export interface CreateBookingData {
  car_id: number
  start_date: string
  end_date: string
}

export interface BookingWithCar extends Booking {
  car?: Partial<Car> & { make?: string }
  car_brand?: string
  make?: string
  car_model?: string
  model?: string
  brand?: string
}
