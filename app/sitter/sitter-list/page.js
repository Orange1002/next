'use client'

import React, { useState, useEffect } from 'react'
import {} from 'react-bootstrap'

import SitterCard from '../_components/sitter-card'

export default function SitterList(props) {
  const [sitters, setSitters] = useState([])

  useEffect(() => {
    fetch('http://localhost:3005/api/sitter') // 你的 API 路由
      .then((res) => res.json())
      .then((data) => setSitters(data))
      .catch((err) => console.error(err))
  }, [])

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

          {sitters.map((sitter) => (
            <div className="col" key={sitter.id}>
              <SitterCard sitter={sitter} />
            </div>
          ))}
        </div>
        <nav
          aria-label="Page navigation"
          className="d-flex justify-content-center mb-5"
        >
          <ul className="pagination">
            <li className="page-item disabled">
              <a
                className="page-link text-muted"
                href="#"
                aria-label="Previous"
              >
                <span aria-hidden="true">«</span>
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-muted" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-muted" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-muted" href="#" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="d-flex justify-content-center">
          <button className="btn btn-lg text-white random-btn">隨機配對</button>
        </div>
      </div>
    </>
  )
}
