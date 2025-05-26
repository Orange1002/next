'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CaregiverCard from './CaregiverCard'
import NavigationArrow from './NavigationArrow'
import styles from './_styles/InputDesign.module.css'

const InputDesign = () => {
  const [caregivers, setCaregivers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef(null)
  const visibleCount = 3
  const cardWidth = 320 + 20 // 卡片寬度 + gap

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/sitter?pageSize=10')
        const data = await res.json()
        const sitters = data.data.map((sitter) => ({
          id: sitter.id,
          name: sitter.name,
          description: sitter.introduction || '暫無介紹',
          imageUrl: sitter.avatar_url || '/images/default-avatar.png',
          rating: sitter.rating,
          isLiked: false,
        }))
        setCaregivers(sitters)
      } catch (err) {
        console.error('❌ 無法取得保母資料', err)
      }
    }

    fetchData()
  }, [])

  const maxIndex = Math.max(caregivers.length - visibleCount, 0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  // ✅ 自動輪播每 4 秒
  useEffect(() => {
    intervalRef.current = setInterval(handleNext, 4000)
    return () => clearInterval(intervalRef.current)
  }, [caregivers])

  const translateX = -currentIndex * cardWidth

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-3">
          <div className="flex-grow-1 border-top border-3 border-dark title-line" />
          <h2 className="text-secondary section-title">寵物保母推薦</h2>
          <div className="rounded-circle bg-dark dot-circle" />
        </div>
      </div>

      <section className={styles.container}>
        <NavigationArrow direction="prev" onClick={handlePrev} />
        <div
          className={styles.cardContainer}
          style={{
            transform: `translateX(${translateX}px)`,
            width: `${caregivers.length * cardWidth}px`,
          }}
        >
          {caregivers.map((caregiver) => (
            <CaregiverCard key={caregiver.id} {...caregiver} />
          ))}
        </div>
        <NavigationArrow direction="next" onClick={handleNext} />
      </section>

      <div className="text-center mt-5">
        <Link
          href="/sitter/sitter-list"
          className="btn btn-lg btn-warning text-white fw-bold px-5 py-3"
          style={{ letterSpacing: 5 }}
        >
          查看更多
        </Link>
      </div>
    </div>
  )
}

export default InputDesign
