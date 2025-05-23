'use client'

import React, { useState } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function SignInForm({ isSignUpMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('請輸入電子信箱與密碼')
      return
    }

    try {
      const res = await fetch('http://localhost:3005/api/member/login', {
        // 後端 .env檔要加上JWT_SECRET=YOUR_PASSWORD
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        // 登入成功，導向首頁或會員頁
        router.push('/member')
      } else {
        // 登入失敗，顯示錯誤訊息
        setErrorMsg(data.message || '登入失敗')
      }
    } catch (error) {
      setErrorMsg('伺服器錯誤，請稍後再試')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${isSignUpMode ? styles.inactive : styles.active} d-flex flex-column align-items-center position-absolute w-100`}
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
      <h2 className={`${styles.title}`}>登入</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <div className={`${styles.inputField}`}>
        <FaEnvelope className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="text"
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
      <input type="submit" className={`${styles.btn} solid`} value="登入" />
      <p className={`${styles.socialText} my-3`}>或</p>
      <div className={styles.socialMedia}>
        <a href="#" className={`${styles.socialIcon} my-1 p-2`}>
          <FaGoogle className={`${styles.icon}`} />
          <p className={`${styles.socialText} mb-0 ms-2`}>使用Google登入</p>
        </a>
      </div>
    </form>
  )
}
