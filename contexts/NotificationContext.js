'use client'

import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // ✅ 初始載入所有通知
  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/notifications', {
        credentials: 'include',
      })
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.is_read).length)
    } catch (err) {
      console.error('❌ 抓取通知失敗', err)
    }
  }

  // ✅ 新增通知
  const addNotification = async (message) => {
    const res = await fetch('http://localhost:3005/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ message }),
    })

    if (!res.ok) {
      console.error('❌ 通知儲存到後端失敗')
      return
    }

    const data = await res.json()

    // 從後端取得通知資料
    const newNotification = {
      id: data.id,
      content: data.content,
      is_read: false,
      created_at: data.created_at,
    }

    setNotifications((prev) => [newNotification, ...prev])
    setUnreadCount((prev) => prev + 1)
  }

  // ✅ 標記全部已讀
  const markAllAsRead = async () => {
    await fetch('http://localhost:3005/api/notifications/read-all', {
      method: 'POST',
      credentials: 'include',
    })

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  // ✅ 單筆已讀
  const markOneAsRead = async (id) => {
    await fetch(`http://localhost:3005/api/notifications/read/${id}`, {
      method: 'POST',
      credentials: 'include',
    })

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount((prev) => Math.max(prev - 1, 0))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        markOneAsRead,
        fetchNotifications,
        setNotifications, // ✅ 加這個
        setUnreadCount, // ✅ 還有這個
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
