'use client'

import React, { useState, useEffect } from 'react'
import {} from 'react-bootstrap'

export default function SitterList(props) {
  return (
    <>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3">
            <div className="flex-grow-1 border-top border-3 border-dark title-line" />
            <h2 className="text-secondary section-title">選擇寵物保母</h2>
            <div className="rounded-circle bg-dark dot-circle" />
          </div>
        </div>
        <div className="d-flex justify-content-end align-items-center gap-3 mb-4 px-3">
          <span className="text-muted filter-text">1-18/19 頁 |</span>
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-custom"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              評分最高
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  評分最高
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  價格最低
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  距離最近
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
          {/* 卡片樣板（可重複） */}
          <div className="col">
            <div className="card h-100 shadow">
              <img
                src="https://placehold.co/400x351"
                className="card-img-top"
                alt="保母圖片"
              />
              <div className="card-body card-body-bg">
                <h5 className="card-title card-title-custom">保母姓名</h5>
                <p className="card-text text-danger card-text-custom">
                  介紹下面用評分
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <a href="#" className="text-danger detail-link">
                    詳細介紹
                  </a>
                  <div className="rounded-circle rating-circle" />
                </div>
              </div>
            </div>
          </div>
          {/* 複製卡片 */}
          <div className="col">
            <div className="card h-100 shadow">
              <img
                src="https://placehold.co/400x351"
                className="card-img-top"
                alt="保母圖片"
              />
              <div className="card-body card-body-bg">
                <h5 className="card-title card-title-custom">保母姓名</h5>
                <p className="card-text text-danger card-text-custom">
                  介紹下面用評分
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <a href="#" className="text-danger detail-link">
                    詳細介紹
                  </a>
                  <div className="rounded-circle rating-circle" />
                </div>
              </div>
            </div>
          </div>
          {/* 再複製兩張卡片 */}
          <div className="col">
            <div className="card h-100 shadow">
              <img
                src="https://placehold.co/400x351"
                className="card-img-top"
                alt="保母圖片"
              />
              <div className="card-body card-body-bg">
                <h5 className="card-title card-title-custom">保母姓名</h5>
                <p className="card-text text-danger card-text-custom">
                  介紹下面用評分
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <a href="#" className="text-danger detail-link">
                    詳細介紹
                  </a>
                  <div className="rounded-circle rating-circle" />
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow">
              <img
                src="https://placehold.co/400x351"
                className="card-img-top"
                alt="保母圖片"
              />
              <div className="card-body card-body-bg">
                <h5 className="card-title card-title-custom">保母姓名</h5>
                <p className="card-text text-danger card-text-custom">
                  介紹下面用評分
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <a href="#" className="text-danger detail-link">
                    詳細介紹
                  </a>
                  <div className="rounded-circle rating-circle" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        <div className="d-flex justify-content-center">
          <button className="btn btn-lg text-white random-btn">查看更多</button>
        </div>
      </div>
    </>
  )
}

