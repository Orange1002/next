// ReviewsContainer.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import './style.css'

export default function ReviewsContainer() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch('http://localhost:3005/api/sitter/reviews') // 改為抓全部評論
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched reviews:', data)
        setReviews(data)
      })

      .catch((err) => console.error('Failed to load reviews', err))
  }, [])

  return (
    <div className="m-3 p-5 bg-white rounded-4 shadow">
      <article className="bg-primary22 py-2 px-1">
        <div className="text-warning d-flex justify-content-between align-items-center mb-5 fw-medium fs-4">
          Reviews on Bark&Bijou
        </div>

        {reviews.length > 0 ? (
          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            className="mySwiper"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="p-3 d-flex flex-column align-items-center text-center gap-3 mt-3">
                  <small className="text-muted mb-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </small>
                  <div className="text-warning mb-2">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="small text-secondary text-white mb-3">
                    {review.comment}
                  </p>
                  <Image
                    src={
                      review.image_url?.startsWith('http')
                        ? review.image_url
                        : review.image_url
                          ? `http://localhost:3005/${review.image_url}`
                          : '/default-avatar.png'
                    }
                    alt={`${review.username} avatar`}
                    width={60}
                    height={60}
                    className="rounded-circle "
                  />
                  <h6 className="mb-1">{review.username}</h6>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-muted py-4">目前尚無評論</div>
        )}
      </article>
    </div>
  )
}
