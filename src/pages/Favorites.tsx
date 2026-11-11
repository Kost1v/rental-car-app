import { useEffect, useState } from 'react'
import { getFavorites } from '../api/favorites.api'
import type { Car } from '../api/cars.api'
import CarCard from '../components/CarCard'

function Favorites() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    const loadFavorites = async () => {
      try {
        const favoriteCars = await getFavorites()

        if (isCurrentRequest) {
          setCars(favoriteCars)
        }
      } catch {
        if (isCurrentRequest) {
          setError('Не вдалося завантажити улюблені автомобілі.')
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }

    void loadFavorites()

    return () => {
      isCurrentRequest = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Улюблені автомобілі
        </h1>

        {loading && (
          <p className="py-8 text-center text-gray-600">Завантаження...</p>
        )}

        {!loading && error && (
          <p className="rounded bg-red-100 p-4 text-red-700">{error}</p>
        )}

        {!loading && !error && cars.length === 0 && (
          <p className="py-8 text-center text-gray-600">
            У вас ще немає улюблених автомобілів.
          </p>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard
                car={car}
                initialIsFavorite
                key={car.id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Favorites
