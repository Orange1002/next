'use client'

import React, { useState, useEffect } from 'react'
import SignInForm from './_components/SignIn/layout'
import SignUpForm from './_components/SignUp/layout'
import styles from './signin-signup.module.scss'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SignInSignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 根據網址參數初始化模式
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')

    // 如果沒有 type 參數，預設導向 signin
    if (!type) {
      router.replace('?type=signin')
      return
    }

    setIsSignUpMode(type === 'signup')
  }, [searchParams])

  // 切換模式並更新網址參數
  const handleSwitch = (toSignUp) => {
    setIsSignUpMode(toSignUp)
    const nextType = toSignUp ? 'signup' : 'signin'
    router.replace(`?type=${nextType}`)
  }

  return (
    <>
      <button className={`${styles.home}`}>
        <Link href="/" className={`${styles.hometext}`}>
          回首頁
        </Link>
      </button>
      <div
        className={`${styles.logContainer} ${isSignUpMode ? styles.signUpMode : ''}`}
      >
        <div
          className={`${styles.formsContainer} ${isSignUpMode ? styles.scrollHeight : ''}`}
        >
          <div className={`${styles.signinSignup} h-100`}>
            <SignInForm isSignUpMode={isSignUpMode} />
            <SignUpForm isSignUpMode={isSignUpMode} />
          </div>
        </div>

        <div className={`${styles.panelsContainer} row g-0`}>
          <div
            className={`col-6 d-flex flex-column justify-content-center text-center align-items-center ${styles.leftPanel} ${styles.panel}`}
          >
            <div className={`${styles.content}`}>
              <h3 className="text-nowrap">
                加入 Bark_Bijou <br className="d-lg-none" />
                讓您的毛小孩生活更美好！
              </h3>
              <button
                className={`mt-2 mt-lg-3 ${styles.btn} ${styles.transparent}`}
                onClick={() => handleSwitch(true)}
              >
                去註冊
              </button>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <Image
                src="/member/signin_images/BARK & BIJOU.png"
                alt="BARK & BIJOU"
                width={300}
                height={100}
                className={`${styles.image} h-100 w-100 object-fit-cover`}
                priority
              />
            </div>
          </div>

          <div
            className={`col-6 d-flex flex-column justify-content-center text-center align-items-center ${styles.panel} ${styles.rightPanel}`}
          >
            <div className={`${styles.content}`}>
              <h3 className="text-nowrap">已經是我們的會員了?</h3>
              <button
                className={`mt-2 mt-lg-3 ${styles.btn} ${styles.transparent}`}
                onClick={() => handleSwitch(false)}
              >
                去登入
              </button>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <Image
                src="/member/signin_images/BARK & BIJOU.png"
                alt="BARK & BIJOU"
                width={300}
                height={100}
                className={`h-100 w-100 object-fit-cover ${styles.image}`}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
