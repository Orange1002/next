'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import ProductList from '../product/_components/ProductList/ProductList2'
import Link from 'next/link'

export default function MyProductCard() {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

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
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    scrollContainer.addEventListener('scroll', handleScroll)
    handleScroll() // 初始化

    const observer = new ResizeObserver(() => {
      handleScroll() // 內容變化時重新計算
    })
    observer.observe(scrollContainer)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <section>
      <div className="container">
        <div className="product-wrapper my-96">
          <div className="product-title d-flex align-items-center">
            最新商品
          </div>
          <div className="product-body d-flex justify-content-center align-items-center">
            {/* 左箭頭 */}
            <div
              role="button"
              tabIndex={0}
              className={`product-arrow d-flex justify-content-center align-items-center ${
                showLeftArrow ? '' : 'invisible opacity-0'
              }`}
              onClick={() => scrollBy(-274)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') scrollBy(-274)
              }}
            >
              <FaChevronCircleLeft />
            </div>

            {/* 商品列表 */}
            {/* <ProductList ref={scrollContainerRef} /> */}

            <div
              style={{ width: '1095px', overflowX: 'auto' }}
              className="scroll-container"
              ref={scrollContainerRef}
            >
              <ProductList />
            </div>

            {/* 右箭頭 */}
            <div
              role="button"
              tabIndex={0}
              className={`product-arrow d-flex justify-content-center align-items-center ${
                showRightArrow ? '' : 'invisible opacity-0'
              }`}
              onClick={() => scrollBy(274)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') scrollBy(274)
              }}
            >
              <FaChevronCircleRight />
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <Link
              href="/product"
              className="btn product-btn d-flex justify-content-center mt-5 text-decoration-none"
            >
              查看更多
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
