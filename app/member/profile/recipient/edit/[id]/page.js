'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import RecipientForm from '../../../recipient/_components/RecipientForm/layout'

export default function RecipientEditPage() {
  const { id } = useParams()
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    // 模擬取得資料，可換成 API 呼叫
    const fakeData = {
      1: { name: '王小明', phone: '0900-111-222', address: '台北市信義區' },
      2: { name: '李小華', phone: '0911-333-444', address: '新北市板橋區' },
    }
    setInitialData(fakeData[id])
  }, [id])

  const handleSubmit = async (formData) => {
    console.log(`更新收件人（ID: ${id}）資料:`, formData)
    // 你可以加上 API PATCH/PUT 更新邏輯
  }

  if (!initialData) return <div>載入中...</div>

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
