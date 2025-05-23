'use client'

import React, { useState } from 'react'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import styles from './changepassword.module.css'
import { useAuth } from '../../../../hooks/use-auth'

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

    if (loading) return // 等待登入狀態確認

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
        <div className={`${styles.block} p-lg-5 h-100`}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-between">
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">
                  請輸入舊密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  請輸入新密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  再次輸入新密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <div className="text-danger mt-2">{error}</div>}
              {success && <div className="text-success mt-2">{success}</div>}
            </div>

            <div className="d-flex justify-content-center mt-lg-5">
              <BtnCustom type="submit">確認修改</BtnCustom>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
