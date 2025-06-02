'use client'

import styles from './layout.module.css'
import { useRouter } from 'next/navigation'
import { FaXmark } from 'react-icons/fa6'

export default function RecipientCard({ recipient, onDeleteSuccess }) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/member/profile/recipient/edit/${recipient.id}`)
  }

  const handleDelete = async () => {
    if (confirm(`確定要刪除 常用收件人 ${recipient.realname} 嗎？`)) {
      try {
        const res = await fetch(
          `http://localhost:3005/api/member/recipients/${recipient.id}`,
          {
            method: 'DELETE',
            credentials: 'include', // 使用 cookie 儲存 JWT
          }
        )
        const result = await res.json()

        if (result.success) {
          alert('刪除成功')
          onDeleteSuccess?.() // ✅ 通知父層更新列表
        } else {
          alert(result.message || '刪除失敗')
        }
      } catch (err) {
        console.error(err)
        alert('刪除發生錯誤')
      }
    }
  }

  return (
    <div className={`${styles.block} col py-2 px-3 mb-3`}>
      <div className="row">
        <div className="col-9 col-lg-11">
          <div className="d-flex flex-column gap-2">
            <h3 className={styles.name}>姓名 : {recipient.realname}</h3>
            <p className={styles.phone}>手機號碼 : {recipient.phone}</p>
            <p className={styles.email}>電子信箱 : {recipient.email}</p>
            <p className={styles.address}>地址 : {recipient.address}</p>
          </div>
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
