import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  id: string
  label: string
  value: string
  minDate: string
  onChange: (value: string) => void
}

const ukrainianMonths = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
]

const ukrainianWeekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

const toDateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function DatePicker({
  id,
  label,
  value,
  minDate,
  onChange,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() =>
    value ? parseDate(value) : parseDate(minDate),
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7
  const calendarStart = new Date(year, month, 1 - mondayBasedOffset)
  const today = toDateKey(new Date())

  const changeMonth = (offset: number) => {
    setVisibleMonth(new Date(year, month + offset, 1))
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="mt-2 flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-left text-slate-700 outline-none transition hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        id={id}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Calendar className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
        {value
          ? new Intl.DateTimeFormat('uk-UA', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(parseDate(value))
          : 'Оберіть дату'}
      </button>

      {isOpen && (
        <div
          aria-label={label}
          className="absolute z-30 mt-2 w-full min-w-70 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          role="dialog"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              aria-label="Попередній місяць"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
              onClick={() => changeMonth(-1)}
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="font-bold text-slate-900">
              {ukrainianMonths[month]} {year}
            </p>
            <button
              aria-label="Наступний місяць"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
              onClick={() => changeMonth(1)}
              type="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {ukrainianWeekDays.map((dayName) => (
              <div
                className="pb-1 text-xs font-semibold text-slate-400"
                key={dayName}
              >
                {dayName}
              </div>
            ))}

            {Array.from({ length: 42 }, (_, index) => {
              const date = new Date(
                calendarStart.getFullYear(),
                calendarStart.getMonth(),
                calendarStart.getDate() + index,
              )
              const dateKey = toDateKey(date)
              const isOutsideMonth = date.getMonth() !== month
              const isDisabled = dateKey < minDate
              const isToday = dateKey === today
              const isSelected = dateKey === value

              return (
                <button
                  aria-label={dateKey}
                  className={[
                    'h-9 rounded-lg text-sm font-semibold transition',
                    isDisabled
                      ? 'cursor-not-allowed text-slate-300'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600',
                    isOutsideMonth ? 'opacity-50' : '',
                    isToday && !isSelected
                      ? 'border border-indigo-300 text-indigo-600'
                      : '',
                    isSelected
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white'
                      : '',
                  ].join(' ')}
                  disabled={isDisabled}
                  key={dateKey}
                  onClick={() => {
                    onChange(dateKey)
                    setIsOpen(false)
                  }}
                  type="button"
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
