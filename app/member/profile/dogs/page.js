'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DogCard from './_components/DogCard/layout'
import styles from './member-dogs.module.scss'
import SectionTitle from '../../_components/SectionTitle/layout'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import MobileMemberMenu from '../../_components/mobileLinks/layout'

const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'

export default function DogsPage() {
  const [dogs, setDogs] = useState([])
  const router = useRouter()

  // 取得狗狗資料
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/member/dogs', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('無法取得狗狗資料')
        const data = await res.json()
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

  // 刪除狗狗
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3005/api/member/dogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const result = await res.json()
      if (res.ok && result.status === 'success') {
        setDogs((prev) => prev.filter((dog) => dog.id !== id))
        return Promise.resolve()
      } else {
        return Promise.reject(new Error(result.message || '未知錯誤'))
      }
    } catch (err) {
      console.error('刪除錯誤:', err)
      return Promise.reject(err)
    }
  }

  // 滾動相關
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setShowLeft(scrollLeft > 0)
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1)
  }

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -480, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 480, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handle = () => checkScrollButtons()

    const timeout = setTimeout(handle, 200)

    el.addEventListener('scroll', handle)
    window.addEventListener('resize', handle)

    return () => {
      clearTimeout(timeout)
      el.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  return (
    <>
      <SectionTitle>狗狗資料</SectionTitle>
      <div className="mt-3 h-100">
        <div
          className={`${styles.block} d-flex flex-column justify-content-center g-0 p-0 p-lg-5 h-100`}
        >
          {showLeft && (
            <button
              className={`${styles['scroll-btn']} ${styles['scroll-btn-left']}`}
              onClick={scrollLeft}
              aria-label="向左滾動"
              type="button"
            >
              <FaChevronCircleLeft />
            </button>
          )}

          {showRight && (
            <button
              className={`${styles['scroll-btn']} ${styles['scroll-btn-right']}`}
              onClick={scrollRight}
              aria-label="向右滾動"
              type="button"
            >
              <FaChevronCircleRight />
            </button>
          )}

          {/* 卡片列 */}
          <div
            ref={scrollRef}
            className={`
    ${styles.scrollContainer}
    d-flex flex-nowrap
    overflow-auto
    ${showLeft ? styles['has-left-shadow'] : ''}
    ${showRight ? styles['has-right-shadow'] : ''}
  `}
            style={{ gap: '1rem', padding: '0.2rem 0.2rem 0.3rem 0.2rem' }}
          >
            {dogs.length === 0 ? (
              <p className="text-center w-100">尚無狗狗資料</p>
            ) : (
              dogs.slice(0, 6).map((dog) => (
                <div
                  key={dog.id}
                  className="m-0 me-lg-2"
                  style={{
                    marginRight: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <DogCard dog={dog} onDelete={handleDelete} />
                </div>
              ))
            )}
          </div>

          {/* 新增按鈕 */}
          {dogs.length < 6 ? (
            <div className="d-flex justify-content-center mt-2 mt-lg-4 mb-3 mb-lg-0">
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
      <MobileMemberMenu />
    </>
  )
}
