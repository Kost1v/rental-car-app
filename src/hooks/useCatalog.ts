import { useEffect, useRef, useState, type FormEvent } from 'react'
import { getCars } from '../api/cars.api'
import type { Car, GetCarsParams } from '../types'
import type { CatalogFiltersState } from '../components/CatalogFilters'

const initialFilters: CatalogFiltersState = {
  category: '',
  sort: 'price_asc',
  min_price: '',
  max_price: '',
}

export function useCatalog() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchVersion, setSearchVersion] = useState(0)
  const newFirstCarRef = useRef<HTMLDivElement>(null)
  const previousCarsLengthRef = useRef(0)
  const shouldScrollToNewCarsRef = useRef(false)

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
          setCars((currentCars) => page === 1 ? response.items : [...currentCars, ...response.items])
          setHasMore(response.items.length === 12)
        }
      } catch {
        if (isCurrentRequest) setError('Не вдалося завантажити каталог автомобілів.')
      } finally {
        if (isCurrentRequest) setLoading(false)
      }
    }
    void loadCars()
    return () => { isCurrentRequest = false }
  }, [appliedFilters, page, searchVersion])

  useEffect(() => {
    if (shouldScrollToNewCarsRef.current && !loading && cars.length > previousCarsLengthRef.current) {
      shouldScrollToNewCarsRef.current = false
      window.requestAnimationFrame(() => {
        newFirstCarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  const updateFilter = (field: keyof CatalogFiltersState, value: string) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const showMore = () => {
    previousCarsLengthRef.current = cars.length
    shouldScrollToNewCarsRef.current = true
    setPage((currentPage) => currentPage + 1)
  }

  return {
    cars, loading, error, filters, hasMore, handleSearch, updateFilter, showMore,
    newFirstCarRef, previousCarsLengthRef,
  }
}
