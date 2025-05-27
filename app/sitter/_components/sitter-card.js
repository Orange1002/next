import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import '../_styles/style-sitter-list.scss'

export default function SitterCard({ sitter }) {
  const defaultAvatar = '/images/default-avatar.png' // 確保這張圖存在於 public 資料夾

  return (
    <Link
      href={`/sitter/sitter-detail/${sitter.id}`}
      className="text-decoration-none"
    >
      <div className="card h-100 shadow">
        <Image
          src={sitter.avatar_url || defaultAvatar}
          className="card-img-top sitter-avatar"
          alt="保母圖片"
          width={100}
          height={100}
        />
        <div className="card-body card-body-bg">
          <h5 className="card-title card-title-custom fs-5">{sitter.name}</h5>
          <p className="card-text text-danger card-text-custom">
            {sitter.short_intro}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-danger detail-link">詳細介紹</div>
            <div className="text-end">
              <div className="rounded-circle rating-circle text-center pt-1 ms-3">
                {sitter.rating}
              </div>
              <div className="price-text mb-3">NT$ {sitter.price}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
