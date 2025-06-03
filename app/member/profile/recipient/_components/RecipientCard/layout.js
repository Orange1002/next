'use client'

import styles from './layout.module.css'
import { useRouter } from 'next/navigation'
import { FaXmark } from 'react-icons/fa6'
import Swal from 'sweetalert2'

export default function RecipientCard({ recipient, onDeleteSuccess }) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/member/profile/recipient/edit/${recipient.id}`)
  }

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: `確定要刪除收件人 ${recipient.realname} 嗎？`,
      text: '此操作無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    })

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:3005/api/member/recipients/${recipient.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        )
        const result = await res.json()

        if (result.success) {
          Swal.fire({
            icon: 'success',
            title: '刪除成功',
            showConfirmButton: false,
            timer: 1500,
            background: '#e9f7ef',
            color: '#2e7d32',
          })
          onDeleteSuccess?.()
        } else {
          Swal.fire({
            icon: 'error',
            title: '刪除失敗',
            text: result.message || '請稍後再試',
            confirmButtonColor: '#d33',
            background: '#fdecea',
            color: '#b71c1c',
          })
        }
      } catch (err) {
        console.error(err)
        Swal.fire({
          icon: 'error',
          title: '發生錯誤',
          text: '請檢查網路或稍後再試',
          confirmButtonColor: '#d33',
          background: '#fdecea',
          color: '#b71c1c',
        })
      }
    }
  }

  return (
    <div className={`${styles.block} col py-2 ps-3 pe-2 px-lg-3 mb-3`}>
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
