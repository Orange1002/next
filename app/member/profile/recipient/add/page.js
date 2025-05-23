'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RecipientForm from '../_components/RecipientForm/layout'
import { useAuth } from '../../../../../hooks/use-auth.js'

export default function RecipientAddPage() {
  const router = useRouter()
  const { isAuth, member, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuth) {
      alert('請先登入')
      router.push('/member/login')
    }
  }, [loading, isAuth, router])

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch('http://localhost:3005/api/recipients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          member_id: member.id,
        }),
      })

      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const result = await res.json()
        if (res.ok && result.success) {
          alert('新增成功')
          router.push('/member/profile/recipient')
        } else {
          alert(result.message || '新增失敗')
        }
      } else {
        const text = await res.text()
        console.error('伺服器回傳非 JSON:', text)
        alert('伺服器回應異常，請稍後再試')
      }
    } catch (error) {
      console.error(error)
      alert('新增失敗，請稍後再試')
    }
  }

  // 如果還在 loading，就暫時不要渲染表單
  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="container py-4">
      <h1 className="mb-4">新增常用收件人</h1>
      <RecipientForm />
    </div>
  )
}
