'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dropdown, Badge } from 'react-bootstrap'
import styles from '../_styles/NotificationBell.module.css'
import { useNotification } from '@/contexts/NotificationContext'

export default function NotificationBell() {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markOneAsRead,
    setNotifications, // ⚠️ 若你希望初次抓資料可以設進 context
    setUnreadCount, // ⚠️ 同上
  } = useNotification()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/notifications', {
          credentials: 'include',
        })
        const data = await res.json()
        const isArray = Array.isArray(data)
        if (isArray) {
          setNotifications(data)
          setUnreadCount(data.filter((n) => !n.is_read).length)
        }
      } catch (err) {
        console.error('❌ 通知抓取失敗', err)
      }
    }

    fetchNotifications()
  }, [setNotifications, setUnreadCount])

  const handleNotificationClick = async (id) => {
    try {
      await fetch(`http://localhost:3005/api/notifications/read/${id}`, {
        method: 'POST',
        credentials: 'include',
      })
      markOneAsRead(id)
      router.push('/member/orders?type=sitters')
    } catch (err) {
      console.error('❌ 單筆已讀失敗', err)
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
        <i className="bi bi-bell fs-4" />
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
        <Dropdown.Header className="d-flex fw-bold text-black fs-5 justify-content-between align-items-center">
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
              onClick={() => handleNotificationClick(n.id)}
              className={n.is_read ? 'text-muted' : 'fw-bold'}
              style={{ cursor: 'pointer' }}
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
