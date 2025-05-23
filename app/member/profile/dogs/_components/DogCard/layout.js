'use client'

import Image from 'next/image'
import styles from './layout.module.css'
import { useRouter } from 'next/navigation'

export default function DogCard({ dog, onDelete }) {
  const router = useRouter()

  // 解析 JSON 字串的 dogs_images
  let imagePath = '/member/dogs_images/default-dog.png'
  try {
    const images = JSON.parse(dog.dogs_images || '[]')
    if (Array.isArray(images) && images.length > 0) {
      imagePath = `http://localhost:3005${images[0]}`
    }
  } catch (err) {
    // 若 JSON.parse 出錯，維持使用預設圖片
  }

  return (
    <div className={`${styles.card} card`}>
      <div className={`${styles.img} position-relative`}>
        <Image
          src={imagePath}
          alt={dog.name}
          width={100}
          height={100}
          priority
          className="h-100 w-100 card-img-top object-fit-cover"
        />
      </div>

      <div className="card-body">
        <h5 className="card-title">{dog.name || '（未命名）'}</h5>
        <p className="card-text mb-1">
          <strong>年齡：</strong> {dog.age || '未填寫'}
        </p>
        <p className="card-text mb-1">
          <strong>品種：</strong> {dog.breed || '未填寫'}
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
            onClick={() => onDelete(dog.id)}
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  )
}
