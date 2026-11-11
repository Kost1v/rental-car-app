import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

function PublicRoute() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  return accessToken ? <Navigate replace to="/cars" /> : <Outlet />
}

export default PublicRoute
