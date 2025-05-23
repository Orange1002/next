'use client'
import React from 'react'
import { AiOutlineRight } from 'react-icons/ai'

function Breadcrumb() {
  return (
    <div className="container desktop">
      <div className="row">
        <div className="col-12 d-flex align-items-center mt-4">
          <div className="title-line"></div>
          <p className="ms-4 petknowledge">Pet knowledge</p>
          <div className="petknowledge-c ms-4"></div>
        </div>
        <div className="d-flex align-items-center fw-light gap-4 mt-4">
          <a href="#" className="mb-0 me-3 text-decoration-none bread">
            首頁
          </a>
          <AiOutlineRight className="bread" />
          <a href="#" className="mb-0 me-3 ms-3 text-decoration-none bread">
            文章
          </a>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
