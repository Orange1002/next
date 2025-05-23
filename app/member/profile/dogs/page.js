'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DogCard from './_components/DogCard/layout'
import styles from './member-dogs.module.scss'
import SectionTitle from '../../_components/SectionTitle/layout'

const dummyDogs = [
  {
    id: 1,
    name: '阿福',
    description: '活潑又親人，喜歡散步。',
    image: '/member/dogs_images/dog1.jpg',
  },
  {
    id: 2,
    name: '小白',
    description: '安靜的女孩，愛撒嬌。',
    image: '',
  },
]

export default function DogsPage() {
  const [dogs, setDogs] = useState(dummyDogs)
  const router = useRouter()

  const handleDelete = (id) => {
    setDogs((prev) => prev.filter((dog) => dog.id !== id))
  }

  return (
    <>
      <SectionTitle>狗狗資料</SectionTitle>
      <div className="mt-lg-3 h-100">
        <div
          className={`${styles.block} d-flex flex-column justify-content-between g-0 ps-lg-3 pe-lg-3 pt-lg-3 pb-lg-3 p-3 h-100`}
        >
          <div className="d-flex flex-row row g-0 mb-lg-3">
            {dogs.slice(0, 6).map((dog) => (
              <div className="col-12 col-md-6 col-lg-4 p-2" key={dog.id}>
                <DogCard dog={dog} onDelete={handleDelete} />
              </div>
            ))}
          </div>

          {dogs.length < 6 ? (
            <div className="d-flex justify-content-center mt-2 mt-lg-0">
              <button
                className={styles.btnCustom}
                onClick={() => router.push('/member/profile/dogs/add')}
              >
                新增狗狗
              </button>
            </div>
          ) : (
            <p className="text-center text-danger">最多只能新增 6 隻狗狗</p>
          )}
        </div>
      </div>
    </>
  )
}
