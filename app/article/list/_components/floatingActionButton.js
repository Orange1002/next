import React, { useState } from 'react'
import Link from 'next/link'
import '../_style/list.scss'
import { FaPaw, FaComments } from 'react-icons/fa'
import ChatWindow from '../../_components/chatWindow.js'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleChat = () => setChatOpen(!chatOpen)

  return (
    <>
      {/* 聊天按鈕獨立容器 */}
      <div className="fab-chat-container position-fixed">
        <button
          className="btn shadow fab-main text-white c-s-btn p-2"
          style={{ width: '40px', height: '40px' }}
          onClick={toggleChat}
          title={chatOpen ? '關閉聊天室' : '開啟聊天室'}
        >
          <FaComments size={20} />
        </button>
      </div>

      {/* 編輯文章按鈕群 */}
      <div className="fab-container position-fixed d-flex flex-column align-items-end">
        {isOpen && (
          <>
            <Link
              href="/article/post"
              className="btn mb-2 fab-option show d-flex align-items-center"
              id="postBtn"
            >
              <FaPaw className="me-1" />
              <span>我要發文</span>
            </Link>

            <Link
              href="/member/favorite"
              className="btn mb-2 fab-option show d-flex align-items-center"
              id="editBtn"
            >
              <FaPaw className="me-1" />
              <span>我的收藏</span>
            </Link>
          </>
        )}

        <button
          id="fabToggle"
          className="btn shadow fab-main text-white c-s-btn p-2"
          style={{ width: '160px', height: '40px' }}
          onClick={toggleMenu}
        >
          <div className="d-flex justify-content-center align-items-center gap-1">
            <FaPaw className="me-1" />
            <p>{isOpen ? '關閉' : '編輯文章'}</p>
          </div>
        </button>
      </div>

      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
    </>
  )
}

export default FloatingActionButton
