'use client'

import { useRouter } from 'next/navigation'
import styles from './layout.module.css'

export default function CancelButton({
  to = '/',
  back = false, // 新增 back 屬性
  className = '',
  children = '取消',
}) {
  const router = useRouter()

  const handleClick = () => {
    if (back) {
      router.back()
    } else {
      router.push(to)
    }
  }

  return (
    <button
      type="button"
      className={`d-block mt-3 mt-lg-0 ${styles.btnCustom} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
