'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RecipientForm from '../_components/RecipientForm/layout'
import { useAuth } from '../../../../../hooks/use-auth.js'
import SectionTitle from '../../../_components/SectionTitle/layout'

export default function RecipientAddPage() {
  const router = useRouter()
  const { isAuth, member, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuth) {
      alert('請先登入')
      router.push('/member/login')
    }
  }, [loading, isAuth, router])

  // 如果還在 loading，就暫時不要渲染表單
  if (loading) return <div className="p-4">載入中...</div>

  return (
    <>
      <SectionTitle>新增常用收件人</SectionTitle>
      <RecipientForm />
    </>
  )
}
