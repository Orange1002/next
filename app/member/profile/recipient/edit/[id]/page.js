'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
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
          const { realname, phone, email, address } = result.data
          setInitialData({ realname, phone, email, address })
        } else {
          await Swal.fire({
            icon: 'error',
            title: '讀取失敗',
            text: result.message || '請稍後再試',
            confirmButtonColor: '#d33',
            background: '#fdecea',
            color: '#b71c1c',
          })
        }
      } catch (error) {
        console.error(error)
        await Swal.fire({
          icon: 'error',
          title: '讀取失敗',
          text: '請稍後再試',
          confirmButtonColor: '#d33',
          background: '#fdecea',
          color: '#b71c1c',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecipient()
  }, [id])

  const handleSubmit = async (formData) => {
    const res = await fetch(
      `http://localhost:3005/api/member/recipients/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      }
    )

    const result = await res.json()

    if (!(res.ok && result.success)) {
      throw new Error(result.message || '更新失敗')
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
