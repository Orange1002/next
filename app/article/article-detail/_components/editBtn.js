'use client' // 確保這是客戶端組件

import React from 'react'
import Link from 'next/link'
import { FaPen } from 'react-icons/fa'
import { useAuth } from '../../../../hooks/use-auth' // 假設 AuthContext 的路徑，請根據您的實際路徑調整
import '../_style/detail.scss' // 確保樣式路徑正確

const EditBtn = ({ id, member_id }) => {
  // 1. 使用 useAuth 鉤子來獲取當前登入會員的資訊
  const { member, loading: authLoading } = useAuth() 

  // 2. 如果 AuthContext 仍在載入中，或未登入，則不顯示按鈕
  if (authLoading || !member || !member.id) {
    return null
  }

  // 3. 獲取當前登入會員的 ID
  const currentMemberId = member.id

  // 4. 只有文章作者能看見編輯按鈕
  if (member_id !== currentMemberId) {
    return null
  }

  return (
    <Link href={`/article/update/${id}`} className="fab">
      <FaPen size={20} />
    </Link>
  )
}

export default EditBtn

// import React from 'react'
// import Link from 'next/link'
// import { FaPen } from 'react-icons/fa'
// import '../_style/detail.scss'

// const EditBtn = ({ id, member_id, currentMemberId }) => {
//   // 只有文章作者能看見編輯按鈕
//   if (member_id !== currentMemberId) return null

//   return (
//     <Link href={`/article/update/${id}`} className="fab">
//       <FaPen size={20} />
//     </Link>
//   )
// }

// export default EditBtn
