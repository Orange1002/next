'use client'

import React, { useState } from 'react'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import styles from './changepassword.module.css'
import { useAuth } from '../../../../hooks/use-auth'
import { FaLock } from 'react-icons/fa'
import Swal from 'sweetalert2'
import MobileMemberMenu from '../../_components/mobileLinks/layout'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { member, isAuth, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (!isAuth) {
      return Swal.fire({
        icon: 'warning',
        title: '請先登入',
        background: '#fff3cd',
        color: '#856404',
      })
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: '密碼不一致',
        text: '新密碼與確認密碼需相同',
        background: '#fdecea',
        color: '#b71c1c',
      })
    }

    try {
      const res = await fetch(
        `http://localhost:3005/api/member/profile/${member.id}/password`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            currentPassword,
            newPassword,
          }).toString(),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        // 後端回傳錯誤訊息時顯示
        return Swal.fire({
          icon: 'error',
          title: '修改失敗',
          text: data.message || '修改密碼時發生錯誤',
          background: '#fdecea',
          color: '#b71c1c',
        })
      }

      // 修改成功提示
      await Swal.fire({
        icon: 'success',
        title: '密碼修改成功',
        timer: 1200,
        showConfirmButton: false,
        background: '#e9f7ef',
        color: '#2e7d32',
      })

      // 清空欄位
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      // fetch 本身錯誤時顯示
      Swal.fire({
        icon: 'error',
        title: '修改失敗',
        text: err.message || '網路連線錯誤',
        background: '#fdecea',
        color: '#b71c1c',
      })
    }
  }

  return (
    <>
      <SectionTitle>修改密碼</SectionTitle>
      <div className="mt-lg-3 h-100">
        <div
          className={`${styles.block} p-3 pb-4 p-lg-5 h-100 d-flex flex-column justify-content-center`}
        >
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column align-items-center justify-content-between">
              {/* 舊密碼 */}
              <div className={`${styles.inputField} mb-2`}>
                <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
                <input
                  type="password"
                  placeholder="請輸入舊密碼"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              {/* 新密碼 */}
              <div className={`${styles.inputField} mb-2`}>
                <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
                <input
                  type="password"
                  placeholder="請輸入新密碼"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              {/* 確認新密碼 */}
              <div className={`${styles.inputField} mb-2`}>
                <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
                <input
                  type="password"
                  placeholder="再次輸入新密碼"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* 送出按鈕 */}
              <div className="d-flex justify-content-center mt-lg-4">
                <BtnCustom type="submit">確認修改</BtnCustom>
              </div>
            </div>
          </form>
        </div>
      </div>
      <MobileMemberMenu />
    </>
  )
}
