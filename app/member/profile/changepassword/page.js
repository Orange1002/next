'use client'

import React, { useState } from 'react'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import styles from './changepassword.module.css'
import { useAuth } from '../../../../hooks/use-auth'
import { FaLock } from 'react-icons/fa'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { member, isAuth, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (loading) return

    if (!isAuth) {
      setError('請先登入')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('新密碼與確認密碼不一致')
      return
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
        throw new Error(data.message || '修改失敗')
      }

      setSuccess('密碼修改成功')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <SectionTitle>修改密碼</SectionTitle>
      <div className="mt-lg-3 h-100">
        <div
          className={`${styles.block} p-lg-5 h-100 d-flex flex-column justify-content-center`}
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

              {/* 顯示錯誤或成功訊息 */}
              {error && (
                <div className="text-danger text-center mt-2">{error}</div>
              )}
              {success && (
                <div className="text-success text-center mt-2">{success}</div>
              )}

              {/* 送出按鈕 */}
              <div className="d-flex justify-content-center mt-lg-4">
                <BtnCustom type="submit">確認修改</BtnCustom>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
