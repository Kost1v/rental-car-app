import type { FormEvent } from 'react'
import type { Booking, Car } from '../types'
import DatePicker from './DatePicker'

interface BookingFormProps {
  car: Car
  carId: number
  carBookings: Booking[]
  today: string
  startDate: string
  endDate: string
  isBooking: boolean
  error: string
  accessToken: string | null
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const formatBookingDate = (value: string) => {
  const dateKey = value.slice(0, 10)
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) return value
  return new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(new Date(year, month - 1, day))
}

function BookingForm({
  car, carId, carBookings, today, startDate, endDate, isBooking, error, accessToken,
  onStartDateChange, onEndDateChange, onSubmit,
}: BookingFormProps) {
  const dailyPrice = Number(car.daily_price)
  const formattedPrice = Number.isFinite(dailyPrice)
    ? new Intl.NumberFormat('uk-UA').format(dailyPrice)
    : car.daily_price
  const bookingDays = startDate && endDate && endDate >= startDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1)
    : 0
  const totalPrice = Number.isFinite(dailyPrice) && bookingDays > 0 ? dailyPrice * bookingDays : 0

  return (
    <section className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 lg:col-span-4 lg:sticky lg:top-24">
      <h2 className="text-xl font-extrabold text-slate-900">Забронювати автомобіль</h2>
      <form className="mt-6 space-y-4" noValidate onSubmit={onSubmit}>
        <DatePicker id="start-date" label="Дата початку" minDate={today} onChange={onStartDateChange} value={startDate} />
        <DatePicker id="end-date" label="Дата завершення" minDate={startDate || today} onChange={onEndDateChange} value={endDate} />
        {accessToken && carBookings.some((booking) => booking.car_id === carId) && (
          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            {carBookings.filter((booking) => booking.car_id === carId).map((booking) => (
              <p className="text-sm font-semibold text-amber-800" key={booking.id}>
                Авто вже заброньоване з {formatBookingDate(booking.start_date)} по {formatBookingDate(booking.end_date)}
              </p>
            ))}
          </div>
        )}
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        {bookingDays > 0 && (
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{bookingDays} дн. × {formattedPrice} {car.currency}</span>
              <span className="text-lg font-extrabold text-slate-900">
                {new Intl.NumberFormat('uk-UA').format(totalPrice)} {car.currency}
              </span>
            </div>
          </div>
        )}
        <button className="w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50" disabled={isBooking} type="submit">
          {isBooking ? 'Бронювання...' : 'Забронювати'}
        </button>
      </form>
    </section>
  )
}

export default BookingForm
