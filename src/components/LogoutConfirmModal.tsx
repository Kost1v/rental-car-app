import { LogOut, X } from 'lucide-react'
import Modal from './Modal'

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
  return (
    <Modal
      ariaLabelledBy="logout-confirm-title"
      isOpen={isOpen}
      onClose={onClose}
      zIndexClassName="z-[2147483647]"
    >
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
    </Modal>
  )
}

export default LogoutConfirmModal
