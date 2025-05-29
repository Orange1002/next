'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { IoMdHeart, IoIosHeartEmpty } from 'react-icons/io'

export default function MySitterCard() {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [sitters, setSitters] = useState([])

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const scrollLeft = scrollContainer.scrollLeft
    const maxScrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth

    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < maxScrollLeft - 1)
  }

  const scrollBy = (amount) => {
    scrollContainerRef.current?.scrollBy({
      left: amount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const fetchSitters = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/sitter')
        const json = await res.json()
        const data = Array.isArray(json) ? json : json.data
        setSitters(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('取得保母資料失敗', err)
        setSitters([])
      }
    }

    fetchSitters()

    if (typeof window !== 'undefined') {
      const scrollContainer = scrollContainerRef.current
      scrollContainer?.addEventListener('scroll', handleScroll)
      return () => scrollContainer?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 等 sitters 載入後，等 DOM 更新再執行 scroll 判斷
  useEffect(() => {
    const timer = setTimeout(() => {
      handleScroll()
    }, 50)
    return () => clearTimeout(timer)
  }, [sitters])

  return (
    <section>
      <div className="container">
        <div className="product-wrapper my-96">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-3">
              <div className="flex-grow-1 border-top border-3 border-dark title-line" />
              <h2 className="text-secondary section-title">精選寵物保母</h2>
              <div className="rounded-circle bg-dark dot-circle" />
            </div>
          </div>

          <div className="product-body d-flex justify-content-center align-items-center">
            {/* 左箭頭 */}
            <div
              role="button"
              tabIndex={0}
              className={`product-arrow d-flex justify-content-center align-items-center ${
                !showLeftArrow ? 'invisible opacity-0' : ''
              }`}
              onClick={() => scrollBy(-274)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') scrollBy(-274)
              }}
            >
              <FaChevronCircleLeft />
            </div>

            {/* 保母卡片群組（⚠ 拿掉 row，保證橫向） */}
            <div
              className="product-card-group d-lg-flex align-items-center flex-lg-nowrap overflow-auto"
              ref={scrollContainerRef}
              style={{ scrollBehavior: 'smooth' }}
            >
              {sitters.map((sitter) => (
                <div className="product-card" key={sitter.id}>
                  <Link
                    href={`/sitter/sitter-detail/${sitter.id}`}
                    className="d-block product-card-img position-relative"
                  >
                    <Image
                      src={sitter.avatar_url || '/no-image.png'}
                      alt={sitter.name}
                      fill
                      className="w-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="product-card-content bg-gray">
                    <Link
                      href={`/sitter/${sitter.id}`}
                      className="text-decoration-none"
                    >
                      <div className="product-card-name">{sitter.name}</div>
                      <div className="product-card-price text-secondary small">
                        ⭐ {parseFloat(sitter.rating).toFixed(1)}
                      </div>
                      <p className="text-secondary small mt-2">
                        {sitter.introduction}
                      </p>
                    </Link>
                    <div className="product-card-icon mt-2">
                      {sitter.isLiked ? (
                        <IoMdHeart color="red" />
                      ) : (
                        <IoIosHeartEmpty />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 右箭頭 */}
            <div
              role="button"
              tabIndex={0}
              className={`product-arrow d-flex justify-content-center align-items-center ${
                !showRightArrow ? 'invisible opacity-0' : ''
              }`}
              onClick={() => scrollBy(274)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') scrollBy(274)
              }}
            >
              <FaChevronCircleRight />
            </div>
          </div>

          {/* 查看更多 */}
          <div className="d-flex justify-content-center mt-5">
            <Link className="btn product-btn" href={`/sitter/sitter-list`}>
              查看更多
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
