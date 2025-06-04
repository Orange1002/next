'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import StarRating from '../../_components/star-rating/star-rating'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import Swal from 'sweetalert2'
import '../../_styles/sitter-detail.module.css'

export default function SitterDetailPage() {
  const [sitter, setSitter] = useState()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviewStatus, setReviewStatus] = useState('ok') // ok | unauthorized | already
  const [isClient, setIsClient] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    if (!id) return
    setIsClient(true)

    const fetchData = async () => {
      const res = await fetch(`http://localhost:3005/api/sitter/${id}`, {
        credentials: 'include',
      })
      const data = await res.json()
      setSitter(data)
      setReviewStatus(data?.reviewStatus ?? 'unauthorized')
    }

    fetchData()
  }, [id])

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      Swal.fire('請注意', '請填寫評分與留言', 'warning')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:3005/api/sitter/${id}/reviews`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ rating, comment }),
        }
      )

      const result = await res.json()

      if (res.ok) {
        Swal.fire('成功!', '評論提交成功', 'success')
        setRating(0)
        setComment('')
        const refreshed = await fetch(
          `http://localhost:3005/api/sitter/${id}`,
          {
            credentials: 'include',
          }
        )
        const data = await refreshed.json()
        setSitter(data)
        setReviewStatus(data?.reviewStatus ?? 'unauthorized')
      } else if (res.status === 403) {
        Swal.fire('無法提交', '您尚未預約過這位保母，無法提交評論', 'info')
      } else if (res.status === 409) {
        Swal.fire('無法提交', '您已經評論過這位保母，無法再次提交', 'info')
      } else if (res.status === 400) {
        Swal.fire('請注意', '請填寫正確的評分與留言', 'warning')
      } else {
        Swal.fire('錯誤', result.message || '提交失敗，請稍後再試', 'error')
      }
    } catch (err) {
      console.error('submit error:', err)
      Swal.fire('錯誤', '發生未知錯誤，請稍後再試', 'error')
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
        <div className="row g-5 align-items-center justify-content-center">
          <figure className="col-12 col-lg-6 p-5">
            <Image
              src={
                sitter?.avatar_url
                  ? `http://localhost:3005/${sitter.avatar_url}`
                  : '/images/default-avatar.png'
              }
              alt="Pet Sitter Profile"
              className="img-fluid rounded-5 justify-content-center"
              width={100}
              height={100}
              style={{ width: 'auto' }}
            />
          </figure>

          <section className="col-12 col-lg-6 profile-height border-bottom border-2">
            <h1 className="fs-2">{sitter?.name}</h1>
            <h2 className="mt-4 fs-5 text-secondary fw-medium">
              服務地區 : {sitter?.area}
            </h2>

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

            <section className="mt-4">
              <h2 className="fs-5 mb-2">自我介紹</h2>
              <p className="text-secondary">{sitter?.introduction}</p>
              <h2 className="fs-5 mt-4 mb-2">經歷</h2>
              <p className="text-secondary">{sitter?.experience}</p>
              <h2 className="fs-5 mt-4 mb-2 ccc-primary">價格(每日)</h2>
              <p className="fs-5 ">${sitter?.price?.toLocaleString()}</p>
            </section>

            <div className="row mt-4">
              <section className="col-12 col-md-6">
                <h3 className="bgc-primary text-white p-2 rounded service-badge">
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

      {/* 留下評論區塊 */}
      <section
        className="container my-3 p-5 border rounded bg-white"
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
        <button className="btn bgc-primary text-white" onClick={handleSubmit}>
          提交評價
        </button>
      </section>

      {/* 評論區 */}
      <section className="container p-5" style={{ maxWidth: '1080px' }}>
        <h2 className="reviews-title mb-5 fs-5">
          用戶評論 [{sitter?.reviews?.length || 0}]
        </h2>
        {isClient && sitter?.reviews?.length > 0 ? (
          <div className="row g-4">
            {sitter.reviews.map((review, i) => (
              <div
                key={i}
                className="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
              >
                <div
                  className="card border shadow-sm p-3 bg-white w-100"
                  style={{ maxWidth: '300px', minHeight: '180px' }}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted text-center py-4">目前尚無評論</div>
        )}
      </section>
    </main>
  )
}
