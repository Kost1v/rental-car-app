import api from './axios'

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

export const getBookings = async () => {
  const response = await api.get<Booking[]>('/bookings')
  return response.data
}

export const cancelBooking = async (id: number) => {
  await api.post<void>(`/bookings/${id}/cancel`)
}

export const createBooking = async (data: CreateBookingData) => {
  const response = await api.post<Booking>('/bookings', data, {
    headers: {
      'Idempotency-Key': crypto.randomUUID(),
    },
  })

  return response.data
}
