import { useEffect, useState } from 'react'
import { Dropdown, Badge } from 'react-bootstrap'
import styles from '../_styles/NotificationBell.module.css'
export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch('http://localhost:3005/api/notifications', {
        credentials: 'include',
      })
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    }

    fetchNotifications()
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <Dropdown align="end" className="position-relative">
      <Dropdown.Toggle
        as="button"
        className={`btn ${styles.btnNotification} border-0  bg-transparent d-flex align-items-center justify-content-center position-relative`}
        style={{ width: 35, height: 35 }}
        id="dropdown-notifications"
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
        <Dropdown.Header>
          通知中心
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="float-end text-primary small"
              style={{ cursor: 'pointer' }}
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
              className={n.read ? 'text-muted' : 'fw-bold'}
            >
              {n.message}
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}
