'use client'

import React, { useState } from 'react'
import SignInForm from './_components/SignIn/layout'
import SignUpForm from './_components/SignUp/layout'
import styles from './signin-signup.module.scss'
import Image from 'next/image'

export default function SignInSignUpPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false) // 控制 class 切換

  return (
    <div
      className={`${styles.logContainer} ${isSignUpMode ? styles.signUpMode : ''}`}
    >
      <div className={`${styles.formsContainer}`}>
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
              onClick={() => setIsSignUpMode(true)}
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
              onClick={() => setIsSignUpMode(false)}
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
  )
}
