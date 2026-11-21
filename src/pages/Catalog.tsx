import CarCard from '../components/CarCard'
import CarCardSkeleton from '../components/CarCardSkeleton'
import CatalogFilters from '../components/CatalogFilters'
import { useCatalog } from '../hooks/useCatalog'
import { useFavorites } from '../hooks/useFavorites'

function Catalog() {
  const catalog = useCatalog()
  const favorites = useFavorites()

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-white via-indigo-50/60 to-sky-50 px-6 py-8 sm:px-10 sm:py-10">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Автомобіль на будь-яку подорож</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Знайдіть авто, яке вам підходить</h1>
            <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">Порівнюйте моделі, обирайте комфорт і бронюйте за лічені хвилини.</p>
          </div>
        </section>
        <CatalogFilters filters={catalog.filters} loading={catalog.loading} onChange={catalog.updateFilter} onSubmit={catalog.handleSearch} />
        {catalog.loading && catalog.cars.length === 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Завантаження автомобілів">
            {[0, 1, 2, 3, 4, 5].map((item) => <CarCardSkeleton key={item} />)}
          </div>
        )}
        {catalog.error && <p className="rounded bg-red-100 p-4 text-red-700">{catalog.error}</p>}
        {!catalog.loading && !catalog.error && catalog.cars.length === 0 && <p className="py-8 text-center text-gray-600">Автомобілів за вибраними параметрами не знайдено.</p>}
        {catalog.cars.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {catalog.cars.map((car, index) => (
                <div className="scroll-mt-24" key={`${car.id}-${favorites.favoriteIds.includes(car.id)}`} ref={index === catalog.previousCarsLengthRef.current ? catalog.newFirstCarRef : undefined}>
                  <CarCard
                    car={car}
                    isFavorite={favorites.favoriteIds.includes(car.id)}
                    isUpdatingFavorite={favorites.updatingId === car.id}
                    onFavoriteToggle={(selectedCar) => void favorites.toggleFavorite(selectedCar)}
                  />
                </div>
              ))}
            </div>
            {catalog.loading && <p className="mt-8 text-center text-gray-600">Завантаження автомобілів...</p>}
            {catalog.hasMore && !catalog.error && (
              <div className="mt-8 text-center">
                <button className="rounded-xl bg-indigo-600 px-6 py-2 text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50 cursor-pointer" disabled={catalog.loading} onClick={catalog.showMore} type="button">Показати ще</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default Catalog
