'use client'

import React, { useState } from 'react'
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
}

export default function SignUpForm({ isSignUpMode }) {
  const MySwal = withReactContent(Swal)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
  })
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { loginGoogle } = useFirebase()
  const { login, refreshMember } = useAuth()

  // 欄位即時驗證 (加入字數門檻判斷)
  const validateField = async (field, value) => {
    // repassword 獨立處理，不呼叫後端
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

    // 其他欄位不足門檻就不驗證、不顯示錯誤
    if (!value || value.length < (MIN_LENGTH_TO_VALIDATE[field] || 1)) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
      return false
    }

    // 呼叫後端驗證
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

        setFieldErrors((prev) => ({
          ...prev,
          [field]: errorReason,
        }))
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

  // 判斷要顯示勾或叉的輔助函式（加入字數門檻判斷）
  const renderValidationIcon = (fieldValue, errorMsg, field) => {
    if (!fieldValue || fieldValue.length < (MIN_LENGTH_TO_VALIDATE[field] || 1))
      return null
    return errorMsg ? (
      <FaTimesCircle color="red" size={20} />
    ) : (
      <FaCheckCircle color="green" size={20} />
    )
  }

  // 送出表單
  const handleSubmit = async (e) => {
    e.preventDefault()

    const localErrors = []

    // 非空檢查
    if (!username || !email || !password || !repassword) {
      localErrors.push('請填寫所有欄位')
    }

    // 即時驗證錯誤檢查
    for (const key of ['username', 'email', 'password', 'repassword']) {
      if (fieldErrors[key]) {
        localErrors.push(fieldErrors[key])
      }
    }

    // 密碼一致性檢查
    if (password !== repassword) {
      localErrors.push('兩次輸入的密碼不一致')
    }

    if (localErrors.length > 0) {
      setMessages(localErrors)
      return
    }

    try {
      const res = await fetch('http://localhost:3005/api/member/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, repassword }),
      })

      const data = await res.json()

      if (res.ok && data.status === 'success') {
        setMessages(['註冊成功!'])
        login(data.data)
        await refreshMember()
        const memberId = data.data.id

        // 顯示成功提示，點擊確認後再跳轉
        await MySwal.fire({
          icon: 'success',
          title: '註冊成功！',
          text: '歡迎加入 BARK & BIJOU！',
          confirmButtonText: '前往編輯個人資料',
        })

        router.replace(`/member/profile/info/edit/${memberId}`)
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setMessages(data.errors.map((e) => e.reason))
        } else {
          setMessages([data.message || '註冊失敗'])
        }
      }
    } catch (error) {
      setMessages(['伺服器錯誤'])
    }
  }

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

        const resData = await res.json()

        if (res.ok && resData.status === 'success') {
          login(resData.data)
          await refreshMember()
          const memberId = resData.data.id
          router.push(`/member/profile/info/edit/${memberId}`)
        } else {
          if (resData.errors && Array.isArray(resData.errors)) {
            setMessages(resData.errors.map((e) => e.reason))
          } else {
            setMessages([resData.message || 'Google 註冊失敗'])
          }
        }
      })
    } catch (error) {
      console.error(error)
      setMessages(['Google 註冊失敗，請稍後再試'])
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

      {/* 使用者名稱 */}
      <div className={`${styles.inputField} position-relative`}>
        <FaUser className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="text"
          placeholder="輸入使用者名稱"
          value={username}
          onChange={async (e) => {
            setUsername(e.target.value)
            await validateField('username', e.target.value)
          }}
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
      <div className="text-danger mb-2">{fieldErrors.username}</div>

      {/* Email */}
      <div className={`${styles.inputField} position-relative`}>
        <FaEnvelope className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="email"
          placeholder="輸入電子信箱"
          value={email}
          onChange={async (e) => {
            setEmail(e.target.value)
            await validateField('email', e.target.value)
          }}
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
      <div className="text-danger mb-2">{fieldErrors.email}</div>

      {/* 密碼 */}
      <div className={`${styles.inputField} position-relative`}>
        <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="password"
          placeholder="輸入密碼"
          value={password}
          onChange={async (e) => {
            setPassword(e.target.value)
            await validateField('password', e.target.value)
          }}
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
      <div className="text-danger mb-2">{fieldErrors.password}</div>

      {/* 確認密碼 */}
      <div className={`${styles.inputField} position-relative`}>
        <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="password"
          placeholder="再次輸入密碼"
          value={repassword}
          onChange={async (e) => {
            setRepassword(e.target.value)
            await validateField('repassword', e.target.value)
          }}
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
      <div className="text-danger mb-2">{fieldErrors.repassword}</div>
      {messages.length > 0 && (
        <ul className="text-danger my-2">
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
      <button
        type="submit"
        className={`${styles.btn} mb-2`}
        disabled={isLoading}
      >
        註冊
      </button>

      <p className={`${styles.socialText} ${styles.divider} my-3`}>快速登入</p>
      <div className={styles.socialMedia}>
        <button
          type="button"
          onClick={handleGoogleRegister}
          className={`${styles.socialIcon} my-1 p-2 d-flex align-items-center`}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <FaGoogle className={`${styles.icon}`} />
          <span className={`${styles.socialText} mb-0 ms-2`}>
            {isLoading ? '註冊中...' : '使用 Google 註冊'}
          </span>
        </button>
      </div>
    </form>
  )
}
