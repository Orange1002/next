import React, { useState } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/use-auth'
import useFirebase from '../../../../../hooks/use-firebase'

export default function SignInForm({ isSignUpMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const { loginGoogle } = useFirebase()
  const [isLoading, setIsLoading] = useState(false)

  const { login, refreshMember, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLoading) return
    setIsLoading(true)

    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('請輸入電子信箱與密碼')
      return
    }

    try {
      const res = await fetch('http://localhost:3005/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        login(data.data)
        await refreshMember()
        router.push('/')
      } else {
        setErrorMsg(data.message || '登入失敗')
      }
    } catch (error) {
      setErrorMsg('伺服器錯誤，請稍後再試')
    }
  }

  const handleGoogleLogin = async (e) => {
    e.preventDefault()
    if (isLoading) return // 防止重複觸發
    setIsLoading(true)
    setErrorMsg('')

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
          console.log('Google 登入 API 回傳：', resData)
          await refreshMember()
          router.push('/')
        } else {
          setErrorMsg(resData.message || 'Google 登入失敗')
        }
      })
    } catch (error) {
      console.error(error)
      setErrorMsg('Google 登入失敗，請稍後再試')
    } finally {
      setIsLoading(false)
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
        {/* 這裡改成 button 並加 onClick */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`${styles.socialIcon} my-1 p-2 d-flex align-items-center`}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-disabled={isLoading}
        >
          <FaGoogle className={`${styles.icon}`} />
          <span className={`${styles.socialText} mb-0 ms-2`}>
            {isLoading ? '登入中...' : '使用 Google 登入'}
          </span>
        </button>
      </div>
    </form>
  )
}
