'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DogForm from '../../_components/DogForm/layout'

export default function DogsEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    if (!id) return

    async function fetchDogData() {
      try {
        const res = await fetch(`http://localhost:3005/api/member/dogs/${id}`, {
          credentials: 'include', // 帶 cookie
        })
        if (!res.ok) throw new Error('取得狗狗資料失敗')
        const data = await res.json()
        setInitialData(data)
      } catch (error) {
        console.error(error)
        // 可以加錯誤提示或跳轉
      }
    }

    fetchDogData()
  }, [id])
  // console.log(initialData)

  const handleSubmit = async (formData) => {
    const data = new FormData()
    data.append('name', formData.name)
    data.append('age', formData.age)
    data.append('breed', formData.breed)
    data.append('description', formData.description)
    if (formData.dog_images && formData.dog_images.length) {
      formData.dog_images.forEach((file) => data.append('dog_images', file))
    }

    const res = await fetch(
      `http://localhost:3005/api/member/dogs/edit/${id}`,
      {
        method: 'PUT',
        body: data,
        credentials: 'include',
      }
    )

    if (res.ok) {
      router.push('/member/profile/dogs')
    } else {
      const err = await res.json()
      alert(err.message)
    }
  }

  if (!initialData) return <div>載入中...</div>

  return (
    <div className="container my-4">
      <h2>編輯狗狗資料</h2>
      <DogForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  )
}
