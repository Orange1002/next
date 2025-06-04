'use client'

import React, { useState, useEffect } from 'react'
import styles from './layout.module.scss'
import Image from 'next/image'
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/use-auth'
import useFirebase from '../../../../../hooks/use-firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MIN_LENGTH_TO_VALIDATE = {
  username: 3,
  email: 5,
  password: 5,
  repassword: 3,
  otp: 6, // 假設 OTP 長度 6
}

export default function SignUpForm({ isSignUpMode }) {
  const MySwal = withReactContent(Swal)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [otp, setOtp] = useState('')
  const [secret, setSecret] = useState('')

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
    otp: '',
  })
  const [messages, setMessages] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const router = useRouter()
  const { loginGoogle } = useFirebase()
  const { login, refreshMember } = useAuth()

  // 寄出驗證碼
  const handleSendOtp = async () => {
    setMessages([])
    if (!email || email.length < MIN_LENGTH_TO_VALIDATE.email) {
      setMessages(['請輸入有效電子信箱'])
      return
    }

    setIsSendingOtp(true)
    try {
      const res = await fetch(
        'http://localhost:3005/api/member/signup/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        setMessages([
          {
            type: data.status,
            text: data.message || '驗證碼已寄出，請至信箱查收',
          },
        ])
        setSecret(data.secret || '')
        setIsOtpSent(true)
        setCountdown(60)
      } else {
        setMessages([{ type: 'error', text: data.message || '寄送驗證碼失敗' }])
      }
    } catch (error) {
      setMessages([{ type: 'error', text: '伺服器錯誤，請稍後再試' }])
    } finally {
      setIsSendingOtp(false)
    }
  }

  useEffect(() => {
    if (countdown === 0) return

    const timerId = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [countdown])

  // 進行驗證
  const handleVerifyOtp = async () => {
    setMessages([])

    if (!otp || otp.length !== MIN_LENGTH_TO_VALIDATE.otp) {
      setMessages([{ type: 'error', text: '請輸入正確長度的 驗證碼' }])
      return
    }

    setIsVerifyingOtp(true)
    try {
      const res = await fetch(
        'http://localhost:3005/api/member/signup/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, secret }),
        }
      )
      const data = await res.json()

      if (res.ok && data.status === 'success') {
        setMessages([{ type: 'success', text: data.message || '信箱驗證成功' }])
        setIsOtpVerified(true)
      } else {
        setMessages([{ type: 'error', text: data.message || '驗證失敗' }])
        if (data.secret) {
          setSecret(data.secret)
        }
      }
    } catch (error) {
      setMessages([{ type: 'error', text: '伺服器錯誤，請稍後再試' }])
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // 欄位即時驗證
  const validateField = async (field, value) => {
    if (field === 'otp') return

    if (field === 'repassword') {
      if (value.length < MIN_LENGTH_TO_VALIDATE.repassword) {
        setFieldErrors((prev) => ({ ...prev, repassword: '' }))
        return false
      }
      if (value !== password) {
        setFieldErrors((prev) => ({
          ...prev,
          repassword: '兩次密碼輸入不一致',
        }))
        return false
      } else {
        setFieldErrors((prev) => ({ ...prev, repassword: '' }))
        return true
      }
    }

    if (!value || value.length < (MIN_LENGTH_TO_VALIDATE[field] || 1)) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
      return false
    }

    try {
      const res = await fetch(
        'http://localhost:3005/api/member/signup/validate-field',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field, value }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        const errorReason =
          data.errors && data.errors.length > 0
            ? data.errors[0].reason
            : data.message || '欄位驗證錯誤'

        setFieldErrors((prev) => ({ ...prev, [field]: errorReason }))
        return false
      } else {
        setFieldErrors((prev) => ({ ...prev, [field]: '' }))
        return true
      }
    } catch (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: '伺服器錯誤，請稍後再試' }))
      return false
    }
  }

  // 判斷勾或叉
  const renderValidationIcon = (fieldValue, errorMsg, field) => {
    if (!fieldValue || fieldValue.length < (MIN_LENGTH_TO_VALIDATE[field] || 1))
      return null
    return errorMsg ? (
      <FaTimesCircle color="red" size={20} />
    ) : (
      <FaCheckCircle color="green" size={20} />
    )
  }

  // 完成註冊（需 OTP 驗證成功才可送出）
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isOtpVerified) {
      setMessages(['請先完成 OTP 驗證'])
      return
    }

    // ...（前面欄位驗證略）

    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:3005/api/member/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, repassword }),
      })
      const data = await res.json()

      // ===== 這裡判斷 data.status =====
      if (res.ok && data.status === 'success') {
        setMessages(['註冊成功!'])
        login(data.data)
        await refreshMember()
        const memberId = data.data.id

        await MySwal.fire({
          icon: 'success',
          title: '註冊成功！',
          text: '歡迎加入 BARK & BIJOU！',
          confirmButtonText: '前往編輯個人資料',
          confirmButtonColor: '#ed784a',
        })
        router.replace(`/member/profile/info/edit/${memberId}`)
      } else {
        // 如果有 field errors 或單純 message，統一顯示
        if (data.errors && Array.isArray(data.errors)) {
          setMessages(data.errors.map((e) => e.reason))
        } else {
          setMessages([data.message || '註冊失敗'])
        }
      }
    } catch (error) {
      setMessages(['伺服器錯誤'])
    } finally {
      setIsLoading(false)
    }
  }

  // Google 登入
  const handleGoogleRegister = async (e) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    setMessages([])

    try {
      await loginGoogle(async (providerData) => {
        const res = await fetch(
          'http://localhost:3005/api/member/login/google-login',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(providerData),
          }
        )
        const data = await res.json()
        if (res.ok && data.status === 'success') {
          login(data.data)
          await refreshMember()

          if (data.isNew) {
            // 不是 data.data.isNew，是 data.isNew
            router.replace(`/member/profile/info/edit/${data.id}`) // 新會員導向補資料頁
          } else {
            router.replace('/')
          }
        } else {
          setMessages([data.message || 'Google 登入失敗'])
        }
      })
    } catch (error) {
      setMessages(['Google 登入失敗'])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${
        isSignUpMode ? styles.active : styles.inactive
      } d-flex flex-column align-items-center position-absolute w-100 pb-5 mb-lg-0`}
    >
      <div className={`${styles.imgBrand} py-3 d-lg-none`}>
        <Image
          src="/member/signin_images/BARK & BIJOU_horizontal.png"
          alt="BARK & BIJOU"
          width={300}
          height={100}
          className="h-100 w-100 object-fit-cover"
        />
      </div>
      <h2 className={`${styles.title}`}>註冊</h2>

      {/* Email 輸入欄位 */}
      <div className={`${styles.inputField} position-relative`}>
        <FaEnvelope className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="email"
          placeholder="輸入電子信箱"
          value={email}
          disabled={isOtpSent}
          onChange={(e) => {
            setEmail(e.target.value)
            if (isOtpSent) setIsOtpSent(false) // 改 email 代表要重寄 OTP
            validateField('email', e.target.value)
          }}
          onBlur={() => validateField('email', email)}
          className={styles.input}
          required
        />
        <span
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          {renderValidationIcon(email, fieldErrors.email, 'email')}
        </span>
      </div>

      {fieldErrors.email && (
        <p className={styles.errorMsg}>{fieldErrors.email}</p>
      )}

      {/* 顯示錯誤/成功訊息 */}
      <div className={styles.messageBox}>
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={`${styles.message} ${
              msg.type === 'success' ? styles.success : styles.error
            }`}
          >
            {msg.text}
          </p>
        ))}
      </div>

      {/* 如果 OTP 尚未寄出，顯示寄送 OTP 按鈕 */}
      {!isOtpSent && (
        <button
          type="button"
          onClick={handleSendOtp}
          className={styles.btn}
          disabled={isLoading}
        >
          {isLoading ? '寄送中...' : '取得 驗證碼'}
        </button>
      )}

      {/* 寄送 OTP 後，顯示 OTP 輸入框與驗證按鈕 */}
      {isOtpSent && !isOtpVerified && (
        <>
          <div className={`${styles.inputField} position-relative`}>
            <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
            <input
              type="text"
              placeholder="輸入 6位驗證碼"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
              }}
              className={styles.input}
              maxLength={6}
              required
            />
          </div>

          {fieldErrors.otp && (
            <p className={styles.errorMsg}>{fieldErrors.otp}</p>
          )}
          {countdown > 0 ? (
            <p>{countdown} 秒後可重新寄送驗證碼</p>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              className={styles.btn}
              disabled={isSendingOtp}
            >
              {isSendingOtp ? '寄送中...' : '重新取得驗證碼'}
            </button>
          )}

          <button
            type="button"
            onClick={handleVerifyOtp}
            className={styles.btn}
            disabled={isVerifyingOtp}
          >
            {isVerifyingOtp ? '驗證中...' : '驗證'}
          </button>
        </>
      )}

      {/* OTP 驗證成功後，顯示其他欄位 */}
      {isOtpVerified && (
        <>
          <div className={`${styles.inputField} position-relative`}>
            <FaUser className={`${styles.icon} ms-3 h-50 w-50`} />
            <input
              type="text"
              placeholder="輸入使用者名稱"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                validateField('username', e.target.value)
              }}
              onBlur={() => validateField('username', username)}
              className={styles.input}
              required
            />
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              {renderValidationIcon(username, fieldErrors.username, 'username')}
            </span>
          </div>
          {fieldErrors.username && (
            <p className={styles.errorMsg}>{fieldErrors.username}</p>
          )}

          <div className={`${styles.inputField} position-relative`}>
            <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
            <input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                validateField('password', e.target.value)
              }}
              onBlur={() => validateField('password', password)}
              className={styles.input}
              required
            />
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              {renderValidationIcon(password, fieldErrors.password, 'password')}
            </span>
          </div>
          {fieldErrors.password && (
            <p className={styles.errorMsg}>{fieldErrors.password}</p>
          )}

          <div className={`${styles.inputField} position-relative`}>
            <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
            <input
              type="password"
              placeholder="再次輸入密碼"
              value={repassword}
              onChange={(e) => {
                setRepassword(e.target.value)
                validateField('repassword', e.target.value)
              }}
              onBlur={() => validateField('repassword', repassword)}
              className={styles.input}
              required
            />
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              {renderValidationIcon(
                repassword,
                fieldErrors.repassword,
                'repassword'
              )}
            </span>
          </div>
          {fieldErrors.repassword && (
            <p className={styles.errorMsg}>{fieldErrors.repassword}</p>
          )}

          <button type="submit" className={styles.btn} disabled={isLoading}>
            {isLoading ? '註冊中...' : '完成註冊'}
          </button>
        </>
      )}

      <p className={`${styles.socialText} ${styles.divider} my-3`}>快速登入</p>

      <div className={styles.socialMedia}>
        <button
          type="button"
          onClick={handleGoogleRegister}
          className={`${styles.socialIcon} my-1 p-2 d-flex align-items-center`}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <FaGoogle className={styles.icon} />
          <span className={`${styles.socialText} mb-0 ms-2`}>
            使用 Google 登入
          </span>
        </button>
      </div>
    </form>
  )
}
