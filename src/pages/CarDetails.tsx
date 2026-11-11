import { type FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { createBooking } from '../api/bookings.api'
import { getCarById, type Car } from '../api/cars.api'

function CarDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<Car | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    const loadCar = async () => {
      if (!id) {
        setError('Автомобіль не знайдено.')
        setLoading(false)
        return
      }

      try {
        const loadedCar = await getCarById(id)

        if (isCurrentRequest) {
          setCar(loadedCar)
        }
      } catch {
        if (isCurrentRequest) {
          setError('Не вдалося завантажити дані автомобіля.')
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }

    void loadCar()

    return () => {
      isCurrentRequest = false
    }
  }, [id])

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const currentDate = new Date()
    const today = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, '0'),
      String(currentDate.getDate()).padStart(2, '0'),
    ].join('-')

    if (
      !id ||
      !startDate ||
      !endDate ||
      startDate < today ||
      endDate < startDate
    ) {
      toast.error('Некоректні дати бронювання')
      setError('Некоректні дати бронювання')
      return
    }

    setError('')
    setIsBooking(true)

    try {
      await createBooking({
        car_id: Number(id),
        start_date: startDate,
        end_date: endDate,
      })
      toast.success('Авто успішно заброньовано!')
      navigate('/bookings')
    } catch {
      setError('Не вдалося створити бронювання.')
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-gray-600">Завантаження...</p>
  }

  if (error && !car) {
    return <p className="p-8 text-center text-red-600">{error}</p>
  }

  if (!car) {
    return null
  }

  const dailyPrice = Number(car.daily_price)
  const formattedPrice = Number.isFinite(dailyPrice)
    ? new Intl.NumberFormat('uk-UA').format(dailyPrice)
    : car.daily_price

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <button
          className="mb-6 rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          onClick={() => navigate(-1)}
          type="button"
        >
          ← Повернутися до каталогу
        </button>
        <div className="grid gap-8 md:grid-cols-2">
        <section className="overflow-hidden rounded-lg bg-white shadow-md">
          <img
            alt={`${car.brand} ${car.model}`}
            className="h-72 w-full object-cover"
            src="https://placehold.co/600x400?text=Car"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {formattedPrice} {car.currency} / доба
            </p>
            <p className="mt-4 text-gray-700">{car.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <dt className="font-semibold">Рік</dt>
                <dd>{car.year}</dd>
              </div>
              <div>
                <dt className="font-semibold">Категорія</dt>
                <dd>{car.category}</dd>
              </div>
              <div>
                <dt className="font-semibold">Коробка передач</dt>
                <dd>{car.transmission}</dd>
              </div>
              <div>
                <dt className="font-semibold">Тип пального</dt>
                <dd>{car.fuel_type}</dd>
              </div>
              <div>
                <dt className="font-semibold">Місця</dt>
                <dd>{car.seats}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="h-fit rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900">
            Забронювати автомобіль
          </h2>

          {error && <p className="mt-4 text-red-600">{error}</p>}

          <form className="mt-6 space-y-4" onSubmit={handleBooking}>
            <label className="block text-gray-700" htmlFor="start-date">
              Дата початку
              <input
                className="mt-1 w-full rounded border p-2"
                id="start-date"
                onChange={(event) => setStartDate(event.target.value)}
                required
                type="date"
                value={startDate}
              />
            </label>

            <label className="block text-gray-700" htmlFor="end-date">
              Дата завершення
              <input
                className="mt-1 w-full rounded border p-2"
                id="end-date"
                onChange={(event) => setEndDate(event.target.value)}
                required
                type="date"
                value={endDate}
              />
            </label>

            <button
              className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isBooking}
              type="submit"
            >
              {isBooking ? 'Бронювання...' : 'Забронювати'}
            </button>
          </form>
        </section>
        </div>
      </div>
    </main>
  )
}

export default CarDetails
