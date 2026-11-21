import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import { CalendarDays, CarFront, CheckCircle2, CircleX, Clock3, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  cancelBooking,
  getBookings,
  type Booking,
} from '../api/bookings.api'
import { getCarById, type Car } from '../api/cars.api'

interface BookingWithCar extends Booking {
  car?: Partial<Car> & { make?: string }
  car_brand?: string
  make?: string
  car_model?: string
  model?: string
  brand?: string
}

const getDateKey = (value: string) => value.slice(0, 10)

const getTodayKey = () => {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function StatusBadge({
  status,
  startDate,
  endDate,
}: {
  status: string
  startDate: string
  endDate: string
}) {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
        <CircleX className="h-3.5 w-3.5" /> Скасоване
      </span>
    )
  }

  const today = getTodayKey()
  const bookingStart = getDateKey(startDate)
  const bookingEnd = getDateKey(endDate)

  if (normalizedStatus === 'confirmed' && bookingStart <= today && bookingEnd >= today) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> Активне
      </span>
    )
  }

  if (normalizedStatus === 'confirmed' && bookingEnd < today) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> Виконано
      </span>
    )
  }

  if (normalizedStatus === 'confirmed' && bookingStart > today) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
        <Clock3 className="h-3.5 w-3.5" /> Заплановане
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
      <Clock3 className="h-3.5 w-3.5" /> Завершене
    </span>
  )
}

function Bookings() {
  const [bookings, setBookings] = useState<BookingWithCar[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    const loadBookings = async () => {
      try {
        const loadedBookings = await getBookings()

        if (isCurrentRequest) {
          const resolvedBookings = await Promise.all(
            loadedBookings.map(async (booking) => {
              const bookingWithCar = booking as BookingWithCar
              const nestedCar = bookingWithCar.car
              const brand =
                bookingWithCar.brand ??
                bookingWithCar.make ??
                bookingWithCar.car_brand ??
                nestedCar?.brand ??
                nestedCar?.make ??
                ''
              const model =
                bookingWithCar.model ??
                bookingWithCar.car_model ??
                nestedCar?.model ??
                ''

              if (brand && model) {
                return {
                  ...bookingWithCar,
                  car: {
                    ...nestedCar,
                    brand,
                    model,
                  },
                }
              }

              try {
                const car = await getCarById(booking.car_id)
                return {
                  ...bookingWithCar,
                  car,
                }
              } catch {
                return bookingWithCar
              }
            }),
          )

          setBookings(resolvedBookings)
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
        setError(
          'Неможливо скасувати: час вийшов або статус вже змінено',
        )
      } else {
        setError('Не вдалося скасувати бронювання.')
      }
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">
          Мої бронювання
        </h1>

        {loading && (
          <p className="py-8 text-center text-gray-600">Завантаження...</p>
        )}

        {!loading && error && (
          <p className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</p>
        )}

        {!loading && bookings.length === 0 && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <CalendarDays className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-slate-900">Бронювань ще немає</h2>
            <p className="mt-2 text-slate-500">Оберіть автомобіль і сплануйте наступну поїздку.</p>
            <Link className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white" to="/cars">
              <Search className="h-4 w-4" /> Знайти авто
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
                key={booking.id}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <CarFront className="h-5 w-5" />
                      </span>
                      <Link
                        to={`/cars/${booking.car_id}`}
                      >
                        <h2 className="text-lg font-extrabold text-slate-900">
                          {booking.car?.brand && booking.car?.model
                            ? `${booking.car.brand} ${booking.car.model}`
                            : `Автомобіль #${booking.car_id}`}
                        </h2>
                      </Link>
                      <StatusBadge
                        endDate={booking.end_date}
                        startDate={booking.start_date}
                        status={booking.status}
                      />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <CalendarDays className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-xs text-slate-400">Дати оренди</p>
                          <p className="text-sm font-bold text-slate-700">{booking.start_date} — {booking.end_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-slate-400">Загальна ціна</p>
                          <p className="text-sm font-extrabold text-slate-900">{booking.total_price}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.status.toLowerCase() === 'confirmed' &&
                    getDateKey(booking.end_date) >= getTodayKey() && (
                    <button
                      className="h-fit rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
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
