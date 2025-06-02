'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const MemberContext = createContext()

export function MemberProvider({ children }) {
  const [member, setMember] = useState(null)

  const fetchMember = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/member/profile', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('未登入')
      const data = await res.json()
      setMember(data)
    } catch (error) {
      setMember(null)
    }
  }

  useEffect(() => {
    fetchMember()
  }, [])

  return (
    <MemberContext.Provider value={{ member, setMember, fetchMember }}>
      {children}
    </MemberContext.Provider>
  )
}

export function useMemberContext() {
  return useContext(MemberContext)
}
