'use client'

import React, { useState, useEffect } from 'react'
import SitterCard from '../_components/sitter-card'
import Dropdown from 'react-bootstrap/Dropdown'
import Link from 'next/link'

export default function SitterList() {
  const [sitters, setSitters] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('rating')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 12

  const fetchSitters = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sort: sortType,
        page: currentPage,
        pageSize,
      })

      const res = await fetch(`http://localhost:3005/api/sitter?${params}`)
      const data = await res.json()

      setSitters(data.data)
      setTotalPages(Math.ceil(data.total / pageSize))
    } catch (error) {
      console.error('Error fetching sitters:', error)
    }
  }

  useEffect(() => {
    fetchSitters()
  }, [searchTerm, sortType, currentPage])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (type) => {
    setSortType(type)
    setCurrentPage(1)
  }

  return (
    <div className="container py-5 position-relative">
      <div className="text-center mb-2">
        <Link
          href="/sitter"
          className="btn btn-outline-secondary position-absolute top-0 start-0 m-4 z-3"
        >
          ← 返回
        </Link>
        <div className="d-inline-flex align-items-center gap-3">
          <div className="flex-grow-1 border-top border-3 border-dark title-line" />
          <h2 className="text-secondary section-title">選擇寵物保母</h2>
          <div className="rounded-circle bg-dark dot-circle" />
        </div>
      </div>

      {/* 搜尋 + 排序 */}
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4 px-3 flex-wrap">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="搜尋保母"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            className="dropdown-toggle-custom"
          >
            {sortType === 'rating' && '評分最高'}
            {sortType === 'price' && '價格最低'}
            {sortType === 'area' && '地區'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSortChange('rating')}>
              評分最高
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('price')}>
              價格最低
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('area')}>
              地區
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 保母卡片 */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        {sitters.map((sitter) => (
          <div className="col" key={sitter.id}>
            <SitterCard sitter={sitter} />
          </div>
        ))}
      </div>

      {/* 分頁導覽 */}
      <nav
        aria-label="Page navigation"
        className="d-flex justify-content-center mb-5"
      >
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              «
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 && 'active'}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages && 'disabled'}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              »
            </button>
          </li>
        </ul>
      </nav>

      <div className="d-flex justify-content-center">
        <button className="btn btn-lg text-white random-btn">隨機配對</button>
      </div>
    </div>
  )
}
