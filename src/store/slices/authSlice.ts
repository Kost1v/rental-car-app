import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthUser = Record<string, unknown>

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
}

interface Credentials {
  user: AuthUser | null
  accessToken: string
  refreshToken: string
}

const getStoredUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Credentials>) => {
      const { user, accessToken, refreshToken } = action.payload

      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
