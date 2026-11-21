import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites.api'
import { getCarById } from '../api/cars.api'
import type { Car, FavoriteRecord } from '../types'
import type { RootState } from '../store/store'

let favoritesRequest: Promise<FavoriteRecord[] | Car[]> | null = null

export function useFavorites() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(Boolean(accessToken))
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    if (!accessToken) {
      queueMicrotask(() => {
        setLoading(false)
        setFavoriteIds([])
        setFavoriteCars([])
      })
      return
    }

    let isCurrent = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        favoritesRequest ??= getFavorites()
        const records = await favoritesRequest
        if (!isCurrent) return

        const resolved = await Promise.all(records.map(async (favorite) => {
          const record = favorite as FavoriteRecord
          const carId = record.id ?? record.car_id ?? record.car?.id
          const brand = record.brand ?? record.make ?? record.car?.brand ?? record.car?.make ?? ''
          const model = record.model ?? record.car?.model ?? ''
          if (carId && brand && model) {
            return { ...record.car, ...record, id: carId, brand, model } as Car
          }
          if (carId) return await getCarById(carId)
          return null
        }))
        const cars = resolved.filter((car): car is Car => car !== null)
        setFavoriteCars(cars)
        setFavoriteIds(cars.map((car) => car.id))
      } catch {
        if (isCurrent) {
          setError('Не вдалося завантажити улюблені')
          toast.error('Не вдалося завантажити улюблені')
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }
    void load()
    return () => { isCurrent = false }
  }, [accessToken])

  const toggleFavorite = async (car: Car) => {
    const isFavorite = favoriteIds.includes(car.id)
    setUpdatingId(car.id)
    setFavoriteIds((current) => isFavorite ? current.filter((id) => id !== car.id) : [...current, car.id])
    setFavoriteCars((current) => isFavorite ? current.filter((item) => item.id !== car.id) : [...current, car])
    try {
      if (isFavorite) await removeFavorite(car.id)
      else await addFavorite(car.id)
      favoritesRequest = null
    } catch {
      setFavoriteIds((current) => isFavorite ? [...current, car.id] : current.filter((id) => id !== car.id))
      setFavoriteCars((current) => isFavorite ? [...current, car] : current.filter((item) => item.id !== car.id))
      toast.error('Не вдалося оновити улюблені')
    } finally {
      setUpdatingId(null)
    }
  }

  return { favoriteIds, favoriteCars, loading, error, updatingId, toggleFavorite }
}
