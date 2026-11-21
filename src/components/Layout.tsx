import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { CarFront } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'

interface LayoutProps {
  children?: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <CarFront className="h-4 w-4 text-indigo-600" />
            AutoRent
          </div>
          <p>© 2026 AutoRent. Подорожуйте комфортно.</p>
        </div>
      </footer>
      {children}
      <AutoRentToaster />
    </div>
  )
}

function AutoRentToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
        },
      }}
    />
  )
}

export default Layout
