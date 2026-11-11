import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  cancelBooking,
  getBookings,
  type Booking,
} from '../api/bookings.api'

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    const loadBookings = async () => {
      try {
        const loadedBookings = await getBookings()

        if (isCurrentRequest) {
          setBookings(loadedBookings)
        }
      } catch {
        if (isCurrentRequest) {
          setError('Не вдалося завантажити бронювання.')
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }

    void loadBookings()

    return () => {
      isCurrentRequest = false
    }
  }, [])

  const handleCancel = async (id: number) => {
    setError('')
    setCancellingId(id)

    try {
      await cancelBooking(id)
      toast.success('Бронювання скасовано')
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === id
            ? { ...booking, status: 'cancelled' }
            : booking,
        ),
      )
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error(
          'Неможливо скасувати: час вийшов або статус вже змінено',
        )
        setError(
          'Неможливо скасувати: час вийшов або статус вже змінено',
        )
      } else {
        toast.error('Не вдалося скасувати бронювання.')
        setError('Не вдалося скасувати бронювання.')
      }
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Мої бронювання
        </h1>

        {loading && (
          <p className="py-8 text-center text-gray-600">Завантаження...</p>
        )}

        {!loading && error && (
          <p className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</p>
        )}

        {!loading && bookings.length === 0 && !error && (
          <p className="py-8 text-center text-gray-600">
            У вас ще немає бронювань.
          </p>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article
                className="rounded-lg bg-white p-6 shadow-md"
                key={booking.id}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Автомобіль #{booking.car_id}
                    </h2>
                    <p className="mt-2 text-gray-700">
                      З: {booking.start_date}
                    </p>
                    <p className="text-gray-700">
                      До: {booking.end_date}
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      Загальна ціна: {booking.total_price}
                    </p>
                    <p className="text-gray-700">
                      Статус: {booking.status}
                    </p>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button
                      className="h-fit rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                      disabled={cancellingId === booking.id}
                      onClick={() => void handleCancel(booking.id)}
                      type="button"
                    >
                      {cancellingId === booking.id
                        ? 'Скасування...'
                        : 'Скасувати'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Bookings
