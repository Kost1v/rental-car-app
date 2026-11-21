import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import { CalendarDays, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cancelBooking, getBookings } from '../api/bookings.api'
import { getCarById } from '../api/cars.api'
import BookingCard from '../components/BookingCard'
import type { BookingWithCar } from '../types'

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
          const resolvedBookings = await Promise.all(loadedBookings.map(async (booking) => {
            const bookingWithCar = booking as BookingWithCar
            const nestedCar = bookingWithCar.car
            const brand = bookingWithCar.brand ?? bookingWithCar.make ?? bookingWithCar.car_brand ?? nestedCar?.brand ?? nestedCar?.make ?? ''
            const model = bookingWithCar.model ?? bookingWithCar.car_model ?? nestedCar?.model ?? ''
            if (brand && model) return { ...bookingWithCar, car: { ...nestedCar, brand, model } }
            try { return { ...bookingWithCar, car: await getCarById(booking.car_id) } } catch { return bookingWithCar }
          }))
          setBookings(resolvedBookings)
        }
      } catch {
        if (isCurrentRequest) setError('Не вдалося завантажити бронювання.')
      } finally {
        if (isCurrentRequest) setLoading(false)
      }
    }
    void loadBookings()
    return () => { isCurrentRequest = false }
  }, [])

  const handleCancel = async (id: number) => {
    setError('')
    setCancellingId(id)
    try {
      await cancelBooking(id)
      toast.success('Бронювання скасовано')
      setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: 'cancelled' } : booking))
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) setError('Неможливо скасувати: час вийшов або статус вже змінено')
      else setError('Не вдалося скасувати бронювання.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">Мої бронювання</h1>
        {loading && <p className="py-8 text-center text-gray-600">Завантаження...</p>}
        {!loading && error && <p className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</p>}
        {!loading && bookings.length === 0 && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><CalendarDays className="h-7 w-7" /></span>
            <h2 className="mt-5 text-xl font-extrabold text-slate-900">Бронювань ще немає</h2>
            <p className="mt-2 text-slate-500">Оберіть автомобіль і сплануйте наступну поїздку.</p>
            <Link className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white" to="/cars"><Search className="h-4 w-4" /> Знайти авто</Link>
          </div>
        )}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => <BookingCard booking={booking} cancelling={cancellingId === booking.id} key={booking.id} onCancel={(id) => void handleCancel(id)} />)}
          </div>
        )}
      </div>
    </main>
  )
}

export default Bookings
