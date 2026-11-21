import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../api/auth.api'
import { setCredentials } from '../store/slices/authSlice'
import type { AppDispatch } from '../store/store'

const registerSchema = z
  .object({
    email: z.string().email('Введіть коректний email.'),
    full_name: z.string().min(2, 'Імʼя має містити щонайменше 2 символи.'),
    password: z.string().min(12, 'Пароль має містити щонайменше 12 символів.'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Паролі не збігаються.',
    path: ['password_confirmation'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError('')

    try {
      await authApi.register(data)
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      })

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        }),
      )
      toast.success('Реєстрація успішна, ви увійшли!')
      navigate('/cars')
    } catch {
      setSubmitError('Не вдалося зареєструватися. Перевірте введені дані.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-sky-50 p-4">
      <form
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-7 text-3xl font-extrabold text-slate-900">
          Реєстрація
        </h1>

        {submitError && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {submitError}
          </p>
        )}

        <label className="mb-4 block text-gray-700" htmlFor="full-name">
          Повне ім&apos;я
          <span className="relative mt-2 block">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              id="full-name"
              type="text"
              {...register('full_name')}
            />
          </span>
          {errors.full_name && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.full_name.message}
            </span>
          )}
        </label>

        <label className="mb-4 block text-gray-700" htmlFor="register-email">
          Email
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              id="register-email"
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

        <label
          className="mb-4 block text-gray-700"
          htmlFor="register-password"
        >
          Пароль
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              id="register-password"
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

        <label
          className="mb-6 block text-gray-700"
          htmlFor="password-confirmation"
        >
          Підтвердження пароля
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              id="password-confirmation"
              type={showPasswordConfirmation ? 'text' : 'password'}
              {...register('password_confirmation')}
            />
            <button
              aria-label={showPasswordConfirmation ? 'Сховати підтвердження пароля' : 'Показати підтвердження пароля'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-indigo-600"
              onClick={() => setShowPasswordConfirmation((visible) => !visible)}
              type="button"
            >
              {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
          {errors.password_confirmation && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.password_confirmation.message}
            </span>
          )}
        </label>

        <button
          className="w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Уже маєте акаунт?{' '}
          <Link className="text-blue-600 hover:underline" to="/login">
            Увійти
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
