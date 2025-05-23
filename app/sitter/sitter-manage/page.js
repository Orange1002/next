'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function MemberSitterListPage() {
  const [sitter, setSitter] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSitter = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/sitter/manage', {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem('token')}`,
          // },
          credentials: 'include',
        })

        const data = await res.json()
        if (res.ok) {
          setSitter(data.sitter) // null 或一筆保母資料
        } else {
          Swal.fire('錯誤', data.message || '載入失敗', 'error')
        }
      } catch (err) {
        console.error('載入保母失敗', err)
        Swal.fire('錯誤', '伺服器錯誤', 'error')
      }
    }

    fetchSitter()
  }, [])

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: '確定要刪除這位保母嗎？',
      text: '此操作無法復原',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
    })

    if (!confirm.isConfirmed) return

    try {
      setLoading(true)
      const res = await fetch(`http://localhost:3005/api/sitter/${sitter.id}`, {
        method: 'DELETE',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
        credentials: 'include',
      })

      const data = await res.json()

      if (data.status === 'success') {
        Swal.fire('已刪除', '保母資料已刪除', 'success').then(() => {
          setSitter(null)
        })
      } else {
        Swal.fire('錯誤', data.message || '刪除失敗', 'error')
      }
    } catch (err) {
      console.error('刪除失敗', err)
      Swal.fire('錯誤', '刪除失敗，請稍後再試', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">我的保母</h1>

      {sitter ? (
        <div className="card p-4">
          <h3 className="mb-2">{sitter.name}</h3>
          <p>服務地區：{sitter.area}</p>
          <p>服務時段：{sitter.service_time}</p>
          <p>經歷：{sitter.experience}</p>
          <p>介紹：{sitter.introduction}</p>

          <div className="d-flex gap-3 mt-3">
            <Link
              href={`/sitter/edit/${sitter.id}`}
              className="btn btn-warning"
            >
              編輯
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={loading}
            >
              {loading ? '刪除中...' : '刪除'}
            </button>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          尚未新增任何保母，請先<Link href="/sitter/create">新增保母</Link>。
        </div>
      )}
    </div>
  )
}
