import { useEffect, useRef, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { ArrowDown, Search, SlidersHorizontal, Tag } from 'lucide-react'
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
  const newFirstCarRef = useRef<HTMLDivElement>(null)
  const previousCarsLengthRef = useRef(0)
  const shouldScrollToNewCarsRef = useRef(false)
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
          setFavorites(
            favoriteCars
              .map((favorite) => {
                const record = favorite as unknown as {
                  id?: number
                  car_id?: number
                  car?: { id?: number }
                }
                return record.id ?? record.car_id ?? record.car?.id
              })
              .filter((carId): carId is number => typeof carId === 'number'),
          )
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

  useEffect(() => {
    if (
      shouldScrollToNewCarsRef.current &&
      !loading &&
      cars.length > previousCarsLengthRef.current
    ) {
      shouldScrollToNewCarsRef.current = false
      window.requestAnimationFrame(() => {
        newFirstCarRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }, [cars, loading])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    shouldScrollToNewCarsRef.current = false
    previousCarsLengthRef.current = 0
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
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/60 to-sky-50 px-6 py-8 sm:px-10 sm:py-10">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              Автомобіль на будь-яку подорож
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Знайдіть авто, яке вам підходить
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
              Порівнюйте моделі, обирайте комфорт і бронюйте за лічені хвилини.
            </p>
          </div>
        </section>

        <form
          className="mb-8 grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
          onSubmit={handleSearch}
        >
          <label className="text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Категорія</span>
            <span className="relative block">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Сортування</span>
            <span className="relative block">
              <ArrowDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                onChange={(event) => updateFilter('sort', event.target.value)}
                value={filters.sort}
              >
                <option value="price_asc">Спочатку дешевші</option>
                <option value="price_desc">Спочатку дорожчі</option>
                <option value="newest">Найновіші</option>
              </select>
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Мін. ціна</span>
            <span className="relative block">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                min="0"
                onChange={(event) => updateFilter('min_price', event.target.value)}
                type="number"
                value={filters.min_price}
              />
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Макс. ціна</span>
            <span className="relative block">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                min="0"
                onChange={(event) => updateFilter('max_price', event.target.value)}
                type="number"
                value={filters.max_price}
              />
            </span>
          </label>

          <button
            className="flex items-center justify-center gap-2 self-end rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            <Search className="h-4 w-4" />
            Застосувати фільтри
          </button>
        </form>

        {loading && cars.length === 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Завантаження автомобілів">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white" key={item}>
                <div className="h-48 bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                  <div className="h-12 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
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
              {cars.map((car, index) => (
                <div
                  className="scroll-mt-24"
                  key={`${car.id}-${favorites.includes(car.id)}`}
                  ref={index === previousCarsLengthRef.current ? newFirstCarRef : undefined}
                >
                  <CarCard
                    car={car}
                    initialIsFavorite={favorites.includes(car.id)}
                  />
                </div>
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
                    previousCarsLengthRef.current = cars.length
                    shouldScrollToNewCarsRef.current = true
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
