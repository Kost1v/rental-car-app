import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  ariaLabelledBy?: string
  zIndexClassName?: string
}

function Modal({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  zIndexClassName = 'z-[100]',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      aria-labelledby={ariaLabelledBy}
      aria-modal="true"
      className={`fixed inset-0 flex h-screen w-screen items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm ${zIndexClassName}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
