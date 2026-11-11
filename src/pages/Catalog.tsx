import { useEffect, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getCars, type Car, type GetCarsParams } from '../api/cars.api'
import { getFavorites } from '../api/favorites.api'
import CarCard from '../components/CarCard'
import type { RootState } from '../store/store'

interface CatalogFilters {
  category: string
  sort: string
  min_price: string
  max_price: string
}

const initialFilters: CatalogFilters = {
  category: '',
  sort: 'price_asc',
  min_price: '',
  max_price: '',
}

function Catalog() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchVersion, setSearchVersion] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  useEffect(() => {
    let isCurrentRequest = true

    const loadCars = async () => {
      setLoading(true)
      setError('')

      const params: GetCarsParams = {
        category: appliedFilters.category,
        sort: appliedFilters.sort,
        min_price: appliedFilters.min_price,
        max_price: appliedFilters.max_price,
        page,
        page_size: 12,
      }

      try {
        const response = await getCars(params)

        if (isCurrentRequest) {
          setCars((currentCars) =>
            page === 1
              ? response.items
              : [...currentCars, ...response.items],
          )
          setHasMore(response.items.length === 12)
        }
      } catch {
        if (isCurrentRequest) {
          setError('Не вдалося завантажити каталог автомобілів.')
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }

    void loadCars()

    return () => {
      isCurrentRequest = false
    }
  }, [appliedFilters, page, searchVersion])

  useEffect(() => {
    let isCurrentRequest = true

    if (!accessToken) {
      return
    }

    const loadFavorites = async () => {
      try {
        const favoriteCars = await getFavorites()

        if (isCurrentRequest) {
          setFavorites(favoriteCars.map((car) => car.id))
        }
      } catch {
        if (isCurrentRequest) {
          toast.error('Не вдалося завантажити улюблені')
        }
      }
    }

    void loadFavorites()

    return () => {
      isCurrentRequest = false
    }
  }, [accessToken])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setHasMore(true)
    setCars([])
    setAppliedFilters({ ...filters })
    setSearchVersion((version) => version + 1)
  }

  const updateFilter = (field: keyof CatalogFilters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }))
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Каталог автомобілів
        </h1>

        <form
          className="mb-8 grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-5"
          onSubmit={handleSearch}
        >
          <label className="flex flex-col gap-1 text-gray-700">
            Категорія
            <select
              className="rounded border p-2"
              onChange={(event) => updateFilter('category', event.target.value)}
              value={filters.category}
            >
              <option value="">Всі</option>
              <option value="economy">economy</option>
              <option value="sedan">sedan</option>
              <option value="suv">suv</option>
              <option value="premium">premium</option>
              <option value="van">van</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-gray-700">
            Сортування
            <select
              className="rounded border p-2"
              onChange={(event) => updateFilter('sort', event.target.value)}
              value={filters.sort}
            >
              <option value="price_asc">Спочатку дешевші</option>
              <option value="price_desc">Спочатку дорожчі</option>
              <option value="newest">Найновіші</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-gray-700">
            Мін. ціна
            <input
              className="rounded border p-2"
              min="0"
              onChange={(event) => updateFilter('min_price', event.target.value)}
              type="number"
              value={filters.min_price}
            />
          </label>

          <label className="flex flex-col gap-1 text-gray-700">
            Макс. ціна
            <input
              className="rounded border p-2"
              min="0"
              onChange={(event) => updateFilter('max_price', event.target.value)}
              type="number"
              value={filters.max_price}
            />
          </label>

          <button
            className="self-end rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            Застосувати фільтри
          </button>
        </form>

        {loading && cars.length === 0 && (
          <p className="py-8 text-center text-gray-600">Завантаження...</p>
        )}

        {error && (
          <p className="rounded bg-red-100 p-4 text-red-700">{error}</p>
        )}

        {!loading && !error && cars.length === 0 && (
          <p className="py-8 text-center text-gray-600">
            Автомобілів за вибраними параметрами не знайдено.
          </p>
        )}

        {cars.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <CarCard
                  car={car}
                  initialIsFavorite={favorites.includes(car.id)}
                  key={`${car.id}-${favorites.includes(car.id)}`}
                />
              ))}
            </div>
            {loading && (
              <p className="mt-8 text-center text-gray-600">
                Завантаження автомобілів...
              </p>
            )}
            {hasMore && !error && (
              <div className="mt-8 text-center">
                <button
                  className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  disabled={loading}
                  onClick={() => {
                    setPage((currentPage) => currentPage + 1)
                  }}
                  type="button"
                  
                >
                  Показати ще
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default Catalog
