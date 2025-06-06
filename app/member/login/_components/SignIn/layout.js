import React, { useState } from 'react'
import styles from './layout.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/use-auth'
import useFirebase from '../../../../../hooks/use-firebase'
import swal from 'sweetalert2'

export default function SignInForm({ isSignUpMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { loginGoogle } = useFirebase()
  const { login, refreshMember } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isEmailLoading) return
    setIsEmailLoading(true)
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('請輸入電子信箱與密碼')
      setIsEmailLoading(false)
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
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleLogin = async (e) => {
    e.preventDefault()
    if (isGoogleLoading) return
    setIsGoogleLoading(true)
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
          await refreshMember()

          if (resData.isNew) {
            // 不是 resData.data.isNewUser
            await swal.fire({
              icon: 'success',
              title: '註冊成功！',
              text: '歡迎加入 BARK & BIJOU！',
              confirmButtonText: '前往編輯個人資料',
              confirmButtonColor: '#ed784a',
            })
            router.replace(`/member/profile/info/edit/${resData.data.id}`)
          } else {
            router.replace('/')
          }
        } else {
          setErrorMsg(resData.message || 'Google 登入失敗')
        }
      })
    } catch (error) {
      console.error(error)
      setErrorMsg('Google 登入失敗，請稍後再試')
    } finally {
      setIsGoogleLoading(false)
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

      <h2 className={styles.title}>登入</h2>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <div className={styles.inputField}>
        <FaEnvelope className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type="text"
          placeholder="電子信箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={`${styles.inputField} position-relative`}>
        <FaLock className={`${styles.icon} ms-3 h-50 w-50`} />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`${styles.iconeye} position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent fs-4`}
          aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <input
        type="submit"
        className={`${styles.btn} solid`}
        value={isEmailLoading ? '登入中...' : '登入'}
        disabled={isEmailLoading}
      />

      <p className={`${styles.socialText} ${styles.divider} my-3`}>快速登入</p>

      <div className={styles.socialMedia}>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`${styles.socialIcon} my-1 p-2 d-flex align-items-center`}
          disabled={isGoogleLoading}
          aria-busy={isGoogleLoading}
          aria-disabled={isGoogleLoading}
        >
          <FaGoogle className={styles.icon} />
          <span className={`${styles.socialText} mb-0 ms-2`}>
            使用 Google 登入
          </span>
        </button>
      </div>

      <div className="mt-3">
        <Link href="/forgetpassword" className={`${styles.forget}`}>
          忘記密碼？
        </Link>
      </div>
    </form>
  )
}
