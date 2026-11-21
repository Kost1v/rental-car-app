import { CalendarDays, CarFront, CheckCircle2, CircleX, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BookingWithCar } from '../types'

const getDateKey = (value: string) => value.slice(0, 10)
const getTodayKey = () => {
  const now = new Date()
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')
}

function StatusBadge({ status, startDate, endDate }: { status: string; startDate: string; endDate: string }) {
  const normalizedStatus = status.toLowerCase()
  if (normalizedStatus === 'cancelled') return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600"><CircleX className="h-3.5 w-3.5" /> Скасоване</span>
  const today = getTodayKey()
  if (normalizedStatus === 'confirmed' && startDate.slice(0, 10) <= today && endDate.slice(0, 10) >= today) return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Активне</span>
  if (normalizedStatus === 'confirmed' && endDate.slice(0, 10) < today) return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"><CheckCircle2 className="h-3.5 w-3.5" /> Виконано</span>
  if (normalizedStatus === 'confirmed' && startDate.slice(0, 10) > today) return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"><Clock3 className="h-3.5 w-3.5" /> Заплановане</span>
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"><Clock3 className="h-3.5 w-3.5" /> Завершене</span>
}

interface BookingCardProps {
  booking: BookingWithCar
  cancelling: boolean
  onCancel: (id: number) => void
}

function BookingCard({ booking, cancelling, onCancel }: BookingCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><CarFront className="h-5 w-5" /></span>
            <Link to={`/cars/${booking.car_id}`}><h2 className="text-lg font-extrabold text-slate-900">{booking.car?.brand && booking.car?.model ? `${booking.car.brand} ${booking.car.model}` : `Автомобіль #${booking.car_id}`}</h2></Link>
            <StatusBadge endDate={booking.end_date} startDate={booking.start_date} status={booking.status} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><CalendarDays className="h-5 w-5 text-indigo-600" /><div><p className="text-xs text-slate-400">Дати оренди</p><p className="text-sm font-bold text-slate-700">{booking.start_date} — {booking.end_date}</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><div><p className="text-xs text-slate-400">Загальна ціна</p><p className="text-sm font-extrabold text-slate-900">{booking.total_price}</p></div></div>
          </div>
        </div>
        {booking.status.toLowerCase() === 'confirmed' && getDateKey(booking.end_date) >= getTodayKey() && (
          <button className="cursor-pointer h-fit rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50" disabled={cancelling} onClick={() => onCancel(booking.id)} type="button">{cancelling ? 'Скасування...' : 'Скасувати'}</button>
        )}
      </div>
    </article>
  )
}

export default BookingCard
