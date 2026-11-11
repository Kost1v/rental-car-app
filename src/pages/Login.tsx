import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Вхід</h1>

        {message && (
          <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        <label className="mb-4 block text-gray-700" htmlFor="login-email">
          Email
          <input
            className="mt-1 w-full rounded border p-2"
            id="login-email"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="mb-6 block text-gray-700" htmlFor="login-password">
          Пароль
          <input
            className="mt-1 w-full rounded border p-2"
            id="login-password"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>

        <button
          className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
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
