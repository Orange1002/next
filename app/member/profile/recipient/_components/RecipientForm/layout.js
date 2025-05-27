'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './layout.module.css'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import CancelButton from '../../../../_components/BtnCustomGray/layout'

export default function RecipientForm({
  initialData = {},
  redirectTo = '/member/profile/recipient',
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
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} mt-3 h-100 justify-content-center d-flex flex-column align-items-center`}
    >
      {/* 姓名 */}
      <div className={`${styles.inputField} mb-3`}>
        <i className={`${styles.icon} bi bi-person fs-3`}></i>
        <input
          id="realname"
          type="text"
          value={realname}
          onChange={(e) => setRealname(e.target.value)}
          placeholder="請輸入收件人姓名"
          required
        />
      </div>

      {/* 電話 */}
      <div className={`${styles.inputField} mb-3`}>
        <i className={`${styles.icon} bi bi-phone fs-3`}></i>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="請輸入聯絡電話"
          required
        />
      </div>

      {/* Email */}
      <div className={`${styles.inputField} mb-3`}>
        <i className={`${styles.icon} bi bi-envelope fs-3`}></i>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入 email"
          required
        />
      </div>

      {/* 地址 */}
      <div className={`${styles.inputField} mb-3`}>
        <i className={`${styles.icon} bi bi-geo-alt fs-3`}></i>
        <input
          id="address"
          aria-label="收件地址"
          placeholder="請輸入收件地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          spellCheck="false"
          autoComplete="street-address"
        />
      </div>

      {/* 按鈕區塊 */}
      <div className="d-flex justify-content-center gap-5 mt-4">
        <CancelButton to={redirectTo}>取消</CancelButton>
        <SubmitButton>新增</SubmitButton>
      </div>
    </form>
  )
}
