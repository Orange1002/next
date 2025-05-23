'use client'

import styles from './layout.module.css'
import { useRouter } from 'next/navigation'
import { FaXmark } from 'react-icons/fa6'

export default function RecipientCard({ recipient }) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/member/profile/recipient/edit/${recipient.id}`)
  }

  const handleDelete = () => {
    if (confirm(`確定要刪除 ${recipient.name} 嗎？`)) {
      console.log(`刪除 ID: ${recipient.id}`)
      // 你可以在這裡加入實際刪除邏輯（例如 API 呼叫）
    }
  }

  return (
    <div className={`${styles.block} col py-2 px-3 mb-3`}>
      <div className="row">
        <div className="col-9 col-lg-11">
          <h3 className={`${styles.name} mb-2`}>姓名 : {recipient.name}</h3>
          <p className={`${styles.phone} mb-2`}>手機號碼 : {recipient.phone}</p>
          <p className={`${styles.address} mb-2`}>地址 : {recipient.address}</p>
        </div>
        <div className="d-flex flex-column justify-content-between col-3 col-lg-1">
          <button
            className={`${styles.deleteButton} text-end`}
            onClick={handleDelete}
          >
            <FaXmark />
          </button>
          <button
            className={`${styles.editButton} text-end`}
            onClick={handleEdit}
          >
            編輯
          </button>
        </div>
      </div>
    </div>
  )
}
