'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Footer from './footer'

export default function RootClientLayout({ children }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    // console.log('Current pathname:', pathname)
    const checkLogin = async () => {
      if (pathname.startsWith('/member')) {
        try {
          const res = await fetch('http://localhost:3005/api/member/profile', {
            method: 'GET',
            credentials: 'include',
          })

          if (!res.ok) {
            setIsAuthenticated(false)
            return
          }

          const data = await res.json()
          setIsAuthenticated(!!data?.id)
          // console.log('Login check passed:', data)
        } catch (err) {
          console.error('登入檢查失敗:', err)
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(true)
      }
    }

    checkLogin()
  }, [pathname])

  const hiddenRoutes = [
    '/member/login',
    '/forgetpassword',
    '/forgetpassword/resetpassword',
  ]

  const hideLayout = hiddenRoutes.includes(pathname)

  return (
    <>
      {!hideLayout && isAuthenticated && <Navbar />}
      <>{children}</>
      {!hideLayout && isAuthenticated && <Footer />}
    </>
  )
}
