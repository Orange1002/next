'use client'

import React, { useState, useEffect } from 'react'

export default function ComponentsCustomerFeedback(props) {
  return (
    <>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3">
            <div className="flex-grow-1 border-top border-3 border-dark title-line" />
            <h2 className="text-secondary section-title">客戶反饋</h2>
            <div className="rounded-circle bg-dark dot-circle" />
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          {/* 卡片項目 x6 */}
          {/* 以下是卡片模板，可重複使用六次 */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34feda5c9f9d34cec65b31033e14b020d468050d?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="card-img-top"
                alt="客戶圖片"
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                服務好到不行！
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34feda5c9f9d34cec65b31033e14b020d468050d?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="card-img-top"
                alt="客戶圖片"
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                服務好到不行！
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34feda5c9f9d34cec65b31033e14b020d468050d?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="card-img-top"
                alt="客戶圖片"
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                服務好到不行！
              </div>
            </div>
          </div>
          {/* 再複製上面 .col 這段共 5 次，修改文字即可 */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34feda5c9f9d34cec65b31033e14b020d468050d?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="card-img-top"
                alt="客戶圖片"
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                外出必備!! 春日好禮大放送！
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34feda5c9f9d34cec65b31033e14b020d468050d?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="card-img-top"
                alt="客戶圖片"
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                外出必備!! 春日好禮大放送！
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34feda5c9f9d34cec65b31033e14b020d468050d?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3"
                className="card-img-top"
                alt="客戶圖片"
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                外出必備!! 春日好禮大放送！
              </div>
            </div>
          </div>
          {/* 再貼三個類似卡片 */}
        </div>
        <div className="text-center mt-5">
          <a
            href="#"
            className="btn btn-lg btn-warning text-white fw-bold px-5 py-3"
            style={{ letterSpacing: 5 }}
          >
            查看更多
          </a>
        </div>
      </div>
    </>
  )
}
