import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Assistant from './pages/Assistant'
import Bookings from './pages/Bookings'
import CarDetails from './pages/CarDetails'
import Catalog from './pages/Catalog'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout>
              <Toaster position="top-right" />
            </Layout>
          }
        >
          <Route path="/" element={<Navigate to="/cars" replace />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/cars" element={<Catalog />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/assistant" element={<Assistant />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
