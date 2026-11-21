import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LogOut, X } from 'lucide-react'

interface LogoutConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
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

  return createPortal(
    <div
      aria-labelledby="logout-confirm-title"
      aria-modal="true"
      className="fixed inset-0 z-[2147483647] flex h-screen w-screen items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
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

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <LogOut className="h-7 w-7" />
        </div>

        <div className="mt-5 text-center">
          <h2
            className="text-2xl font-extrabold text-slate-900"
            id="logout-confirm-title"
          >
            Вийти з акаунта?
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            Ви впевнені, що хочете завершити поточний сеанс?
          </p>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Скасувати
          </button>
          <button
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white transition hover:bg-rose-700"
            onClick={onConfirm}
            type="button"
          >
            Вийти
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default LogoutConfirmModal
