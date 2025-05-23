import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const ArticleHeaderActions = () => {
  return (
    <div className="d-flex">
      {/* 左邊按鈕區塊 */}
      <div className="d-flex gap-3">
        <a href="">
          <button type="button" className="btn c-s-btn pt-2 text-white">
            我的收藏
          </button>
        </a>
        <a href="">
          <button type="button" className="btn c-s-btn pt-2 text-white">
            熱門文章
          </button>
        </a>
      </div>

      {/* 搜尋表單 */}
      <form className="d-flex card-search ms-auto gap-2" role="search">
        <div className="input-group position-relative">
          <input
            className="form-control rounded-pill"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
            type="submit"
          >
            <AiOutlineSearch size={20} style={{ marginTop: '-2px' }} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ArticleHeaderActions
