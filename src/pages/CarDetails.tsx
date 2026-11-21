import { type FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft, Box, Fuel, Gauge, Image, Users, Settings2 } from 'lucide-react'
import { createBooking, getBookings } from '../api/bookings.api'
import { getCarById } from '../api/cars.api'
import AuthRequiredModal from '../components/AuthRequiredModal'
import BookingForm from '../components/BookingForm'
import Car3DViewer from '../components/Car3DViewer'
import { fallbackCarImage, getCarMedia } from '../data/carMedia'
import type { Booking, Car } from '../types'
import type { RootState } from '../store/store'

function CarDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<Car | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState('')
  const [carBookings, setCarBookings] = useState<Booking[]>([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [mediaTab, setMediaTab] = useState<'photo' | '3d'>('photo')
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const today = [new Date().getFullYear(), String(new Date().getMonth() + 1).padStart(2, '0'), String(new Date().getDate()).padStart(2, '0')].join('-')

  useEffect(() => {
    let isCurrentRequest = true
    const loadCar = async () => {
      if (!id) { setError('Автомобіль не знайдено.'); setLoading(false); return }
      try {
        const loadedCar = await getCarById(id)
        if (isCurrentRequest) setCar(loadedCar)
      } catch {
        if (isCurrentRequest) setError('Не вдалося завантажити дані автомобіля.')
      } finally {
        if (isCurrentRequest) setLoading(false)
      }
    }
    void loadCar()
    return () => { isCurrentRequest = false }
  }, [id])

  useEffect(() => {
    if (!accessToken || !id) return
    let isCurrentRequest = true
    const loadBookings = async () => {
      try {
        const loadedBookings = await getBookings()
        if (isCurrentRequest) {
          setCarBookings(loadedBookings.filter((booking) =>
            booking.car_id === Number(id) &&
            booking.status.toLowerCase() === 'confirmed' &&
            booking.end_date.slice(0, 10) >= today,
          ).sort((a, b) => a.start_date.localeCompare(b.start_date)))
        }
      } catch {
        if (isCurrentRequest) setCarBookings([])
      }
    }
    void loadBookings()
    return () => { isCurrentRequest = false }
  }, [accessToken, id, today])

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accessToken) { setIsAuthModalOpen(true); return }
    if (!id || !startDate || !endDate) { setError('Некоректні дати бронювання'); return }
    if (startDate < today) { setError('Дата початку не може бути в минулому'); return }
    if (endDate < startDate) { setError('Дата завершення не може бути раніше дати початку'); return }
    setError('')
    setIsBooking(true)
    try {
      await createBooking({ car_id: Number(id), start_date: startDate, end_date: endDate })
      toast.success('Авто успішно заброньовано!')
      navigate('/bookings')
    } catch {
      setError('Не вдалося створити бронювання.')
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) return <p className="py-8 text-center text-gray-600">Завантаження...</p>
  if (error && !car) return <p className="p-8 text-center text-red-600">{error}</p>
  if (!car) return null

  const dailyPrice = Number(car.daily_price)
  const formattedPrice = Number.isFinite(dailyPrice) ? new Intl.NumberFormat('uk-UA').format(dailyPrice) : car.daily_price
  const { imageUrl, modelUrl } = getCarMedia(car)

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <button className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600" onClick={() => navigate(-1)} type="button"><ArrowLeft className="h-4 w-4" />Повернутися до каталогу</button>
        <div className="grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-8">
            {modelUrl && (
              <div className="mb-4 flex w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${mediaTab === 'photo' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setMediaTab('photo')}
                  type="button"
                >
                  <Image className="h-4 w-4" />
                  Фото
                </button>
                <button
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${mediaTab === '3d' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setMediaTab('3d')}
                  type="button"
                >
                  <Box className="h-4 w-4" />
                  3D-огляд
                </button>
              </div>
            )}
            {modelUrl && mediaTab === '3d' ? (
              <Car3DViewer key={modelUrl} alt={`${car.brand} ${car.model}`} modelUrl={modelUrl} posterUrl={imageUrl} />
            ) : (
              <img
                alt={`${car.brand} ${car.model}`}
                className="h-70 w-full rounded-3xl object-cover shadow-sm sm:h-105"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = fallbackCarImage
                }}
                src={imageUrl}
              />
            )}
            <div className="pt-6">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600">{car.category}</span>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">{car.brand} {car.model}</h1>
              <p className="mt-2 text-xl font-bold text-slate-900">{formattedPrice} {car.currency} / доба</p>
              <p className="mt-5 max-w-3xl leading-7 text-slate-600">{car.description}</p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Gauge, label: 'Рік', value: car.year },
                  { icon: Settings2, label: 'Трансмісія', value: car.transmission },
                  { icon: Fuel, label: 'Пальне', value: car.fuel_type },
                  { icon: Users, label: 'Місця', value: car.seats },
                ].map(({ icon: Icon, label, value }) => (
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4" key={label}><Icon className="h-5 w-5 text-indigo-600" /><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div>
                ))}
              </div>
            </div>
          </section>
          <BookingForm
            accessToken={accessToken}
            car={car}
            carBookings={carBookings}
            carId={Number(id)}
            endDate={endDate}
            error={error}
            isBooking={isBooking}
            onEndDateChange={(value) => { setEndDate(value); setError('') }}
            onStartDateChange={(value) => { setStartDate(value); if (endDate && endDate < value) setEndDate(''); setError('') }}
            onSubmit={handleBooking}
            startDate={startDate}
            today={today}
          />
        </div>
      </div>
      <AuthRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={() => { setIsAuthModalOpen(false); navigate('/login') }} />
    </main>
  )
}

export default CarDetails
