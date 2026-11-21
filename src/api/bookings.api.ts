import api from './axios'
import type { Booking, CreateBookingData } from '../types'

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
