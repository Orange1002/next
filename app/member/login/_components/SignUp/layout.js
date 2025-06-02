'use client'

import React, { useState } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import { FaEnvelope, FaLock, FaGoogle, FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/use-auth'
import useFirebase from '../../../../../hooks/use-firebase'

export default function SignUpForm({ isSignUpMode }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { loginGoogle } = useFirebase()
  const { login, refreshMember } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !email || !password) {
      setMessage('請填寫所有欄位')
      return
    }

    try {
      const res = await fetch('http://localhost:3005/api/member/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (res.ok && data.status === 'success') {
        setMessage('註冊成功!')
        login(data.data) // 儲存登入狀態
        await refreshMember() // 如果你想同步資料
        const memberId = data.data.id
        router.replace(`/member/profile/info/edit/${memberId}`)
      } else {
        setMessage(data.message || '註冊失敗')
      }
    } catch (error) {
      setMessage('伺服器錯誤')
    }
  }

  const handleGoogleRegister = async (e) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    setMessage('')

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
          router.push('/member/profile/info/edit/${memberId}')
        } else {
          setMessage(resData.message || 'Google 註冊失敗')
        }
      })
    } catch (error) {
      console.error(error)
      setMessage('Google 註冊失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${isSignUpMode ? styles.active : styles.inactive} d-flex flex-column align-items-center position-absolute w-100`}
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
      <div className={`${styles.inputField}`}>
        <FaUser className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="text"
          placeholder="使用者名稱"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className={`${styles.inputField}`}>
        <FaEnvelope className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="email"
          placeholder="電子信箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={`${styles.inputField}`}>
        <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <input type="submit" className={`${styles.btn}`} value="註冊" />
      {message && <p className="text-danger mt-2">{message}</p>}
      <p className={`${styles.socialText} my-3`}>或</p>
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
