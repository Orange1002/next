'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import RecipientForm from '../_components/RecipientForm/layout'
import { useAuth } from '../../../../../hooks/use-auth.js'
import SectionTitle from '../../../_components/SectionTitle/layout'

export default function RecipientAddPage() {
  const router = useRouter()
  const { isAuth, member, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuth) {
      Swal.fire({
        icon: 'warning',
        title: '請先登入',
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        router.push('/member/login?type=signin')
      })
    }
  }, [loading, isAuth, router])

  if (loading || !isAuth) return <div className="p-4">載入中...</div>

  return (
    <>
      <SectionTitle>新增常用收件人</SectionTitle>
      <RecipientForm />
    </>
  )
}
