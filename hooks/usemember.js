'use client'

import { useEffect, useState } from 'react'

export default function useMember() {
  const [member, setMember] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3005/api/member/profile', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('未登入')
        return res.json()
      })
      .then((data) => setMember(data))
      .catch(() => {
        // 不設成訪客，因為此 hook 只服務會員區
        setMember(null)
      })
  }, [])

  return member
}
