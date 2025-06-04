import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Link from 'next/link'

const ButtonSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = keyword.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ maxWidth: '1076px', margin: '0 auto' }}
    >
      {/* 按鈕區 */}
      <div className="d-flex gap-3">
        <Link href="/favorites" passHref>
          <button type="button" className="btn c-s-btn pt-2 text-white">
            我的收藏
          </button>
        </Link>
        {/* <Link href="/popular-articles" passHref>
          <button type="button" className="btn c-s-btn pt-2 text-white">
            熱門文章
          </button>
        </Link> */}
      </div>

      {/* 搜尋表單 */}
      <form
        className="d-flex card-search gap-2"
        role="search"
        onSubmit={handleSubmit}
        style={{ minWidth: '250px' }}
      >
        <div className="input-group position-relative w-100">
          <input
            className="form-control rounded-pill"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
            type="submit"
            aria-label="Search"
          >
            <AiOutlineSearch size={20} style={{ marginTop: '-2px' }} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ButtonSearch
