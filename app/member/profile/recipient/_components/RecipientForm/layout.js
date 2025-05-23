'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './layout.module.css'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import CancelButton from '../../../../_components/BtnCustomGray/layout'

export default function RecipientForm({
  initialData = {},
  redirectTo = '/member/profile/recipient',
  submitLabel = '送出',
  onSubmit, // ✅ 可選傳入 onSubmit 處理編輯情境
}) {
  const [realname, setRealname] = useState(initialData.realname || '')
  const [phone, setPhone] = useState(initialData.phone || '')
  const [email, setEmail] = useState(initialData.email || '')
  const [address, setAddress] = useState(initialData.address || '')

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!realname || !phone || !email || !address) {
      alert('請填寫完整資訊')
      return
    }

    const formData = { realname, phone, email, address }

    if (onSubmit) {
      // ✅ 編輯情境，使用外部傳入的 onSubmit 處理
      onSubmit(formData)
    } else {
      // ✅ 新增情境，預設行為
      try {
        const res = await fetch('http://localhost:3005/api/member/recipients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // for cookie-based JWT
          body: JSON.stringify(formData),
        })

        const data = await res.json()
        if (data.success) {
          router.push(redirectTo)
        } else {
          alert(data.message || '新增失敗')
        }
      } catch (err) {
        console.error(err)
        alert('新增收件人發生錯誤')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="mb-3">
        <label htmlFor="realname" className="form-label">
          姓名
        </label>
        <input
          id="realname"
          type="text"
          className="form-control"
          value={realname}
          onChange={(e) => setRealname(e.target.value)}
          placeholder="請輸入姓名"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="phone" className="form-label">
          電話
        </label>
        <input
          id="phone"
          type="tel"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="請輸入電話"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入 email"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="address" className="form-label">
          地址
        </label>
        <textarea
          id="address"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="請輸入地址"
          required
          rows={3}
        />
      </div>

      <div className="d-flex justify-content-center gap-5 mt-4">
        <CancelButton to={redirectTo}>取消</CancelButton>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  )
}
