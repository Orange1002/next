'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import '../_styles/style-sitter-list.scss'

export default function ComponentsSectionIntro(props) {
  return (
    <div
      className="container py-5 text-center"
      style={{ fontFamily: 'Kiwi Maru' }}
    >
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-3">
          <div className="flex-grow-1 border-top border-3 border-dark title-line" />
          <h2 className="text-secondary section-title">專業服務平台</h2>
          <div className="rounded-circle bg-dark dot-circle" />
        </div>
      </div>

      <div className="d-flex flex-column mt-5 w-100" style={{ maxWidth: 1166 }}>
        {/* 區塊 1 */}
        <div className="row w-100">
          <div className="col-md-6 px-4 text-dark">
            <h2 className="fw-medium text-uppercase fs-2 mb-4">
              簡單預約，快速上手
            </h2>
            <p className="fs-5">
              直覺化介面，幾步即可完成寄宿服務預約。篩選條件、比對服務者資質，輕鬆找到完美選擇。
            </p>
          </div>
          <div className="col-md-6 my-auto">
            <Image
              src="/images/bigImg-1.png"
              alt="快速預約"
              width={640}
              height={285}
              className="img-fluid"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </div>
        </div>

        {/* 區塊 2 */}
        <div className="row align-items-center justify-content-between mt-5">
          <div className="col-md-6">
            <Image
              src="/images/pet_walking.jpg"
              alt="專業服務"
              width={640}
              height={285}
              className="img-fluid"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </div>
          <div className="col-md-6 px-4 py-3 text-dark">
            <h2 className="fw-medium text-uppercase fs-2 mb-3">
              專業服務，值得信賴
            </h2>
            <p className="fs-5">
              詳細的服務介紹、價格公開透明，搭配真實飼主評價，讓你放心將毛孩交給專業人士。
            </p>
          </div>
        </div>

        {/* 區塊 3 */}
        <div className="row align-items-start justify-content-between mt-5">
          <div className="col-md-6 px-5 py-3 text-dark">
            <h2 className="fw-medium text-uppercase fs-2 mb-4">
              貼心設計，隨時關愛
            </h2>
            <p className="fs-5 mt-4">
              無論手機或電腦都能流暢操作，隨時隨地為毛孩安排最佳照顧。
            </p>
          </div>
          <div className="col-md-6">
            <Image
              src="/images/AIRBUGGY1 2.png"
              alt="隨時關愛"
              width={640}
              height={285}
              className="img-fluid"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </div>
        </div>
      </div>

      <div className="container d-flex justify-content-center">
        <Link
          className="text-center bgc-primary text-decoration-none text-white fw-bold fs-3 px-5 py-4 mt-5 border rounded w-100 mx-auto"
          href="/sitter/sitter-list"
          style={{ maxWidth: 538, letterSpacing: '0.88rem' }}
        >
          立即預約
        </Link>
      </div>
    </div>
  )
}
