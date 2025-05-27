import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export default function ChatWindow({ onClose }) {
  const ref = useRef()
  const socketRef = useRef(null) // 初始化為 null 更明確
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false) // 新增狀態：追蹤 Socket.IO 連線狀態

  useEffect(() => {
    // 動態或從環境變數獲取 Socket.IO 的 URL
    // 開發環境通常是 'http://localhost:3000/'
    // 正式環境請確保指向你部署的後端服務 URL
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/'

    console.log(`嘗試連線到 Socket.IO 伺服器: ${SOCKET_URL}`)

    const socket = io('http://localhost:3005', {
      transports: ['websocket'],
      withCredentials: true, // 允許跨域請求攜帶 cookie (非常重要，用於 JWT 驗證)
    })

    // 監聽連線成功事件
    socket.on('connect', () => {
      console.log('Socket.IO 連線成功！')
      setIsConnected(true) // 更新連線狀態
      setErrorMessage('') // 連線成功時清除任何先前的錯誤訊息
    })

    // 監聽 Socket.IO 斷線事件
    socket.on('disconnect', (reason) => {
      console.warn('Socket.IO 已斷線:', reason)
      setIsConnected(false) // 更新連線狀態
      setErrorMessage(`Socket.IO 已斷線: ${reason}。請檢查網路或重新整理。`)
    })

    // 監聽聊天訊息
    socket.on('chat message', (msg) => {
      console.log('接收到訊息:', msg)
      setMessages((prev) => {
        // 防止重複添加訊息，如果訊息有唯一 ID
        if (msg.id && prev.some((existingMsg) => existingMsg.id === msg.id)) {
          return prev
        }
        return [...prev, msg]
      })
    })

    // 監聽 Socket.IO 連線錯誤事件
    socket.on('connect_error', (err) => {
      console.error('Socket.IO 連線錯誤:', err.message, err.data)
      setIsConnected(false) // 更新連線狀態
      let errorMsg = 'Socket 連線錯誤'
      if (err.message) {
        errorMsg += `：${err.message}`
      }
      // 根據伺服器傳回的錯誤資訊，給予更友善的提示
      if (err.data && err.data.message) {
        errorMsg += ` (${err.data.message})`
      } else if (err.message.includes('JWT 驗證失敗')) {
        errorMsg += ` (請確認您已登入並擁有有效的會話)`
      } else if (
        err.message.includes('缺少登入憑證') ||
        err.message.includes('Cookie 中無 accessToken')
      ) {
        errorMsg += ` (您似乎尚未登入，請先登入)`
      }
      setErrorMessage(errorMsg)
    })

    // 監聽伺服器主動發送的錯誤訊息 (例如訊息內容驗證失敗)
    socket.on('error message', (msg) => {
      console.error('伺服器發送的錯誤訊息:', msg)
      setErrorMessage('伺服器錯誤: ' + msg)
    })

    socketRef.current = socket // 將 socket 實例儲存到 ref

    // 清理函數：元件卸載時斷開 Socket.IO 連線
    return () => {
      console.log('ChatWindow 元件卸載，斷開 Socket.IO 連線。')
      socket.disconnect()
    }
  }, []) // 空依賴陣列表示只在元件掛載時執行一次

  // 點擊聊天視窗外部時關閉聊天視窗
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

  // 發送訊息函數
  const sendMessage = () => {
    if (!input.trim()) {
      // 檢查訊息是否為空或只包含空白
      setErrorMessage('訊息內容不能為空！')
      return
    }
    if (!socketRef.current || !isConnected) {
      // 檢查 Socket.IO 是否連線
      setErrorMessage(
        '尚未連線到聊天伺服器，無法傳送訊息。請檢查網路或重新整理。'
      )
      return
    }
    // 發送訊息到伺服器
    socketRef.current.emit('chat message', { text: input.trim() })
    setInput('') // 清空輸入框
    setErrorMessage('') // 清空錯誤訊息 (如果成功發送，則清除之前可能的訊息內容錯誤)
  }

  // 處理鍵盤事件，按 Enter 發送訊息
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 阻止 Enter 鍵的預設行為（例如換行）
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
        {/* 錯誤訊息顯示區 */}
        {/* {errorMessage && (
          <div
            style={{
              color: 'red',
              padding: 10,
              backgroundColor: '#fee',
              marginBottom: 10,
              borderRadius: 4,
              fontWeight: 'bold',
            }}
          >
            {errorMessage}
          </div>
        )} */}

        {/* 聊天訊息顯示區 */}
        <div
          className="chat-body"
          style={{
            overflowY: 'auto',
            maxHeight: 300,
            border: '1px solid #ccc',
            padding: 10,
            display: 'flex', // 新增：使用 flex 讓訊息從下往上堆疊
            flexDirection: 'column-reverse', // 新增：從底部開始顯示最新訊息
          }}
        >
          {/* 倒序顯示訊息，這樣最新訊息會在底部 */}
          {messages.length === 0 && !errorMessage && (
            <p>你好，讓大家知道你的想法吧</p>
          )}
          {messages
            .slice()
            .reverse()
            .map((msg, index) => (
              <p key={msg.id || index} style={{ marginBottom: '5px' }}>
                <strong>{msg.user || '匿名'}：</strong> {msg.text}{' '}
                <small style={{ color: '#666', fontSize: '0.8em' }}>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </small>
              </p>
            ))}
        </div>

        {/* 輸入框和發送按鈕 */}
        <div
          className="chat-footer"
          style={{ marginTop: 10, display: 'flex', gap: 8 }}
        >
          <input
            type="text"
            className="form-control"
            placeholder={isConnected ? '輸入訊息...' : '尚未登入，無法輸入'} // 根據連線狀態改變提示
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected} // 根據連線狀態禁用輸入框
            style={{ flexGrow: 1, padding: 8 }}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !input.trim()}
            style={{ padding: '8px 16px' }}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  )
}

