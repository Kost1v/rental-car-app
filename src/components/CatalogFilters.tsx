import type { FormEvent } from 'react'
import { ArrowDown, Search, SlidersHorizontal, Tag } from 'lucide-react'

export interface CatalogFiltersState {
  category: string
  sort: string
  min_price: string
  max_price: string
}

interface CatalogFiltersProps {
  filters: CatalogFiltersState
  loading: boolean
  onChange: (field: keyof CatalogFiltersState, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function CatalogFilters({ filters, loading, onChange, onSubmit }: CatalogFiltersProps) {
  return (
    <form
      className="mb-8 grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      onSubmit={onSubmit}
    >
      <label className="text-sm font-semibold text-slate-700">
        <span className="mb-2 block">Категорія</span>
        <span className="relative block">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" onChange={(event) => onChange('category', event.target.value)} value={filters.category}>
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
          <select className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" onChange={(event) => onChange('sort', event.target.value)} value={filters.sort}>
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
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" min="0" onChange={(event) => onChange('min_price', event.target.value)} type="number" value={filters.min_price} />
        </span>
      </label>
      <label className="text-sm font-semibold text-slate-700">
        <span className="mb-2 block">Макс. ціна</span>
        <span className="relative block">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" min="0" onChange={(event) => onChange('max_price', event.target.value)} type="number" value={filters.max_price} />
        </span>
      </label>
      <button className="flex items-center justify-center gap-2 self-end rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50" disabled={loading} type="submit">
        <Search className="h-4 w-4" /> Застосувати фільтри
      </button>
    </form>
  )
}

export default CatalogFilters
