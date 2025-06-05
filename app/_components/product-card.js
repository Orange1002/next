'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChevronCircleLeft } from 'react-icons/fa'
import { FaChevronCircleRight } from 'react-icons/fa'
import { IoMdHeart } from 'react-icons/io'
import { IoIosHeartEmpty } from 'react-icons/io'
import { IoCart } from 'react-icons/io5'
import ProductList from '../product/_components/ProductList/ProductList2'

const productData = [
  {
    id: 1,
    image: './images/product-1.png',
    name: '好食·金屬寵器台｜冷冽黑 & 云白 M',
    price: 'NT$3,500',
  },
  {
    id: 2,
    image: './images/product-2.png',
    name: '好食·金屬寵器台｜霧感灰 & 柔白 S',
    price: 'NT$3,200',
  },
  {
    id: 3,
    image: './images/product-3.png',
    name: '陶瓷寵食碗｜岩黑雙碗',
    price: 'NT$2,800',
  },
  {
    id: 4,
    image: './images/product-4.png',
    name: '寵物食物儲存罐｜極簡灰',
    price: 'NT$1,680',
  },
  {
    id: 5,
    image: './images/product-4.png',
    name: '寵物食物儲存罐｜奶油白',
    price: 'NT$1,680',
  },
  {
    id: 6,
    image: './images/product-3.png',
    name: '陶瓷寵食碗｜米色單碗',
    price: 'NT$1,500',
  },
]

export default function MyProductCard() {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current
    const scrollLeft = scrollContainer.scrollLeft
    const maxScrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth

    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < maxScrollLeft - 1)
  }

  const scrollBy = (amount) => {
    scrollContainerRef.current.scrollBy({
      left: amount,
      behavior: 'smooth',
    })
  }

  // useEffect(() => {
  //   if (window.innerWidth > 575.98) {
  //     const scrollContainer = scrollContainerRef.current
  //     if (scrollContainer) {
  //       scrollContainer.addEventListener('scroll', handleScroll)
  //       handleScroll() // 初始狀態
  //       return () => scrollContainer.removeEventListener('scroll', handleScroll)
  //     }
  //   }
  // }, [])

  return (
    <>
      <section>
        <div className="container">
          <div className="product-wrapper my-96">
            <div className="product-title d-flex align-items-center">
              最新商品
            </div>
            <div className="product-body d-flex justify-content-center align-items-center">
              <div
                role="button"
                tabIndex={0}
                className={`product-arrow d-flex justify-content-center align-items-center ${
                  !showLeftArrow ? '' : 'invisible opacity-0'
                }`}
                onClick={() => scrollBy(-274)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') scrollBy(-274)
                }}
              >
                <FaChevronCircleLeft />
              </div>

              {/* 商品卡片群組 */}
              {/* <div
                className="product-card-group row d-lg-flex align-items-center flex-lg-nowrap"
                ref={scrollContainerRef}
              >
                {productData.map((product, idx) => (
                  <div className="product-card" key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      className="d-block product-card-img position-relative"
                    >
                      <Image
                        src={product.image}
                        alt={`product-${idx}`}
                        fill
                        className="w-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                    <div className="product-card-content bg-gray">
                      <Link
                        href={`/product/${product.id}`}
                        className="text-decoration-none"
                      >
                        <div className="product-card-name">{product.name}</div>
                        <div className="product-card-price">
                          {product.price}
                        </div>
                      </Link>
                      <div className="product-card-icon">
                        <IoIosHeartEmpty />
                        <IoCart />
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}
              <ProductList ref={scrollContainerRef} />

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
              <div className="btn product-btn">查看更多</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
