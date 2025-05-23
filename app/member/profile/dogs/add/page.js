'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DogForm from '../_components/DogFrom/layout'
import SectionTitle from '../../../_components/SectionTitle/layout'

export default function DogAddPage() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    console.log('新增狗狗資料:', formData)
    // 模擬提交成功後返回列表頁
    router.push('/dogs')
  }

  return (
    <>
      <SectionTitle>新增狗狗資料</SectionTitle>
      <div className="container py-4">
        <DogForm onSubmit={handleSubmit} />
      </div>
    </>
  )
}
