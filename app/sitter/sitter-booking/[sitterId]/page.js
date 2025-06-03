'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { useNotification } from '@/contexts/NotificationContext'
import Image from 'next/image'
import '../../_styles/sitter-detail.module.css'

export default function SitterBookingPage() {
  const { sitterId } = useParams()
  const router = useRouter()
  const { addNotification } = useNotification()

  // === 內嵌 SitterSidebar 元件 ===
  function SitterSidebar() {
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

          if (res.ok) {
            // 假設後端回傳就是 sitter 物件
            setSitter(data)
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
            src={
              sitter?.avatar_url
                ? `http://localhost:3005/${sitter.avatar_url}`
                : '/images/default-avatar.png'
            }
            alt="Pet Sitter Profile"
            className="rounded-circle mb-3"
            width={120}
            height={120}
            style={{ objectFit: 'cover' }}
          />
          <h2 className="fs-4 fw-bold mb-1">{sitter.name}</h2>
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

  // 以下保留你原本的預約表單邏輯與狀態
  const [dogs, setDogs] = useState([])
  const [status, setStatus] = useState('loading')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dogId, setDogId] = useState('')
  const [loading, setLoading] = useState(false)
  const [newDogName, setNewDogName] = useState('')
  const [addingDog, setAddingDog] = useState(false)
  const [addingNewDog, setAddingNewDog] = useState(false)

  const fetchDogs = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/sitter-booking/dogs', {
        credentials: 'include',
      })

      const data = await res.json()
      if (res.ok && data.status === 'success') {
        setDogs(data.dogs)
        setStatus('success')
      } else if (data.status === 'empty') {
        setDogs([])
        setStatus('empty')
        setAddingNewDog(true) // 沒寵物時直接顯示新增表單
      } else {
        setStatus('error')
        Swal.fire('錯誤', data.message || '載入寵物失敗', 'error')
      }
    } catch (err) {
      setStatus('error')
      Swal.fire('錯誤', '無法載入寵物資料', 'error')
    }
  }

  useEffect(() => {
    fetchDogs()
  }, [])

  const handleAddDog = async () => {
    if (!newDogName.trim()) {
      Swal.fire('錯誤', '請輸入狗狗名字', 'error')
      return
    }

    setAddingDog(true)
    try {
      const res = await fetch('http://localhost:3005/api/sitter-booking/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newDogName }),
      })

      const data = await res.json()
      if (res.ok && data.status === 'success') {
        Swal.fire('成功', '新增狗狗成功', 'success')
        setNewDogName('')
        setAddingNewDog(false)
        fetchDogs()
      } else {
        Swal.fire('錯誤', data.message || '新增失敗', 'error')
      }
    } catch (err) {
      Swal.fire('錯誤', '無法新增狗狗', 'error')
    } finally {
      setAddingDog(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!startDate || !endDate || !dogId) {
      Swal.fire('錯誤', '請填寫所有欄位', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        `http://localhost:3005/api/sitter-booking/${sitterId}/bookings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ startDate, endDate, petId: dogId }),
        }
      )

      const data = await res.json()

      if (data.status === 'success') {
        const {
          booking_id,
          username,
          email,
          dog_name,
          sitter_name,
          start_date,
          end_date,
        } = data.booking

        addNotification(
          `您已成功預約 ${sitter_name} 的服務，寵物：${dog_name}，期間：${start_date} ~ ${end_date}`
        )

        Swal.fire({
          icon: 'success',
          title: '預約成功',
          html: `
            <p>預約編號：<strong>${booking_id}</strong></p>
            <p>會員：<strong>${username} (${email})</strong></p>
            <p>寵物：<strong>${dog_name}</strong></p>
            <p>保母：<strong>${sitter_name}</strong></p>
            <p>期間：<strong>${start_date} ~ ${end_date}</strong></p>
          `,
        }).then(() => {
          router.push('/shopcart')
        })
      } else {
        Swal.fire('錯誤', data.message || '預約失敗', 'error')
      }
    } catch (err) {
      Swal.fire('錯誤', '預約失敗，請稍後再試', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      {/* 返回按鈕 */}
      <button
        onClick={() => router.back()}
        className="btn btn-outline-secondary ms-lg-4 mb-3"
      >
        ← 返回
      </button>
      {/* 手機版 Sidebar Offcanvas */}
      <div className="d-md-none mb-3">
        <button
          className="btn btn-outline-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
        >
          ☰ 查看保母資訊
        </button>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="mobileSidebar"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">保母資訊</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div className="offcanvas-body">
            <SitterSidebar />
          </div>
        </div>
      </div>

      {/* 桌機版兩欄排版 */}
      <div className="row">
        <div className="col-md-4 d-none d-md-block">
          <SitterSidebar />
        </div>

        <div className="col-md-8">
          <h1 className="fs-4 mb-4">預約服務</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">起始日期</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">結束日期</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* 寵物選擇或新增 */}
            <div className="mb-3">
              <label className="form-label">選擇寵物</label>
              {status === 'empty' || addingNewDog ? (
                <>
                  {/* 沒有紅字提示 */}
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="請輸入狗狗名字"
                      value={newDogName}
                      onChange={(e) => setNewDogName(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleAddDog}
                      disabled={addingDog}
                    >
                      {addingDog ? '新增中...' : '新增狗狗'}
                    </button>
                    {/* 取消新增按鈕，只在非空狀態顯示 */}
                    {status !== 'empty' && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          setAddingNewDog(false)
                          setNewDogName('')
                          fetchDogs()
                        }}
                      >
                        取消新增
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <select
                    className="form-select"
                    value={dogId}
                    onChange={(e) => setDogId(e.target.value)}
                    disabled={status !== 'success'}
                  >
                    <option value="" disabled>
                      請選擇寵物
                    </option>
                    {dogs.map((dog) => (
                      <option key={dog.id} value={dog.id}>
                        {dog.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setAddingNewDog(true)}
                    >
                      新增寵物
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              className="btn bgc-primary text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? '預約中...' : '送出預約'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
