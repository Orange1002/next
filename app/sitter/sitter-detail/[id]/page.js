'use client'

import React, { useState, useEffect } from 'react'
import '../../_styles/sitter-detail.module.css'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function SitterDetailPage({ params }) {
  const [sitter, setSitter] = useState()
  console.log(params)
  const { id } = useParams()
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3005/api/sitter/${id}`) // 換成實際 ID
      const data = await res.json()
      setSitter(data)
    }

    fetchData()
  }, [])

  return (
    <>
      <main className="bg-light">
        <article className="container py-5">
          <div className="row g-4 align-items-center justify-content-center">
            <figure className="col-12 col-lg-6">
              <Image
                src={sitter?.avatar_url ? sitter?.avatar_url : '無圖片'}
                alt="Pet Sitter Profile"
                className="img-fluid w-100"
                width={100}
                height={100}
              />
            </figure>
            <section className="col-12 col-lg-6 profile-height border-bottom border-2">
              <h1 className="display-5">{sitter?.name}</h1>
              <h2 className="mt-4 fs-3 text-secondary fw-medium">
                服務地區 : {sitter?.area}
              </h2>
              <div className="d-flex flex-wrap gap-3 align-items-start mt-4">
                <div className="d-flex gap-2 align-items-center">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={50}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={50}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={50}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a14128981684f7d22e05e2756ea8369786179170?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Star Rating"
                    className="star-width"
                    width={50}
                    height={100}
                  />
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a7a3c083d22b38cb010dd049b3e3586f76b85ff?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                    alt="Half Star Rating"
                    className="half-star-width"
                    width={50}
                    height={100}
                  />
                </div>
                <div className="vr mx-2" />
                <p className="text-secondary small" style={{ width: 167 }}>
                  {sitter?.review_count} Customer Review
                </p>
              </div>
              <section className="mt-4">
                <p className="fs-4">經歷: {sitter?.experience}</p>
              </section>
              <div className="row mt-4">
                <section className="col-12 col-md-6">
                  <h3 className="bg-warning text-white p-2 rounded service-badge">
                    服務時段
                  </h3>
                  <p className="fs-5 text-secondary mt-3">
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
        <div className="container">
          <div className="row  ">
            <div className="col-12 col-md-6 p-3">
              <h2 className="intro-section">自我介紹</h2>
              <p className="intro-content mt-4">{sitter?.introduction}</p>
            </div>
            <div className="col-12 col-md-6 p-3">
              <h2 className="reviews-title">
                Reviews [{sitter?.reviews?.length || 0}]
              </h2>
              <div className="reviews-content mt-4">
                {sitter?.reviews?.map((review, i) => (
                  <p key={i}>{review}</p>
                ))}
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
