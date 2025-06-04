'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { useNotification } from '@/contexts/NotificationContext'
import Image from 'next/image'
import '../../_styles/sitter-detail.module.css'
import { useCart } from '@/hooks/use-cart'

export default function SitterBookingPage() {
  const { sitterId } = useParams()
  const router = useRouter()
  const { addNotification } = useNotification()
  const { onAdd } = useCart()

  const [sitter, setSitter] = useState(null)
  const [dogs, setDogs] = useState([])
  const [status, setStatus] = useState('loading')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dogId, setDogId] = useState('')
  const [loading, setLoading] = useState(false)
  const [newDogName, setNewDogName] = useState('')
  const [addingDog, setAddingDog] = useState(false)
  const [addingNewDog, setAddingNewDog] = useState(false)

  const [totalPrice, setTotalPrice] = useState(0)

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
        if (res.ok) setSitter(data)
        else Swal.fire('錯誤', data.message || '載入保母資料失敗', 'error')
      } catch {
        Swal.fire('錯誤', '無法載入保母資料', 'error')
      }
    }
    fetchSitter()
  }, [sitterId])

  // ✅ 抽出 fetchDogs，讓取消新增按鈕也能使用
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
        setAddingNewDog(true)
      } else {
        setStatus('error')
        Swal.fire('錯誤', data.message || '載入寵物失敗', 'error')
      }
    } catch {
      setStatus('error')
      Swal.fire('錯誤', '無法載入寵物資料', 'error')
    }
  }

  useEffect(() => {
    fetchDogs()
  }, [])

  const handleAddDog = async () => {
    if (!newDogName.trim()) return Swal.fire('錯誤', '請輸入狗狗名字', 'error')
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
    } catch {
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

        const dayCount =
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24) +
          1
        const totalprice = sitter?.price ? sitter.price * dayCount : 0
        const sitterImg = sitter?.avatar_url
          ? `http://localhost:3005/${sitter.avatar_url}`
          : '/images/default-avatar.png'

        onAdd('sitter', {
          sitter_id: sitterId,
          type: 'sitter',
          image: sitterImg,
          name: sitter_name,
          pet_id: dogId,
          petname: dog_name,
          start_time: start_date,
          end_time: end_date,
          price: totalprice,
        })

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
        }).then(() => router.push('/shopcart'))
      } else {
        Swal.fire('錯誤', data.message || '預約失敗', 'error')
      }
    } catch {
      Swal.fire('錯誤', '預約失敗，請稍後再試', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (startDate && endDate && sitter?.price) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days =
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1
      if (days > 0) {
        setTotalPrice(sitter.price * days)
      } else {
        setTotalPrice(0)
      }
    } else {
      setTotalPrice(0)
    }
  }, [startDate, endDate, sitter?.price])

  const SitterSidebar = () => {
    if (!sitter) return <div>載入保母資料中...</div>
    return (
      <aside
        className="container-sm py-4 px-3 rounded-4 shadow-sm bg-white"
        style={{ maxWidth: '360px' }}
      >
        <div className="text-center">
          <Image
            src={
              sitter.avatar_url
                ? `http://localhost:3005/${sitter.avatar_url}`
                : '/images/default-avatar.png'
            }
            alt="Pet Sitter"
            width={120}
            height={120}
            className="rounded-circle mb-3"
          />
          <h2 className="fs-4">{sitter.name}</h2>
          <p className="text-secondary">服務地區：{sitter.area}</p>
        </div>
        <div className="mt-3">
          <h3 className="fs-6 mb-1">自我介紹</h3>
          <p className="text-secondary small">{sitter.introduction}</p>
        </div>
        <div className="mt-3">
          <h3 className="fs-6 mb-1">經歷</h3>
          <p className="text-secondary small">{sitter.experience}</p>
        </div>
        <div className="mt-3">
          <h3 className="fs-6 mb-1">價格</h3>
          <p className="text-secondary small">
            ${sitter?.price?.toLocaleString()}
          </p>
        </div>
      </aside>
    )
  }

  return (
    <div className="container py-4">
      <button
        onClick={() => router.back()}
        className="btn btn-outline-secondary mb-3"
      >
        ← 返回
      </button>
      <div className="row">
        <div className="col-md-4">
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

            {/* ✅ 寵物選擇或新增 */}
            <div className="mb-3">
              <label className="form-label">選擇寵物</label>
              {status === 'empty' || addingNewDog ? (
                <>
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

            <div className="mt-3 text-end">
              <strong>總金額：</strong>{' '}
              {totalPrice > 0
                ? `$${totalPrice.toLocaleString()}`
                : '請選擇日期'}
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
