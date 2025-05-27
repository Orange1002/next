'use client'

import { useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth'

import { firebaseConfig } from './firebase-config'

const initApp = (callback) => {
  const auth = getAuth()

  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        const user = result.user
        console.log('Redirect 登入成功:', user)
      }
    })
    .catch((error) => {
      console.error('Redirect 登入錯誤:', error)
    })

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('目前登入使用者:', user)
      callback(user.providerData[0]) // 回傳精簡 user data 給呼叫端
    }
  })
}

const logoutFirebase = () => {
  const auth = getAuth()
  signOut(auth)
    .then(() => {
      console.log('Firebase 登出成功')
    })
    .catch((error) => {
      console.error('登出錯誤:', error)
    })
}

const loginGoogle = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log('Google popup 登入成功:', user)
    callback(user.providerData[0]) // 回傳精簡 user 資料給 callback
  } catch (error) {
    console.error('Google 登入錯誤:', error)
    throw error
  }
}

const loginGoogleRedirect = () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  signInWithRedirect(auth, provider)
}

const loginFBRedirect = () => {
  const provider = new FacebookAuthProvider()
  const auth = getAuth()
  signInWithRedirect(auth, provider)
}

// ✅ 回傳封裝好的 hook 方法
export default function useFirebase() {
  useEffect(() => {
    initializeApp(firebaseConfig)
  }, [])

  return {
    initApp,
    loginGoogle,
    loginGoogleRedirect,
    loginFBRedirect,
    logoutFirebase,
  }
}
