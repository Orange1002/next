'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const AuthContext = createContext(null)
AuthContext.displayName = 'AuthContext'

export function AuthProvider({ children }) {
  const defaultMember = { id: 0, username: '', email: '', name: '' }
  const [member, setMember] = useState(defaultMember)
  const [isReady, setIsReady] = useState(false)

  const isAuth = Boolean(member.id)

  const login = (memberData) => {
    setMember(memberData)
  }

  const logout = () => {
    setMember(defaultMember)
  }

  const refreshMember = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/member/profile', {
        method: 'GET',
        credentials: 'include',
      })

      if (res.status === 401) {
        logout()
        return
      }

      if (res.ok) {
        const data = await res.json()
        if (data && data.id) {
          setMember(data)
        } else {
          logout()
        }
      } else {
        logout()
      }
    } catch (err) {
      console.error('更新使用者資料失敗', err)
      logout()
    }
  }

  // 新增 Google 登入方法
  const signInWithGoogle = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // 這裡取得 Firebase 提供的 idToken
      const idToken = await user.getIdToken()

      // 呼叫你的後端 Google 登入 API，傳送 Google 資料給後端
      const res = await fetch(
        'http://localhost:3005/api/member/login/google-login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            providerId: user.providerData[0].providerId,
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            idToken, // 可選，看你後端有無要驗證
          }),
        }
      )

      if (!res.ok) {
        throw new Error('Google 登入失敗')
      }

      const data = await res.json()
      if (data.member && data.member.id) {
        setMember(data.member)
      } else {
        throw new Error('會員資料取得失敗')
      }
    } catch (error) {
      console.error('Google 登入錯誤', error)
      throw error
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      await refreshMember()
      setIsReady(true)
    }
    checkLogin()
  }, [])

  if (!isReady) return null

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        member,
        isReady,
        login,
        logout,
        refreshMember,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
