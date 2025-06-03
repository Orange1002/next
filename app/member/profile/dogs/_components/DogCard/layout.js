'use client'

import Image from 'next/image'
import styles from './layout.module.css'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

export default function DogCard({ dog, onDelete }) {
  const router = useRouter()

  const sizeLabels = {
    1: '迷你型（4公斤以下）',
    2: '小型（5~10公斤）',
    3: '中型（11~25公斤）',
    4: '大型（26~44公斤）',
    5: '超大型（45公斤以上）',
  }

  const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'
  let imagePath = []

  try {
    const parsed = JSON.parse(dog.dogs_images || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) {
      imagePath = parsed.map((img) =>
        img.startsWith('http')
          ? img
          : `http://localhost:3005${img.startsWith('/') ? '' : '/'}${img}`
      )
    }
  } catch (err) {
    // 解析失敗時保持空陣列
  }

  const handleDeleteConfirm = () => {
    Swal.fire({
      title: `確定要刪除 ${dog.name} 嗎？`,
      text: '此操作無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(dog.id)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '刪除成功',
              showConfirmButton: false,
              timer: 1500,
              background: '#e9f7ef',
              color: '#2e7d32',
            })
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: '刪除失敗',
              text: error?.message || '請稍後再試',
              confirmButtonColor: '#d33',
              background: '#fdecea',
              color: '#b71c1c',
            })
          })
      }
    })
  }

  return (
    <div className={`${styles.card}`}>
      <div className={`${styles.img} d-flex flex-column w-100`}>
        {/* 主圖 */}
        <div className={`w-100 h-100`}>
          <Image
            src={imagePath.length > 0 ? imagePath[0] : DEFAULT_IMAGE}
            alt={dog.name}
            width={200}
            height={200}
            className="w-100 h-100 object-fit-cover"
            priority
          />
        </div>

        {/* 副圖 */}
        <div>
          {imagePath.length > 1 && (
            <div className="d-flex">
              {imagePath.slice(1, 5).map((src, idx) => (
                <div key={idx} style={{ width: '80px', height: '80px' }}>
                  <Image
                    src={src}
                    alt={`${dog.name} 小圖 ${idx + 1}`}
                    width={80}
                    height={80}
                    className="w-100 h-100 object-fit-cover"
                    priority
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card-body p-3">
        <h5 className="card-title">{dog.name || '（未命名）'}</h5>
        <p className="card-text mb-1">
          <strong>年齡：</strong> {dog.age || '未填寫'}
        </p>
        <p className="card-text mb-1">
          <strong>品種：</strong> {dog.breed || '未填寫'}
        </p>
        <p className="card-text mb-1">
          <strong>體型：</strong> {sizeLabels[dog.size_id] || '未填寫'}
        </p>
        <p className="card-text">
          <strong>備註：</strong> {dog.description || '未填寫'}
        </p>

        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push(`/member/profile/dogs/edit/${dog.id}`)}
          >
            編輯
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleDeleteConfirm}
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  )
}
