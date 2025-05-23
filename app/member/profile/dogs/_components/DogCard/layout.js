'use client'

import Image from 'next/image'
import styles from './layout.module.css'
import { useRouter } from 'next/navigation'

export default function DogCard({ dog, onDelete }) {
  const router = useRouter()

  return (
    <div className={`${styles.card} card`}>
      <div className="position-relative">
        <Image
          src={dog.image || '/member/dogs_images/default-dog.png'}
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
