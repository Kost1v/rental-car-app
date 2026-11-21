import { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Box, Heart, Users } from 'lucide-react'
import type { Car } from '../types'
import { addFavorite, removeFavorite } from '../api/favorites.api'
import { fallbackCarImage, getCarMedia } from '../data/carMedia'
import type { RootState } from '../store/store'

interface CarCardProps {
  car: Car
  initialIsFavorite?: boolean
  isFavorite?: boolean
  isUpdatingFavorite?: boolean
  onFavoriteToggle?: (car: Car) => void
}

function CarCard({
  car,
  initialIsFavorite = false,
  isFavorite,
  isUpdatingFavorite,
  onFavoriteToggle,
}: CarCardProps) {
  const [localIsFavorite, setLocalIsFavorite] = useState(initialIsFavorite)
  const [localIsUpdating, setLocalIsUpdating] = useState(false)
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const isAuthenticated = Boolean(accessToken)
  const isFav = isFavorite ?? localIsFavorite
  const favoriteIsUpdating = isUpdatingFavorite ?? localIsUpdating
  const dailyPrice = Number(car.daily_price)
  const formattedPrice = Number.isFinite(dailyPrice)
    ? new Intl.NumberFormat('uk-UA').format(dailyPrice)
    : car.daily_price
  const { imageUrl, modelUrl } = getCarMedia(car)

  const handleFavoriteToggle = async () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(car)
      return
    }

    const previousIsFavorite = isFav
    const nextIsFavorite = !previousIsFavorite
    setLocalIsFavorite(nextIsFavorite)
    setLocalIsUpdating(true)

    try {
      if (nextIsFavorite) {
        await addFavorite(car.id)
        toast.success('Додано в улюблені')
      } else {
        await removeFavorite(car.id)
        toast.success('Видалено з улюблених')
      }
    } catch {
      setLocalIsFavorite(previousIsFavorite)
      toast.error('Не вдалося оновити улюблені')
    } finally {
      setLocalIsUpdating(false)
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Link className="block" to={`/cars/${car.id}`}>
          <img
            alt={`${car.brand} ${car.model}`}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = fallbackCarImage
            }}
            src={imageUrl}
          />
        </Link>
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-slate-900/75 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur-md">
          {car.category}
        </span>
        {modelUrl && (
          <span className="absolute left-4 top-14 flex items-center gap-1 rounded-full border border-white/70 bg-indigo-600/95 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
            <Box className="h-3.5 w-3.5" />
            3D
          </span>
        )}
        {isAuthenticated && (
          <button
            aria-label={isFav ? `Видалити ${car.brand} ${car.model} з улюблених` : `Додати ${car.brand} ${car.model} до улюблених`}
            className={`cursor-pointer absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-sm backdrop-blur-md transition hover:scale-105 disabled:opacity-50 ${
              isFav ? 'text-rose-500' : 'text-slate-500'
            }`}
            disabled={favoriteIsUpdating}
            onClick={() => void handleFavoriteToggle()}
            type="button"
          >
            <Heart className="h-5 w-5" fill={isFav ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            <Link
              className="hover:text-indigo-600 transition-colors"
              to={`/cars/${car.id}`}
            >
              {car.brand} {car.model}
            </Link>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
          <span>{car.year}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {car.seats}</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <p>
            <span className="text-xl font-extrabold text-slate-900">{formattedPrice}</span>
            <span className="ml-1 text-sm font-semibold text-slate-500">{car.currency} / день</span>
          </p>
        </div>
        <Link
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700"
          to={`/cars/${car.id}`}
        >
          Детальніше →
        </Link>
      </div>
    </article>
  )
}

export default CarCard
