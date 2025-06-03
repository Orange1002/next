import React from 'react'
import Link from 'next/link'
import { FaPen } from 'react-icons/fa'
import '../_style/detail.scss'

const EditBtn = ({ id, member_id, currentMemberId }) => {
  // 只有文章作者能看見編輯按鈕
  if (member_id !== currentMemberId) return null

  return (
    <Link href={`/article/update/${id}`} className="fab">
      <FaPen size={20} />
    </Link>
  )
}

export default EditBtn
