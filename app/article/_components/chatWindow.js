'use client'
import { useEffect, useRef } from 'react'
import '../_style/article.scss'

export default function ChatWindow({ onClose }) {
  const ref = useRef()

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
  }, [ref, onClose])

  return (
    <div className="chat-overlay">
      <div className="chat-window" ref={ref}>
        <button
          className="chat-close-btn"
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
        <div className="chat-header">
          <h5>線上客服 Roger</h5>
        </div>
        <div className="chat-body">
          <p>你好，有什麼可以幫忙的嗎？</p>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="form-control"
            placeholder="輸入訊息..."
          />
        </div>
      </div>
    </div>
  )
}
