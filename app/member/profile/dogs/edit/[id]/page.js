'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DogForm from '../../_components/DogFrom/layout'

export default function DogsEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    // 模擬取得該狗狗資料
    const dummy = {
      name: '阿福',
      age: '3 歲',
      breed: '柴犬',
      description: '活潑愛玩',
      photo: '/member/dogs_images/dog1.jpg',
    }
    setInitialData(dummy)
  }, [id])

  const handleSubmit = (formData) => {
    console.log('儲存的資料：', formData)
    // TODO: 可上傳圖片或呼叫 API 更新
    router.push('/member/profile/dogs')
  }

  if (!initialData) return <div>載入中...</div>

  return (
    <div className="container my-4">
      <h2>編輯狗狗資料</h2>
      <DogForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  )
}
