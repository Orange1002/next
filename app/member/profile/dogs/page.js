'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DogCard from './_components/DogCard/layout'
import styles from './member-dogs.module.scss'
import SectionTitle from '../../_components/SectionTitle/layout'

const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'

export default function DogsPage() {
  const [dogs, setDogs] = useState([])
  const router = useRouter()

  // 🐶 取得狗狗資料
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/member/dogs', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('無法取得狗狗資料')
        const data = await res.json()
        // 若 image 為空就給預設圖
        const fixedDogs = data.data.map((dog) => ({
          ...dog,
          image: dog.photos?.[0] || DEFAULT_IMAGE,
        }))
        setDogs(fixedDogs)
      } catch (err) {
        console.error('取得狗狗資料錯誤:', err)
      }
    }

    fetchDogs()
  }, [])

  // 🗑 刪除狗狗（後端請求 + 前端移除）
  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這隻狗狗嗎？')) return

    try {
      const res = await fetch(`http://localhost:3005/api/member/dogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('刪除失敗')
      setDogs((prev) => prev.filter((dog) => dog.id !== id))
    } catch (err) {
      console.error('刪除錯誤:', err)
      alert('刪除失敗，請稍後再試')
    }
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
