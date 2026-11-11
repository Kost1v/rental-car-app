import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { logout } from '../store/slices/authSlice'
import type { AppDispatch, RootState } from '../store/store'

function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { user, accessToken } = useSelector((state: RootState) => state.auth)
  const isAuthenticated = Boolean(user || accessToken)

  const handleLogout = async () => {
    setIsOpen(false)

    try {
      await authApi.logout()
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  return (
    <nav className="relative flex items-center justify-between bg-blue-600 p-4 text-white shadow-md">
      <NavLink className="text-xl font-bold" to="/cars">
        AutoRent
      </NavLink>
      <button
        aria-label="Відкрити меню"
        className="md:hidden"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="block h-0.5 w-6 bg-white" />
        <span className="mt-1 block h-0.5 w-6 bg-white" />
        <span className="mt-1 block h-0.5 w-6 bg-white" />
      </button>
      <div className="hidden items-center gap-4 md:flex">
        {isAuthenticated ? (
          <>
            <NavLink to="/cars">Каталог</NavLink>
            <NavLink to="/bookings">Мої бронювання</NavLink>
            <NavLink to="/favorites">Улюблені</NavLink>
            <NavLink to="/assistant">AI-помічник</NavLink>
            <button
              className="rounded border border-white px-3 py-1 hover:bg-blue-700"
              onClick={() => void handleLogout()}
              type="button"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Увійти</NavLink>
            <NavLink to="/register">Реєстрація</NavLink>
          </>
        )}
      </div>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-10 flex flex-col gap-3 bg-blue-600 p-4 md:hidden">
          {isAuthenticated ? (
            <>
              <NavLink onClick={() => setIsOpen(false)} to="/cars">
                Каталог
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/bookings">
                Мої бронювання
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/favorites">
                Улюблені
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/assistant">
                AI-помічник
              </NavLink>
              <button
                className="self-start rounded border border-white px-3 py-1 hover:bg-blue-700"
                onClick={() => void handleLogout()}
                type="button"
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <NavLink onClick={() => setIsOpen(false)} to="/login">
                Увійти
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/register">
                Реєстрація
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
