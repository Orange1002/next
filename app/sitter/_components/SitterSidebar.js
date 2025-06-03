'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Swal from 'sweetalert2'

export default function SitterSidebar() {
  const { sitterId } = useParams()
  const [sitter, setSitter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sitterId) return

    const fetchSitter = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/api/sitter/${sitterId}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        if (data.status === 'success') {
          setSitter(data.sitter)
        } else {
          Swal.fire('錯誤', data.message || '載入保母資料失敗', 'error')
        }
      } catch (err) {
        Swal.fire('錯誤', '無法載入保母資料', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchSitter()
  }, [sitterId])

  if (loading) {
    return <div className="container py-5 text-center">載入保母資料中...</div>
  }

  if (!sitter) {
    return (
      <div className="container py-5 text-center text-danger">
        保母資料不存在
      </div>
    )
  }

  return (
    <aside
      className="container-sm py-4 px-3 rounded-4 shadow-sm bg-white"
      style={{ maxWidth: '360px' }}
    >
      {/* 頭像 */}
      <div className="text-center">
        <Image
          src={sitter.avatar_url || '/images/default-avatar.png'}
          alt="Pet Sitter Profile"
          className="rounded-circle mb-3"
          width={120}
          height={120}
          style={{ objectFit: 'cover' }}
        />
        <h2 className="fs-4 fw-bold">{sitter.name}</h2>
        <p className="text-secondary small mb-2">服務地區：{sitter.area}</p>
      </div>

      {/* 評分 */}
      <div className="d-flex justify-content-center align-items-center gap-2 my-3">
        <span style={{ fontSize: '1.25rem', color: '#f5b301' }}>⭐</span>
        <span className="fs-5 fw-semibold">
          {Number(sitter.average_rating)?.toFixed(1) || '尚無評分'}
        </span>
        <span className="text-secondary small">
          ({sitter.review_count || 0})
        </span>
      </div>

      {/* 自我介紹 */}
      <div className="mt-3">
        <h3 className="fs-6 mb-1">自我介紹</h3>
        <p className="text-secondary small">{sitter.introduction}</p>
      </div>

      {/* 經歷 */}
      <div className="mt-3">
        <h3 className="fs-6 mb-1">經歷</h3>
        <p className="text-secondary small">{sitter.experience}</p>
      </div>
    </aside>
  )
}
