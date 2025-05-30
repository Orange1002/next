import React, { useState } from 'react'
import '../_style/detail.scss'
import { FaPaw } from 'react-icons/fa'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fab-container position-fixed bottom-0 end-0 p-4 floating-button">
      {/* 發文按鈕 */}
      {isOpen && (
        <a
          href="/article/post"
          className="btn mb-2 fab-option show d-flex align-items-center"
          id="postBtn"
        >
          <FaPaw className="me-1" />
          <span>編輯文章</span>
        </a>
      )}

      {/* 管理文章按鈕，先不設定href */}
      {isOpen && (
        <a
          href=""
          className="btn mb-2 fab-option show d-flex align-items-center"
          id="editBtn"
          onClick={(e) => e.preventDefault()} // 阻止空href跳頁
        >
          <FaPaw className="me-1" />
          <span>刪除文章</span>
        </a>
      )}

      {/* 主 FAB 按鈕 */}
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
  )
}

export default FloatingActionButton

// import React, { useState } from 'react'
// import '../_style/list.scss'
// import { FaPaw } from 'react-icons/fa'

// const FloatingActionButton = () => {
//   const [isOpen, setIsOpen] = useState(false)

//   const toggleMenu = () => {
//     setIsOpen(!isOpen)
//   }

//   return (
//     <div className="fab-container position-fixed bottom-0 end-0 p-4 floating-button">
//       {/* 發文按鈕 */}
//       {isOpen && (
//         <button
//           className="btn mb-2 fab-option show d-flex align-items-center"
//           id="postBtn"
//         >
//           <FaPaw className="me-1" />
//           <span>我要發文</span>
//         </button>
//       )}

//       {/* 修改文章按鈕 */}
//       {isOpen && (
//         <button
//           className="btn mb-2 fab-option show d-flex align-items-center"
//           id="editBtn"
//         >
//           <FaPaw className="me-1" />
//           <span>管理文章</span>
//         </button>
//       )}

//       {/* 主 FAB 按鈕 */}
//       <button
//         id="fabToggle"
//         className="btn shadow fab-main text-white c-s-btn p-2"
//         style={{ width: '160px', height: '40px' }}
//         onClick={toggleMenu}
//       >
//         <div className="d-flex justify-content-center align-items-center gap-1">
//           <FaPaw className=" me-1" />
//           <p className="">{isOpen ? '關閉' : '編輯文章'}</p>
//         </div>
//       </button>
//     </div>
//   )
// }

// export default FloatingActionButton
