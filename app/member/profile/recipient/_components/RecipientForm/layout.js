'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './layout.module.css'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import CancelButton from '../../../../_components/BtnCustomGray/layout'

export default function RecipientForm({
  initialData = {},
  onSubmit,
  redirectTo = '/member/profile/recipient',
  submitLabel = '送出',
}) {
  const [name, setName] = useState(initialData.name || '')
  const [phone, setPhone] = useState(initialData.phone || '')
  const [address, setAddress] = useState(initialData.address || '')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !phone || !address) {
      alert('請填寫完整姓名、電話與地址')
      return
    }

    onSubmit?.({ name, phone, address }) // 呼叫外部提交邏輯
    router.push(redirectTo) // 導向指定頁面
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          姓名
        </label>
        <input
          id="name"
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
