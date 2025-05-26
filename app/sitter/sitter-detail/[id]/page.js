'use client'

import React, { useState, useEffect } from 'react'
import '../../_styles/sitter-detail.module.css'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import StarRating from '../../_components/star-rating/star-rating'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

export default function SitterDetailPage() {
  const [sitter, setSitter] = useState()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [canReview, setCanReview] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3005/api/sitter/${id}`)
      const data = await res.json()
      setSitter(data)
      setCanReview(data?.canReview || true)
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return alert('請填寫評分與留言')

    const res = await fetch(`http://localhost:3005/api/sitter/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    })

    const result = await res.json()
    if (res.ok) {
      alert('評論提交成功')
      setRating(0)
      setComment('')
      setCanReview(false)
      const res = await fetch(`http://localhost:3005/api/sitter/${id}`)
      const data = await res.json()
      setSitter(data)
    } else {
      alert(result.message || '提交失敗，請稍後再試')
    }
  }

  return (
    <main className="bg-light position-relative">
      <Link
        href="/sitter/sitter-list"
        className="btn btn-outline-secondary position-absolute top-0 start-0 m-4 z-3"
      >
        ← 返回列表
      </Link>

      {/* 基本資訊區 */}
      <article className="container-sm py-5" style={{ maxWidth: '1080px' }}>
        <div className="row g-5 align-items-center justify-content-center ">
          <figure className="col-12 col-lg-6 p-5">
            <Image
              src={sitter?.avatar_url || '/sitter/default-avatar.png'}
              alt="Pet Sitter Profile"
              className="img-fluid rounded-5 justify-content-center"
              width={100}
              height={100}
              style={{ width: 'auto' }}
            />
          </figure>

          <section className="col-12 col-lg-6 profile-height border-bottom border-2">
            <h1 className="display-6">{sitter?.name}</h1>
            <h2 className="mt-4 fs-5 text-secondary fw-medium">
              服務地區 : {sitter?.area}
            </h2>

            {/* 評分 */}
            <section className="d-flex flex-column gap-2 m-3">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.25rem', color: '#f5b301' }}>
                  ⭐
                </span>
                <span className="fs-4 fw-semibold">
                  {Number(sitter?.average_rating)?.toFixed(1) || '尚無評分'}
                </span>
                <span className="text-secondary small">
                  ({sitter?.review_count || 0} reviews)
                </span>
              </div>
              <p className="text-secondary mb-0 small">
                來自 {sitter?.review_count || 0} 位使用者的評價
              </p>
            </section>

            {/* 自我介紹與經歷 */}
            <section className="mt-4">
              <h2 className="fs-5 mb-2">自我介紹</h2>
              <p className="text-secondary">{sitter?.introduction}</p>
              <h2 className="fs-5 mt-4 mb-2">經歷</h2>
              <p className="text-secondary">{sitter?.experience}</p>
            </section>

            {/* 服務時段與預約 */}
            <div className="row mt-4">
              <section className="col-12 col-md-6">
                <h3 className="bg-warning text-white p-2 rounded service-badge">
                  服務時段
                </h3>
                <p className="fs-5 text-secondary m-3">
                  {sitter?.service_time}
                </p>
              </section>
              <div className="col-12 col-md-6 d-flex align-items-center">
                <Link
                  className="btn btn-outline-dark w-100 fs-2 py-3"
                  href={`/sitter/sitter-booking/${id}`}
                >
                  預約
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>

      {/* 評論區 */}
      <section className="container p-5" style={{ maxWidth: '1080px' }}>
        <h2 className="reviews-title mb-3">
          用戶評論 [{sitter?.reviews?.length || 0}]
        </h2>
        <Swiper
          className="w-100 overflow-visible"
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {sitter?.reviews?.map((review, i) => (
            <SwiperSlide key={i} className="d-flex justify-content-center">
              <div
                className="card border shadow-sm p-3 bg-white"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  minHeight: '180px',
                }}
              >
                <StarRating
                  value={review.rating}
                  readOnly
                  fillColor="#f5b301"
                  emptyColor="#ddd"
                  size={20}
                />
                <div className="text-muted small mt-2">
                  {review.username} ・{' '}
                  {review.created_at &&
                    new Date(review.created_at).toLocaleDateString()}
                </div>
                <p className="text-secondary small mt-4 mb-0">
                  {review.comment}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 留下評論區塊 */}
      {canReview && (
        <section
          className="container my-5 p-5 border rounded bg-white"
          style={{ maxWidth: '1080px' }}
        >
          <h3 className="mb-3">留下您的評價</h3>
          <StarRating
            value={rating}
            onChange={setRating}
            fillColor="#f5b301"
            emptyColor="#ddd"
          />
          <textarea
            className="form-control my-3"
            rows="4"
            placeholder="請輸入您的心得..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>
            提交評價
          </button>
        </section>
      )}
    </main>
  )
}
