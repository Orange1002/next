'use client'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import styles from './resetpassword.module.scss'
import { FaLock } from 'react-icons/fa'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPasswordByLinkPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const secret = searchParams.get('secret') || ''

  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  // 如果沒有 secret，可以直接跳回登入或顯示錯誤訊息
  useEffect(() => {
    if (!secret && !checked) {
      setChecked(true) // 防止重複彈窗
      Swal.fire({
        icon: 'warning',
        title: '請透過正確管道重設密碼',
        confirmButtonText: '前往重設密碼',
        confirmButtonColor: '#ed784a',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        router.push('/forgetpassword') // 或你實際的忘記密碼頁路徑
      })
    }
  }, [secret, router, checked])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!newPassword || !rePassword) {
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
    if (!secret) {
      setError('缺少驗證憑證')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        'http://localhost:3005/api/member/resetpassword/bylink',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, newPassword }),
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
          router.push('/member/login?type=signin')
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
    <div
      className={`${styles.bg} d-flex container-fluid justify-content-center align-items-center`}
    >
      <div
        className={`${styles.resetContainer} d-flex flex-column justify-content-center align-items-center p-4`}
      >
        <h2 className={`${styles.title} text-center mb-4`}>重設密碼</h2>

        <form
          className="d-flex flex-column justify-content-center align-items-center"
          onSubmit={handleResetPassword}
        >
          <div className={styles.inputField}>
            <FaLock className={`${styles.icon} fs-4 ms-2`} />
            <input
              type="password"
              placeholder="新密碼"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className={styles.inputField}>
            <FaLock className={`${styles.icon} fs-4 ms-2`} />
            <input
              type="password"
              placeholder="確認密碼"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}
          {message && <div className="text-success mb-2">{message}</div>}

          <button
            type="submit"
            className={`${styles.btn} mt-3`}
            disabled={isLoading}
          >
            {isLoading ? '處理中...' : '重設密碼'}
          </button>
        </form>
      </div>
    </div>
  )
}
