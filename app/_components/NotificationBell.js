'use client'

import { useEffect, useState } from 'react'
import { Dropdown, Badge } from 'react-bootstrap'
import styles from '../_styles/NotificationBell.module.css'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/notifications', {
          credentials: 'include',
        })
        const data = await res.json()

        const isArray = Array.isArray(data)
        setNotifications(isArray ? data : [])
        setUnreadCount(isArray ? data.filter((n) => !n.is_read).length : 0)
      } catch (err) {
        console.error('❌ 通知抓取失敗', err)
      }
    }

    fetchNotifications()
  }, [])

  const markAllAsRead = async () => {
    try {
      await fetch('http://localhost:3005/api/notifications/read-all', {
        method: 'POST',
        credentials: 'include',
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('❌ 無法標記已讀', err)
    }
  }

  return (
    <Dropdown align="end" className="position-relative">
      <Dropdown.Toggle
        as="button"
        className={`btn ${styles.btnNotification} border-0 bg-transparent d-flex align-items-center justify-content-center position-relative`}
        style={{ width: 35, height: 35 }}
        id="dropdown-notifications"
        title="通知"
      >
        <i className="bi bi-bell fs-5" />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.5rem' }}
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: 300 }}>
        <Dropdown.Header className="d-flex justify-content-between align-items-center">
          通知中心
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-link btn-sm text-decoration-none"
              style={{ fontSize: '0.75rem' }}
            >
              全部已讀
            </button>
          )}
        </Dropdown.Header>
        {notifications.length === 0 ? (
          <Dropdown.Item disabled>目前沒有通知</Dropdown.Item>
        ) : (
          notifications.map((n, i) => (
            <Dropdown.Item
              key={i}
              className={n.is_read ? 'text-muted' : 'fw-bold'}
            >
              {n.content}
              <br />
              <small className="text-secondary">
                {new Date(n.created_at).toLocaleString()}
              </small>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}
