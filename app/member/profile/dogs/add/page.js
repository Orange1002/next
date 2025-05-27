'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DogForm from '../_components/DogForm/layout'
import SectionTitle from '../../../_components/SectionTitle/layout'

export default function DogAddPage() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      // 建立 FormData 物件
      const data = new FormData()
      data.append('name', formData.name)
      data.append('age', formData.age)
      data.append('breed', formData.breed)
      data.append('description', formData.description)
      data.append('size_id', formData.size_id)
      formData.photos.forEach((file) => {
        data.append('dog_images', file)
      })

      // 呼叫新增 API
      const res = await fetch('http://localhost:3005/api/member/dogs/add', {
        method: 'POST',
        body: data,
        credentials: 'include',
      })

      const result = await res.json()

      if (res.ok && result.status === 'success') {
        alert('新增成功！')
        router.push('/member/profile/dogs')
      } else {
        alert('新增失敗：' + (result.message || '未知錯誤'))
      }
    } catch (error) {
      console.error(error)
      alert('新增失敗，請稍後再試')
    }
  }

  return (
    <>
      <SectionTitle>新增狗狗資料</SectionTitle>
      <div className="container h-100">
        <DogForm onSubmit={handleSubmit} />
      </div>
    </>
  )
}
