'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/use-auth'

export default function LoginLayout({ children }) {
  const { isAuth, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuth) {
      router.push('/') // 已登入導回首頁
    }
  }, [isAuth, loading, router])

  if (loading) return null // 還在檢查登入狀態，不顯示內容

  return <div className="login-layout">{children}</div>
}
