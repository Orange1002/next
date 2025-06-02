'use client'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [secret, setSecret] = useState('') // ✅ 加入 secret 狀態
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 寄送 OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:3005/api/member/requestotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('已寄出驗證碼，請查看您的信箱')
        setSecret(data.secret) // ✅ 儲存後端回傳的 secret
        setStep(2)
      } else {
        setError(data.message || '寄送失敗')
      }
    } catch (err) {
      setError('伺服器錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  // 重設密碼
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch(
        'http://localhost:3005/api/member/resetpassword',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret, // ✅ 傳送 secret
            otpToken: otp, // ✅ 改為後端需求的 otpToken
            newPassword,
          }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        setMessage('密碼已成功重設，請重新登入')
        // 延遲 2 秒跳轉
        setTimeout(() => {
          window.location.href = '/member/login'
        }, 2000)
      } else {
        setError(data.message || '重設密碼失敗')
      }
    } catch (err) {
      setError('伺服器錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">忘記密碼</h2>

      <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
        <div className="mb-3">
          <label className="form-label">電子信箱</label>
          <input
            type="email"
            className="form-control"
            value={email}
            disabled={step === 2}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {step === 2 && (
          <>
            <div className="mb-3">
              <label className="form-label">驗證碼</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">新密碼</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {error && <div className="text-danger mb-2">{error}</div>}
        {message && <div className="text-success mb-2">{message}</div>}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? '處理中...' : step === 1 ? '寄送驗證碼' : '重設密碼'}
        </button>
      </form>
    </div>
  )
}
