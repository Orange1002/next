'use client'

import { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styles from './ProductImages.module.scss'

const defaultImages = [
  '/product-img/image8.png',
  '/product-img/image9.png',
  '/product-img/image10.png',
  '/product-img/image11.png',
  '/product-img/image12.png',
  '/product-img/image13.png',
]

export default function ProductImages({ images = defaultImages }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageRef = useRef(null)
  const touchStartX = useRef(0)
  const isDragging = useRef(false)

  const showImage = (index) => {
    const newIndex = (index + images.length) % images.length
    const img = imageRef.current

    if (img) {
      img.classList.add(styles.fadeOut)

      setTimeout(() => {
        setCurrentIndex(newIndex)
        img.classList.remove(styles.fadeOut)
      }, 150)
    } else {
      setCurrentIndex(newIndex)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth > 440) return
    const img = imageRef.current
    if (!img) return

    const onTouchStart = (e) => {
      isDragging.current = true
      touchStartX.current = e.touches[0].clientX
    }

    const onTouchEnd = (e) => {
      if (!isDragging.current) return
      const endX = e.changedTouches[0].clientX
      const diff = endX - touchStartX.current

      if (Math.abs(diff) > 50) {
        if (diff < 0) showImage(currentIndex + 1)
        else showImage(currentIndex - 1)
      }

      isDragging.current = false
    }

    img.addEventListener('touchstart', onTouchStart)
    img.addEventListener('touchend', onTouchEnd)

    return () => {
      img.removeEventListener('touchstart', onTouchStart)
      img.removeEventListener('touchend', onTouchEnd)
    }
  }, [currentIndex, images])

  return (
    <div className={styles.imagesContainer}>
      <div className={styles.mainImgWrapper}>
        <img
          className={styles.mainImg}
          src={images[currentIndex]}
          ref={imageRef}
          alt="主圖片"
        />
      </div>

      <div className={styles.sliderDots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === currentIndex ? styles.active : ''}`}
            onClick={() => showImage(i)}
          ></span>
        ))}
      </div>

      <div className={styles.thumbnailContainer}>
        <FaChevronLeft
          className={`fa-solid fa-chevron-left ${styles.imgArrow}`}
          onClick={() => showImage(currentIndex - 1)}
          style={{ cursor: 'pointer' }}
        />

        {images.slice(1).map((src, i) => {
          const actualIndex = i + 1
          return (
            <img
              key={i}
              src={src}
              className={`${styles.thumbnailImg} ${actualIndex === currentIndex ? styles.active : ''}`}
              alt={`縮圖${i + 1}`}
              onClick={() => showImage(actualIndex)}
            />
          )
        })}

        <FaChevronRight
          className={`fa-solid fa-chevron-right ${styles.imgArrow}`}
          onClick={() => showImage(currentIndex + 1)}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}
