'use client'

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/use-auth'

export default function LoginLayout({ children }) {
  const { isAuth, isReady, refreshMember } = useAuth()
  const [hasRefreshed, setHasRefreshed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!hasRefreshed) {
      refreshMember().finally(() => {
        setHasRefreshed(true)
      })
    }
  }, [hasRefreshed, refreshMember])

  useEffect(() => {
    if (!isReady || !hasRefreshed) return
    if (isAuth) {
      router.replace('/')
    }
  }, [isAuth, isReady, hasRefreshed, router])

  if (!isReady || !hasRefreshed) return <div>載入中...</div>
  if (isAuth) return null

  return <div className="login-layout">{children}</div>
}
