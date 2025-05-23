'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ComponentsSectionIntro(props) {
  return (
    <>
      <div className="container py-5 text-center">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3">
            <div className="flex-grow-1 border-top border-3 border-dark title-line" />
            <h2 className="text-secondary section-title">專業服務平台</h2>
            <div className="rounded-circle bg-dark dot-circle" />
          </div>
        </div>
        <div
          className="d-flex flex-column mt-5 w-100"
          style={{ maxWidth: 1166 }}
        >
          <div className="row w-100">
            <div className="col-md-6 px-4 text-dark">
              <h2 className="fw-medium text-uppercase fs-1 mb-4">
                簡單預約，快速上手
              </h2>
              <p className="fs-4">
                直覺化介面，幾步即可完成寄宿服務預約。篩選條件、比對服務者資質，輕鬆找到完美選擇。
              </p>
            </div>
            <div className="col-md-6 my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0be0fc5c106606bdc344c9ea4530e3bfd1d5703b?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="img-fluid"
                alt="快速預約"
                style={{ aspectRatio: '2.25' }}
              />
            </div>
          </div>
          <div className="row align-items-center justify-content-between mt-5">
            <div className="col-md-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e43cd992c70d5ff7c3e2262c183db1078607bfa7?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="img-fluid"
                alt="專業服務"
                style={{ aspectRatio: '2.25' }}
              />
            </div>
            <div className="col-md-6 px-4 py-3 text-dark">
              <h2 className="fw-medium text-uppercase fs-1 mb-3">
                專業服務，值得信賴
              </h2>
              <p className="fs-4">
                詳細的服務介紹、價格公開透明，搭配真實飼主評價，讓你放心將毛孩交給專業人士。
              </p>
            </div>
          </div>
          <div className="row align-items-start justify-content-between mt-5">
            <div className="col-md-6 px-5 py-3 text-dark">
              <h2 className="fw-medium text-uppercase fs-1 mb-4">
                貼心設計，隨時關愛
              </h2>
              <p className="fs-4 mt-4">
                無論手機或電腦都能流暢操作，隨時隨地為毛孩安排最佳照顧。
              </p>
            </div>
            <div className="col-md-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/32efbe927d21129bdf93973553d3754da893a1b6?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="img-fluid"
                alt="隨時關愛"
                style={{ aspectRatio: '2.25' }}
              />
            </div>
          </div>
        </div>
        <div className="container d-flex justify-content-center">
          <Link
            className="text-center  text-decoration-none bg-warning text-white fw-bold fs-1 px-5 py-4 mt-5 border border-warning rounded w-100 mx-auto"
            href={`/sitter/sitter-list`}
            style={{ maxWidth: 538, letterSpacing: '0.88rem' }}
          >
            立即預約
          </Link>
        </div>
      </div>
    </>
  )
}
