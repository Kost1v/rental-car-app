import { useFavorites } from '../hooks/useFavorites'
import CarCard from '../components/CarCard'
import { Heart, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

function Favorites() {
  const { favoriteCars: cars, loading, error, updatingId, toggleFavorite } = useFavorites()

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">
          Улюблені автомобілі
        </h1>

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div className="animate-pulse rounded-2xl border border-slate-200 bg-white" key={item}>
                <div className="h-48 rounded-t-2xl bg-slate-200" />
                <div className="p-5"><div className="h-5 w-2/3 rounded bg-slate-200" /></div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded bg-red-100 p-4 text-red-700">{error}</p>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-slate-900">Улюблених поки немає</h2>
            <p className="mt-2 text-slate-500">Зберігайте цікаві авто, щоб швидко повернутися до них.</p>
            <Link className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white" to="/cars">
              <Search className="h-4 w-4" /> Переглянути каталог
            </Link>
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard
                car={car}
                isFavorite
                isUpdatingFavorite={updatingId === car.id}
                onFavoriteToggle={(selectedCar) => void toggleFavorite(selectedCar)}
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
