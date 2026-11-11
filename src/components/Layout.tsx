import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

interface LayoutProps {
  children?: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
      {children}
    </>
  )
}

export default Layout
