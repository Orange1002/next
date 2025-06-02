'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function SitterBookingPage() {
  const { sitterId } = useParams()
  const router = useRouter()

  const [dogs, setDogs] = useState([])
  const [status, setStatus] = useState('loading') // loading, success, empty, error

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dogId, setDogId] = useState('')
  const [loading, setLoading] = useState(false)

  // 新增狗狗欄位
  const [newDogName, setNewDogName] = useState('')
  const [addingDog, setAddingDog] = useState(false)

  // 取得狗狗清單
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
      } else {
        setStatus('error')
        Swal.fire('錯誤', data.message || '載入寵物失敗', 'error')
      }
    } catch (err) {
      console.error('載入寵物失敗', err)
      setStatus('error')
      Swal.fire('錯誤', '無法載入寵物資料', 'error')
    }
  }

  useEffect(() => {
    fetchDogs()
  }, [])

  // 新增狗狗處理
  const handleAddDog = async () => {
    if (!newDogName.trim()) {
      Swal.fire('錯誤', '請輸入狗狗名字', 'error')
      return
    }

    setAddingDog(true)
    try {
      const res = await fetch('http://localhost:3005/api/sitter-booking/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({ name: newDogName }),
      })

      const data = await res.json()
      if (res.ok && data.status === 'success') {
        Swal.fire('成功', '新增狗狗成功', 'success')
        setNewDogName('')
        fetchDogs()
      } else {
        Swal.fire('錯誤', data.message || '新增失敗', 'error')
      }
    } catch (err) {
      console.error('新增狗狗失敗', err)
      Swal.fire('錯誤', '無法新增狗狗', 'error')
    } finally {
      setAddingDog(false)
    }
  }

  // 預約提交
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
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
          body: JSON.stringify({ sitterId, startDate, endDate, petId: dogId }),
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
          router.push('/member/bookings')
        })
      } else {
        Swal.fire('錯誤', data.message || '預約失敗', 'error')
      }
    } catch (err) {
      console.error('預約發送失敗', err)
      Swal.fire('錯誤', '預約失敗，請稍後再試', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 position-relative">
      <h1 className="mb-4 fs-4">預約保母服務</h1>
      <form onSubmit={handleSubmit}>
        {/* 日期選擇 */}
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
          {status === 'empty' ? (
            <>
              <div className="form-text text-danger mb-2">
                尚未新增任何寵物，請先輸入狗狗名字並新增。
              </div>
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
              </div>
            </>
          ) : (
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
          )}
        </div>

        {/* 送出按鈕 */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || status !== 'success'}
        >
          {loading ? '送出中...' : '送出預約'}
        </button>
      </form>
    </div>
  )
}
