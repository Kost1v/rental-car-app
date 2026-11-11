import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Реєстрація
        </h1>

        {submitError && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {submitError}
          </p>
        )}

        <label className="mb-4 block text-gray-700" htmlFor="full-name">
          Повне ім&apos;я
          <input
            className="mt-1 w-full rounded border p-2"
            id="full-name"
            type="text"
            {...register('full_name')}
          />
          {errors.full_name && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.full_name.message}
            </span>
          )}
        </label>

        <label className="mb-4 block text-gray-700" htmlFor="register-email">
          Email
          <input
            className="mt-1 w-full rounded border p-2"
            id="register-email"
            type="email"
            {...register('email')}
          />
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
          <input
            className="mt-1 w-full rounded border p-2"
            id="register-password"
            type="password"
            {...register('password')}
          />
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
          <input
            className="mt-1 w-full rounded border p-2"
            id="password-confirmation"
            type="password"
            {...register('password_confirmation')}
          />
          {errors.password_confirmation && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.password_confirmation.message}
            </span>
          )}
        </label>

        <button
          className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
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
