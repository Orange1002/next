'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RecipientForm from '../../../recipient/_components/RecipientForm/layout'

export default function RecipientEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/api/member/recipients/${id}`,
          {
            credentials: 'include',
          }
        )
        const result = await res.json()
        if (res.ok && result.success) {
          // 後端返回的是 realname，但前端用的是 name，需轉換
          const { realname, phone, email, address } = result.data
          setInitialData({ realname, phone, email, address })
        } else {
          alert(result.message || '讀取失敗')
        }
      } catch (error) {
        console.error(error)
        alert('讀取失敗，請稍後再試')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipient()
  }, [id])

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/member/recipients/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            realname: formData.realname,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
          }),
        }
      )

      const result = await res.json()

      if (res.ok && result.success) {
        alert('更新成功')
        router.push('/member/profile/recipient')
      } else {
        alert(result.message || '更新失敗')
      }
    } catch (error) {
      console.error(error)
      alert('更新失敗，請稍後再試')
    }
  }

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className="container py-4">
      <h1 className="mb-4">編輯常用收件人</h1>
      <RecipientForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="更新"
      />
    </div>
  )
}
