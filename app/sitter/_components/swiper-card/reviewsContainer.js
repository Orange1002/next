'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-cards'
import './style.css' // 包含 .mySwiper 及 .swiper-slide 樣式

export default function ReviewsContainer() {
  return (
    <div className=" top-0 end-0 m-3 p-5 bg-white rounded-4 shadow">
      <article className="bg-white  p-3">
        <div className="text-warning d-flex justify-content-between align-items-center mb-4 fw-medium fs-5">
          What people are saying
        </div>

        <Swiper
          effect="cards"
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
        </Swiper>
      </article>
    </div>
  )
}
