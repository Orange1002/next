'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../../hooks/use-auth'

export default function MemberAvatarDropdown() {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { member, isReady, logout, isAuth } = useAuth()

  const baseUrl = 'http://localhost:3005'
  const timestamp = new Date().getTime()
  const defaultImg = '/member/member_images/user-img.svg'

  const imageSrc =
    member?.image_url && member.image_url !== ''
      ? member.image_url.startsWith('http')
        ? `${member.image_url}?t=${timestamp}`
        : `${baseUrl}${member.image_url}?t=${timestamp}`
      : `${baseUrl}${defaultImg}?t=${timestamp}`

  // 點擊外部區域關閉 dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/member/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        console.log('登出成功')
        setShowDropdown(false)
        logout()
      } else {
        console.error('登出失敗')
      }
    } catch (err) {
      console.error('登出錯誤', err)
    }
  }

  if (!isReady) return null

  return (
    <div className="member-dropdown position-relative" ref={dropdownRef}>
      <button
        className="icon-link border-0 bg-transparent p-0 d-flex align-items-center"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {isAuth ? (
          <Image
            src={imageSrc}
            alt="會員頭像"
            width={36}
            height={36}
            className="rounded-circle border border-2 avatar"
          />
        ) : (
          <i className="bi bi-person nav-icon fs-2"></i>
        )}
      </button>

      {showDropdown && (
        <div className="dropdown-menu show">
          {isAuth ? (
            <>
              {/* <Link
                href="/member"
                className="dropdown-item text-center"
                onClick={() => setShowDropdown(false)}
              >
                會員中心
              </Link> */}
              <p className="text-center my-2">Hi, {member.username}</p>
              <Link
                href="/member/profile/info"
                className="dropdown-item text-center"
                onClick={() => setShowDropdown(false)}
              >
                會員資料
              </Link>
              <Link
                href="/member/orders"
                className="dropdown-item text-center"
                onClick={() => setShowDropdown(false)}
              >
                我的訂單
              </Link>
              <Link
                href="/member/favorite"
                className="dropdown-item text-center"
                onClick={() => setShowDropdown(false)}
              >
                我的收藏
              </Link>
              <Link
                href="/member/coupons"
                className="dropdown-item text-center"
                onClick={() => setShowDropdown(false)}
              >
                優惠券 & VIP
              </Link>
              <button
                className="logout-btn text-center mx-4 text-decoration-none"
                onClick={handleLogout}
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/member/login?type=signin"
                className="logout-btn d-flex mx-4 text-decoration-none"
                onClick={() => setShowDropdown(false)}
              >
                登入
              </Link>
              <Link
                href="/member/login?type=signup"
                className="signup-btn d-flex mx-4 text-decoration-none mt-2"
                onClick={() => setShowDropdown(false)}
              >
                註冊
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
