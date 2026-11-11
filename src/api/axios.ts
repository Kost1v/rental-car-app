import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshResponse {
  access_token: string
  refresh_token: string
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest?._retry) {
      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(error)
      }
    }

    if (originalRequest._retry) {
      localStorage.clear()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    originalRequest._retry = true
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      localStorage.clear()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const response = await axios.post<RefreshResponse>(
        '/auth/refresh',
        { refresh_token: refreshToken },
        { baseURL: import.meta.env.VITE_API_URL },
      )
      const { access_token: accessToken, refresh_token: newRefreshToken } =
        response.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      localStorage.clear()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }
  },
)

export default api