// import { useEffect, useRef, useState } from 'react'
// import io from 'socket.io-client'

// export default function ChatWindow({ onClose }) {
//   const ref = useRef()
//   const socketRef = useRef()
//   const [input, setInput] = useState('')
//   const [messages, setMessages] = useState([])
//   const [errorMessage, setErrorMessage] = useState('')

//   useEffect(() => {
//     // 確保連線到正確的後端 Port，根據你的後端實際啟動的 Port 調整
//     const socket = io('http://localhost:3000/', { // <-- **請務必確認後端 Port 是否是 3000**
//       transports: ['websocket'],
//       withCredentials: true,
//     })

//     socket.on('chat message', (msg) => {
//       console.log('Received message:', msg); // 調試用
//       setMessages((prev) => {
//         // 防止重複添加，如果訊息有唯一 ID
//         if (msg.id && prev.some(existingMsg => existingMsg.id === msg.id)) {
//           return prev;
//         }
//         return [...prev, msg];
//       });
//     })

//     socket.on('connect_error', (err) => {
//       console.error('Socket 連線錯誤:', err.message, err.data);
//       let errorMsg = 'Socket 連線錯誤';
//       if (err.message) {
//         errorMsg += `：${err.message}`;
//       }
//       if (err.data && err.data.message) {
//         errorMsg += ` (${err.data.message})`;
//       } else if (err.message.includes('JWT 驗證失敗')) {
//         errorMsg += ` (請確認您已登入並擁有有效的會話)`;
//       } else if (err.message.includes('缺少登入憑證')) {
//         errorMsg += ` (您似乎尚未登入)`;
//       }
//       setErrorMessage(errorMsg);
//     })

//     socket.on('error message', (msg) => {
//       console.error('伺服器發送的錯誤訊息:', msg);
//       setErrorMessage('伺服器錯誤: ' + msg);
//     })

//     socketRef.current = socket

//     return () => {
//       socket.disconnect()
//     }
//   }, [])

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         onClose()
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [onClose])

//   const sendMessage = () => {
//     if (!input.trim()) return
//     if (!socketRef.current) {
//       setErrorMessage('尚未連線，無法傳送訊息')
//       return
//     }
//     socketRef.current.emit('chat message', { text: input })
//     setInput('')
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') sendMessage()
//   }

//   return (
//     <div className="chat-overlay">
//       <div className="chat-window" ref={ref}>
//         <button className="chat-close-btn" onClick={onClose}>
//           ×
//         </button>
//         <div className="chat-header">
//           <h5>寵物交流區</h5>
//         </div>
//         {errorMessage && (
//           <div
//             style={{
//               color: 'red',
//               padding: 10,
//               backgroundColor: '#fee',
//               marginBottom: 10,
//               borderRadius: 4,
//               fontWeight: 'bold',
//             }}
//           >
//             {errorMessage}
//           </div>
//         )}
//         <div
//           className="chat-body"
//           style={{
//             overflowY: 'auto',
//             maxHeight: 300,
//             border: '1px solid #ccc',
//             padding: 10,
//           }}
//         >
//           {messages.length === 0 && <p>你好，讓大家知道你的想法吧</p>}
//           {messages.map((msg, index) => (
//             <p key={msg.id || index}>
//               <strong>{msg.user || '匿名'}：</strong> {msg.text}{' '}
//               <small style={{ color: '#666', fontSize: '0.8em' }}>
//                 {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('zh-TW', {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 }) : ''}
//               </small>
//             </p>
//           ))}
//         </div>
//         <div
//           className="chat-footer"
//           style={{ marginTop: 10, display: 'flex', gap: 8 }}
//         >
//           <input
//             type="text"
//             className="form-control"
//             placeholder="輸入訊息..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             style={{ flexGrow: 1, padding: 8 }}
//           />
//           <button onClick={sendMessage} style={{ padding: '8px 16px' }}>
//             送出
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
