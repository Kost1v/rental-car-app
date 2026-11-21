import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CarFront, Menu, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import LogoutConfirmModal from './LogoutConfirmModal'
import { logout } from '../store/slices/authSlice'
import type { AppDispatch, RootState } from '../store/store'

function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { user, accessToken } = useSelector((state: RootState) => state.auth)
  const isAuthenticated = Boolean(user || accessToken)

  const handleLogout = async () => {
    setIsOpen(false)
    setIsLogoutModalOpen(false)

    try {
      await authApi.logout()
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 px-4 py-3 text-slate-700 shadow-sm backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between">
      <NavLink className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900" to="/cars">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <CarFront className="h-5 w-5" />
        </span>
        Auto<span className="text-indigo-600">Rent</span>
      </NavLink>
      <button
        aria-label="Відкрити меню"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div className="hidden items-center gap-1 md:flex">
        {isAuthenticated ? (
          <>
            <NavLink className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`} to="/cars">Каталог</NavLink>
            <NavLink className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`} to="/bookings">Мої бронювання</NavLink>
            <NavLink className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`} to="/favorites">Улюблені</NavLink>
            <NavLink className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`} to="/assistant">AI-помічник</NavLink>
            <button
              className="ml-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              onClick={() => setIsLogoutModalOpen(true)}
              type="button"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <NavLink className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" to="/login">Увійти</NavLink>
            <NavLink className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200" to="/register">Реєстрація</NavLink>
          </>
        )}
      </div>
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-10 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden">
          {isAuthenticated ? (
            <>
              <NavLink className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50" onClick={() => setIsOpen(false)} to="/cars">
                Каталог
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/bookings">
                Мої бронювання
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/favorites">
                Улюблені
              </NavLink>
              <NavLink className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50" onClick={() => setIsOpen(false)} to="/assistant">
                AI-помічник
              </NavLink>
              <button
                className="mt-1 rounded-xl border border-rose-200 px-4 py-3 text-left font-semibold text-rose-600"
                onClick={() => {
                  setIsOpen(false)
                  setIsLogoutModalOpen(true)
                }}
                type="button"
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <NavLink className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-50" onClick={() => setIsOpen(false)} to="/login">
                Увійти
              </NavLink>
              <NavLink className="rounded-xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white" onClick={() => setIsOpen(false)} to="/register">
                Реєстрація
              </NavLink>
            </>
          )}
        </div>
      )}
      </div>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => void handleLogout()}
      />
    </nav>
  )
}

export default Navbar
