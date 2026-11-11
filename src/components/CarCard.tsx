import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import type { Car } from '../api/cars.api'
import { addFavorite, removeFavorite } from '../api/favorites.api'

interface CarCardProps {
  car: Car
  initialIsFavorite?: boolean
}

function CarCard({ car, initialIsFavorite = false }: CarCardProps) {
  const [isFav, setIsFav] = useState(initialIsFavorite)
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false)
  const dailyPrice = Number(car.daily_price)
  const formattedPrice = Number.isFinite(dailyPrice)
    ? new Intl.NumberFormat('uk-UA').format(dailyPrice)
    : car.daily_price

  const handleFavoriteToggle = async () => {
    const previousIsFavorite = isFav
    const nextIsFavorite = !previousIsFavorite
    setIsFav(nextIsFavorite)
    setIsUpdatingFavorite(true)

    try {
      if (nextIsFavorite) {
        await addFavorite(car.id)
        toast.success('Додано в улюблені')
      } else {
        await removeFavorite(car.id)
        toast.success('Видалено з улюблених')
      }
    } catch {
      setIsFav(previousIsFavorite)
      toast.error('Не вдалося оновити улюблені')
    } finally {
      setIsUpdatingFavorite(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-md">
      <Link
        className="block"
        to={`/cars/${car.id}`}
      >
        <img
          alt={`${car.brand} ${car.model}`}
          className="h-48 w-full object-cover"
          src="https://placehold.co/600x400?text=Car"
        />
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {car.brand} {car.model}
          </h2>
          <button
            aria-label={
              isFav
                ? `Видалити ${car.brand} ${car.model} з улюблених`
                : `Додати ${car.brand} ${car.model} до улюблених`
            }
            className={`rounded-full p-2 text-2xl leading-none hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 ${
              isFav ? 'text-red-600' : 'text-gray-400'
            }`}
            disabled={isUpdatingFavorite}
            onClick={() => void handleFavoriteToggle()}
            type="button"
          >
            {isFav ? '♥' : '♡'}
          </button>
        </div>
        <p className="mt-2 text-gray-600">Рік: {car.year}</p>
        <p className="text-gray-600">Категорія: {car.category}</p>
        <p className="mt-3 text-lg font-semibold text-gray-900">
          {formattedPrice} {car.currency} / доба
        </p>
        <Link
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          to={`/cars/${car.id}`}
        >
          Детальніше
        </Link>
      </div>
    </article>
  )
}

export default CarCard
