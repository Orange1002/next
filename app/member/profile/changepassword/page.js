'use client'

import React, { useState } from 'react'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import styles from './changepassword.module.css'
import { useAuth } from '../../../../hooks/use-auth'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import MobileMemberMenu from '../../_components/mobileLinks/layout'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      <div className="mt-3 h-100">
        <div
          className={`${styles.block} p-3 pb-4 p-lg-5 h-100 d-flex flex-column justify-content-center`}
        >
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column align-items-center justify-content-between">
              {/* 舊密碼 */}
              <div className={`${styles.inputField} mb-2 position-relative`}>
                <FaLock className={`${styles.icon} ms-3`} />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="請輸入舊密碼"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={`${styles.iconeye} position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent fs-4`}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? '隱藏舊密碼' : '顯示舊密碼'}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* 新密碼 */}
              <div className={`${styles.inputField} mb-2 position-relative`}>
                <FaLock className={`${styles.icon} ms-3`} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="請輸入新密碼"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={`${styles.iconeye} position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent fs-4`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? '隱藏新密碼' : '顯示新密碼'}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* 確認新密碼 */}
              <div className={`${styles.inputField} mb-2 position-relative`}>
                <FaLock className={`${styles.icon} ms-3`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="再次輸入新密碼"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={`${styles.iconeye} position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent fs-4`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? '隱藏確認新密碼' : '顯示確認新密碼'
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
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
