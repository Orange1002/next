'use client'

import React, { useState, useEffect } from 'react'
import '../_styles/sitter-detail.module.css'
import Image from 'next/image'

export default function SitterDetailPage(props) {
  return (
    <>
      <div>SitterDetail Page</div>
      <main className="bg-light">
        <article className="container py-5">
          <div className="row g-4 align-items-center justify-content-center">
            <figure className="col-12 col-lg-6">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1c0f8d7f70901a8cb8a01e2603c36ecae11a0a77?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                alt="Pet Sitter Profile"
                className="img-fluid w-100"
                width={100}
                height={100}
              />
            </figure>
            <section className="col-12 col-lg-6 profile-height border-bottom border-2">
              <h1 className="display-5">保母姓名</h1>
              <h2 className="mt-4 fs-3 text-secondary fw-medium">服務地區 :</h2>
              <div className="d-flex flex-wrap gap-3 align-items-start mt-4">
                <div className="d-flex gap-2 align-items-center">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a7a3c083d22b38cb010dd049b3e3586f76b85ff?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Half Star Rating"
                    className="half-star-width"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="vr mx-2" />
                <p className="text-secondary small" style={{ width: 167 }}>
                  5 Customer Review
                </p>
              </div>
              <section className="mt-4">
                <p className="fs-4">
                  經歷: 1. Setting the bar as one of the loudest speakers in its
                  class, the Kilburn is a c<br />
                  2. act, stout-hearted hero with a well-balanced audio which
                  boasts a clear
                  <br />
                  3. midrange and extended highs for a sound.
                  <br />
                  <br />
                </p>
              </section>
              <div className="row mt-4">
                <section className="col-12 col-md-6">
                  <h3 className="bg-warning text-white p-2 rounded service-badge">
                    服務時段
                  </h3>
                  <p className="fs-5 text-secondary mt-3">
                    週一 全時段
                    <br />
                    週二 全時段
                    <br />
                    週三 全時段
                    <br />
                    週四 全時段
                    <br />
                    週五 全時段
                    <br />
                    週日 09:00~12:00
                    <br />
                    可配合飼主彈性討論時間
                  </p>
                </section>
                <div className="col-12 col-md-6 d-flex align-items-center">
                  <button className="btn btn-outline-dark w-100 fs-2 py-3">
                    預約
                  </button>
                </div>
              </div>
            </section>
          </div>
        </article>
        <div className="container">
          <div className="row  ">
            <div className="col-12 col-md-6 p-3">
              <h2 className="intro-section">自我介紹</h2>
              <p className="intro-content mt-4">
                保母姓名保母姓名保母姓名保母姓名保母姓名保母姓名保母姓名保母姓名保母姓名保母姓名保母姓名我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音
              </p>
            </div>
            <div className="col-12 col-md-6 p-3">
              <h2 className="reviews-title">Reviews [5]</h2>
              <div className="reviews-content mt-4">
                我清楚我當即清楚這是小誠的聲音
                我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音
                我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音我清楚我當即清楚這是小誠的聲音
              </div>
            </div>
          </div>
        </div>
        <section className="container pb-5">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fc3ac39f4c7e4307ae1f48d48e2f83332890a4a?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                alt="Pet Sitter Gallery Image 1"
                className="img-fluid w-100 gallery-img"
                width={100}
                height={100}
              />
            </div>
            <div className="col-12 col-md-6">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fc3ac39f4c7e4307ae1f48d48e2f83332890a4a?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                alt="Pet Sitter Gallery Image 2"
                className="img-fluid w-100 gallery-img"
                width={100}
                height={100}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
