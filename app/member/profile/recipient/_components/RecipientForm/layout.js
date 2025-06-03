'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import styles from './layout.module.css'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import CancelButton from '../../../../_components/BtnCustomGray/layout'

export default function RecipientForm({
  initialData = {},
  redirectTo = '/member/profile/recipient',
  onSubmit, // ✅ 編輯模式時可自定處理提交行為
}) {
  const [realname, setRealname] = useState(initialData.realname || '')
  const [phone, setPhone] = useState(initialData.phone || '')
  const [email, setEmail] = useState(initialData.email || '')
  const [address, setAddress] = useState(initialData.address || '')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!realname || !phone || !email || !address) {
      Swal.fire({
        icon: 'warning',
        title: '請填寫完整資訊',
        confirmButtonColor: '#c66900',
        background: '#fff4e5',
        color: '#c66900',
      })
      return
    }

    const formData = { realname, phone, email, address }

    if (onSubmit) {
      try {
        await onSubmit(formData)
        await Swal.fire({
          icon: 'success',
          title: '更新成功',
          showConfirmButton: false,
          timer: 800,
          background: '#e9f7ef',
          color: '#2e7d32',
        })
        router.push(redirectTo)
      } catch (err) {
        console.error(err)
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: '請稍後再試',
          confirmButtonColor: '#d33',
          background: '#fdecea',
          color: '#b71c1c',
        })
      }
    } else {
      try {
        const res = await fetch('http://localhost:3005/api/member/recipients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (data.success) {
          await Swal.fire({
            icon: 'success',
            title: '新增成功',
            showConfirmButton: false,
            timer: 800,
            background: '#e9f7ef',
            color: '#2e7d32',
          })
          router.push(redirectTo)
        } else {
          Swal.fire({
            icon: 'error',
            title: '新增失敗',
            text: data.message || '請稍後再試',
            confirmButtonColor: '#d33',
            background: '#fdecea',
            color: '#b71c1c',
          })
        }
      } catch (err) {
        console.error(err)
        Swal.fire({
          icon: 'error',
          title: '新增發生錯誤',
          text: '請檢查網路或稍後再試',
          confirmButtonColor: '#d33',
          background: '#fdecea',
          color: '#b71c1c',
        })
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
          placeholder="請輸入收件地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          autoComplete="street-address"
        />
      </div>

      {/* 按鈕 */}
      <div className="d-flex justify-content-center gap-5 mt-4">
        <CancelButton to={redirectTo}>取消</CancelButton>
        <SubmitButton>{onSubmit ? '更新' : '新增'}</SubmitButton>
      </div>
    </form>
  )
}
