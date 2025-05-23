'use client'

import RecipientForm from '../_components/RecipientForm/layout.js'

export default function RecepientAddPage() {
  const handleSubmit = (formData) => {
    console.log('新增收件人資料:', formData)
    // 你可以在這裡串接 API，例如：
    // await fetch('/api/recipients', { method: 'POST', body: JSON.stringify(formData) })
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">新增常用收件人</h1>
      <RecipientForm onSubmit={handleSubmit} submitLabel="新增" />
    </div>
  )
}
