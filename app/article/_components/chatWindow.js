import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export default function ChatWindow({ onClose, currentUser }) {
  const ref = useRef()
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null) // 用來滾到底部
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005'

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
    })

    socket.on('connect', () => {
      setIsConnected(true)
      setErrorMessage('')
    })

    socket.on('disconnect', (reason) => {
      setIsConnected(false)
      setErrorMessage(`Socket.IO 已斷線: ${reason}。請檢查網路或重新整理。`)
    })

    socket.on('chat message', (msg) => {
      setMessages((prev) => {
        if (msg.id && prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socket.on('connect_error', (err) => {
      setIsConnected(false)
      let errorMsg = '連線錯誤'
      if (err.message) errorMsg += `：${err.message}`
      setErrorMessage(errorMsg)
    })

    socketRef.current = socket
    return () => {
      socket.disconnect()
    }
  }, [])

  // 自動滾到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 關閉視窗點擊外部
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const sendMessage = () => {
    if (!input.trim()) {
      setErrorMessage('訊息內容不能為空！')
      return
    }
    if (!socketRef.current || !isConnected) {
      setErrorMessage('尚未連線，無法傳送訊息。')
      return
    }
    socketRef.current.emit('chat message', {
      text: input.trim(),
      user: currentUser?.name || '匿名',
      userId: currentUser?.id || null,
      createdAt: new Date().toISOString(),
    })
    setInput('')
    setErrorMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-overlay">
      <div className="chat-window" ref={ref}>
        <button className="chat-close-btn" onClick={onClose}>
          ×
        </button>
        <div className="chat-header">
          <h5>寵物交流區</h5>
        </div>
        {errorMessage && <div className="chat-error">{errorMessage}</div>}
        <div className="chat-body">
          {messages.map((msg, index) => {
            const isOwnMessage = currentUser && msg.userId === currentUser.id
            return (
              <div
                key={msg.id || index}
                className={`chat-message ${isOwnMessage ? 'own' : ''}`}
              >
                {!isOwnMessage && <div className="chat-message-user">{msg.user}</div>}
                <div className="chat-message-text">{msg.text}</div>
                <div className="chat-message-time">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-footer">
          <input
            type="text"
            placeholder={isConnected ? '輸入訊息...' : '尚未登入，無法輸入'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected || !input.trim()}>
            送出
          </button>
        </div>
      </div>
    </div>
  )
}
