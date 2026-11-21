import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../api/auth.api'
import { setCredentials } from '../store/slices/authSlice'
import type { AppDispatch } from '../store/store'

const loginSchema = z.object({
  email: z.string().email('Введіть коректний email.'),
  password: z.string().min(1, 'Введіть пароль.'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginLocationState {
  message?: string
}

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const message = (location.state as LoginLocationState | null)?.message
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      const response = await authApi.login({ email, password })

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        }),
      )

      navigate('/cars')
    } catch {
      toast.error('Не вдалося увійти. Перевірте email і пароль.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-sky-50 p-4">
      <form
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">З поверненням</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Увійти в AutoRent</h1>
        </div>

        {message && (
          <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        <label className="mb-4 block text-sm font-semibold text-slate-700" htmlFor="login-email">
          Email
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              id="login-email"
              type="email"
              {...register('email')}
            />
          </span>
          {errors.email && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="mb-6 block text-sm font-semibold text-slate-700" htmlFor="login-password">
          Пароль
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-indigo-600"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
          {errors.password && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>

        <button
          className="w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Вхід...' : 'Увійти'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Ще не маєте акаунта?{' '}
          <Link className="text-blue-600 hover:underline" to="/register">
            Зареєструватися
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
