'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DogForm from '../_components/DogForm/layout'
import SectionTitle from '../../../_components/SectionTitle/layout'
import Swal from 'sweetalert2'

export default function DogAddPage() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('age', formData.age)
      data.append('breed', formData.breed)
      data.append('description', formData.description)
      data.append('size_id', formData.size_id)
      formData.newPhotos.forEach((file) => {
        data.append('dog_images', file)
      })

      const res = await fetch('http://localhost:3005/api/member/dogs/add', {
        method: 'POST',
        body: data,
        credentials: 'include',
      })

      const result = await res.json()

      if (res.ok && result.status === 'success') {
        await Swal.fire({
          icon: 'success',
          title: '新增成功！',
          showConfirmButton: false,
          timer: 1500,
          background: '#e9f7ef', // 淡綠背景
          color: '#2e7d32', // 深綠文字
        })
        router.push('/member/profile/dogs')
      } else {
        Swal.fire({
          icon: 'error',
          title: '新增失敗',
          text: result.message || '未知錯誤',
          confirmButtonColor: '#d33',
          background: '#fdecea', // 淡紅背景
          color: '#b71c1c', // 深紅文字
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '新增失敗',
        text: '請稍後再試',
        confirmButtonColor: '#d33',
        background: '#fdecea', // 淡紅背景
        color: '#b71c1c', // 深紅文字
      })
    }
  }

  return (
    <>
      <SectionTitle>新增狗狗資料</SectionTitle>
      <div className="mt-3 container h-100">
        <DogForm onSubmit={handleSubmit} />
      </div>
    </>
  )
}
