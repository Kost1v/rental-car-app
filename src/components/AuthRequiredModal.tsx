import { useEffect } from 'react'
import { LockKeyhole, X } from 'lucide-react'

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

function AuthRequiredModal({
  isOpen,
  onClose,
  onLogin,
}: AuthRequiredModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-labelledby="auth-required-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          aria-label="Закрити"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <LockKeyhole className="h-7 w-7" />
        </div>

        <div className="mt-5 text-center">
          <h2
            className="text-2xl font-extrabold text-slate-900"
            id="auth-required-title"
          >
            Потрібна авторизація
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            Забронювати автомобіль можуть лише авторизовані користувачі.
            Увійдіть в акаунт або зареєструйтеся, щоб продовжити бронювання
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <button
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700"
            onClick={onLogin}
            type="button"
          >
            Увійти / Реєстрація
          </button>
          <button
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthRequiredModal
