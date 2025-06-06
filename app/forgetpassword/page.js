'use client'
import { useState } from 'react'
import Swal from 'sweetalert2'
import styles from './forgetpassword.module.scss'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [secret, setSecret] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('請輸入電子信箱')
      return
    }

    setIsSendingOtp(true)
    try {
      const res = await fetch('http://localhost:3005/api/member/requestotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('已寄出驗證碼，請查看您的信箱')
        setSecret(data.secret)
        setStep(2)
      } else {
        setError(data.message || '寄送失敗')
      }
    } catch (err) {
      setError('伺服器錯誤')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!otp || !newPassword || !rePassword) {
      setError('請完整填寫欄位')
      return
    }

    if (newPassword.length < 6) {
      setError('密碼長度需至少 6 字元')
      return
    }

    if (newPassword !== rePassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    setIsResettingPassword(true)
    try {
      const res = await fetch(
        'http://localhost:3005/api/member/resetpassword',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret,
            otpToken: otp,
            newPassword,
          }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: '密碼已成功重設',
          text: '即將跳轉至登入頁面',
          showConfirmButton: false,
          timer: 2000,
        })
        setTimeout(() => {
          window.location.href = '/member/login?type=signin'
        }, 2000)
      } else {
        setError(data.message || '重設密碼失敗')
      }
    } catch (err) {
      setError('伺服器錯誤')
    } finally {
      setIsResettingPassword(false)
    }
  }

  return (
    <div className={`${styles.bg} d-flex container-fuild`}>
      <div className="d-flex justify-content-center align-items-center w-50 py-5">
        <Image
          src="/member/signin_images/logo2.png"
          alt="BARK & BIJOU"
          width={300}
          height={100}
          className={`${styles.image} w-100 h-75 object-fit-contain`}
          priority
        />
      </div>
      <div className="d-flex flex-column justify-content-center w-50 h-100">
        <h2 className={`${styles.title} text-center mb-5`}>忘記密碼</h2>

        <form
          className="d-flex flex-column justify-content-center align-items-center"
          onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
        >
          <div className={`${styles.inputField}`}>
            <FaEnvelope className={`${styles.icon} fs-4 ms-2`} />
            <input
              type="email"
              placeholder="電子信箱"
              value={email}
              disabled={step === 2}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {step === 1 && error && (
            <div className="text-danger mb-2">{error}</div>
          )}

          {step === 2 && (
            <>
              <div className={styles.inputField}>
                <FaLock className={`${styles.icon} fs-4 ms-2`} />
                <input
                  type="text"
                  placeholder="驗證碼 6位"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              {/* 新密碼欄位 */}
              <div className={`${styles.inputField} position-relative`}>
                <FaLock className={`${styles.icon} fs-4 ms-2`} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="新密碼"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? '隱藏密碼' : '顯示密碼'}
                  className={`${styles.iconeye} position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent fs-4`}
                  style={{ cursor: 'pointer' }}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* 確認密碼欄位 */}
              <div className={`${styles.inputField} position-relative`}>
                <FaLock className={`${styles.icon} fs-4 ms-2`} />
                <input
                  type={showRePassword ? 'text' : 'password'}
                  placeholder="確認密碼"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword(!showRePassword)}
                  aria-label={showRePassword ? '隱藏密碼' : '顯示密碼'}
                  className={`${styles.iconeye} position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent fs-4`}
                  style={{ cursor: 'pointer' }}
                >
                  {showRePassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {message && <div className="text-success mb-2">{message}</div>}
              {error && <div className="text-danger mb-2">{error}</div>}
              <button
                type="button"
                className={`${styles.btn}`}
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? '處理中...' : '重新寄送驗證碼'}
              </button>
            </>
          )}

          <button
            type="submit"
            className={`${styles.btn}`}
            disabled={isSendingOtp || isResettingPassword}
          >
            {isResettingPassword
              ? '處理中...'
              : step === 1
                ? '寄送驗證碼'
                : '重設密碼'}
          </button>
        </form>
        <button className={`${styles.home}`}>
          <Link
            href="/member/login?type=signin"
            className={`${styles.hometext}`}
          >
            回登入頁
          </Link>
        </button>
      </div>
    </div>
  )
}
