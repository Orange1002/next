'use client'

import React, { useState } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import { FaEnvelope, FaLock, FaGoogle, FaUser } from 'react-icons/fa'

export default function SignUpForm({ isSignUpMode }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

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
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('註冊成功，可以登入了！')
        // 可選擇清空表單或跳轉登入頁
      } else {
        setMessage(data.message || '註冊失敗')
      }
    } catch (error) {
      setMessage('伺服器錯誤')
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
        <a href="#" className={`${styles.socialIcon} p-2`}>
          <FaGoogle className={`${styles.icon}`} />
          <p className={`${styles.socialText} mb-0 ms-2`}>使用Google註冊</p>
        </a>
      </div>
    </form>
  )
}
