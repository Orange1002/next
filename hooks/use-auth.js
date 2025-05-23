'use client'
import { createContext, useContext, useEffect, useState } from 'react'

/**
 * @typedef {Object} User 使用者資料
 * @property {number} id 使用者的唯一識別碼
 * @property {string} username 使用者名稱
 * @property {string} name 使用者的全名
 * @property {string} email 使用者的電子郵件地址
 *
 * @typedef {Object} AuthContextValue
 * @property {User} member 當前登入的使用者資料
 * @property {boolean} isAuth 是否已登入
 * @property {boolean} loading 是否還在檢查登入狀態
 * @property {Function} login 登入方法
 * @property {Function} logout 登出方法
 */

const AuthContext = createContext(null)
AuthContext.displayName = 'AuthContext'

export { AuthContext }

export function AuthProvider({ children }) {
  const defaultMember = { id: 0, username: '', email: '', name: '' }
  const [member, setMember] = useState(defaultMember)
  const [loading, setLoading] = useState(true)
  const isAuth = Boolean(member.id)

  const login = (memberData) => {
    setMember(memberData)
  }

  const logout = () => {
    setMember(defaultMember)
  }

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/member/profile', {
          method: 'GET',
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          if (data && data.id) {
            setMember(data)
          }
        }
      } catch (err) {
        console.error('登入狀態檢查失敗', err)
      } finally {
        setLoading(false)
      }
    }

    checkLogin()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuth, member, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
