'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Image from 'next/image'
import '../_styles/sitter-detail.module.css'

export default function CreateSitterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    area: '',
    service_time: '',
    experience: '',
    introduction: '',
    price: '',
  })

  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const [gallery, setGallery] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file)
    setAvatarPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files)
    setGallery(files)
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()

      for (const key in form) {
        formData.append(key, form[key])
      }

      if (avatar) formData.append('avatar', avatar)
      gallery.forEach((file) => {
        formData.append('gallery', file)
      })

      const res = await fetch('http://localhost:3005/api/sitter', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()

      if (data.status === 'success') {
        Swal.fire('成功', '保母新增成功', 'success').then(() => {
          router.push(`/sitter/sitter-list`)
        })
      } else {
        Swal.fire('錯誤', data.message || '新增成功但未取得保母id', 'error')
      }
    } catch (err) {
      console.error('新增保母失敗', err)
      Swal.fire('錯誤', '新增失敗，請稍後再試', 'error')
    } finally {
      setLoading(false)
    }
  }

  const taiwanCities = [
    '台北市',
    '新北市',
    '基隆市',
    '宜蘭縣',
    '桃園市',
    '新竹市',
    '新竹縣',
    '苗栗縣',
    '台中市',
    '彰化縣',
    '南投縣',
    '雲林縣',
    '嘉義市',
    '嘉義縣',
    '台南市',
    '高雄市',
    '屏東縣',
    '台東縣',
    '花蓮縣',
    '澎湖縣',
    '金門縣',
    '連江縣',
  ]

  return (
    <div className="container ">
      <p className="text-center mb-3 fs-5">申請成為保母</p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* 姓名 */}
        <div className="mb-3">
          <label className="form-label">姓名</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* 服務地區 */}
        <div className="mb-3">
          <label className="form-label">服務地區</label>
          <select
            className="form-control"
            name="area"
            value={form.area}
            onChange={handleChange}
          >
            <option value="">請選擇地區</option>
            {taiwanCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* 服務時段 */}
        <div className="mb-3">
          <label className="form-label">服務時段</label>
          <input
            type="text"
            className="form-control"
            name="service_time"
            value={form.service_time}
            onChange={handleChange}
          />
        </div>

        {/* 經歷 */}
        <div className="mb-3">
          <label className="form-label">經歷</label>
          <input
            type="text"
            className="form-control"
            name="experience"
            value={form.experience}
            onChange={handleChange}
          />
        </div>

        {/* 自我介紹 */}
        <div className="mb-3">
          <label className="form-label">自我介紹</label>
          <input
            type="text"
            className="form-control"
            name="introduction"
            value={form.introduction}
            onChange={handleChange}
          />
        </div>

        {/* 收費 */}
        <div className="mb-3">
          <label className="form-label">收費（元）</label>
          <input
            type="number"
            className="form-control"
            name="price"
            min={0}
            value={form.price}
            onChange={handleChange}
          />
        </div>

        {/* 大頭貼上傳 */}
        <div className="mb-3">
          <label className="form-label">大頭貼</label>
          <input
            type="file"
            className="form-control"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {avatarPreview && (
            <Image
              src={avatarPreview}
              alt="大頭貼預覽"
              width={200}
              height={200}
              style={{ height: 'auto' }}
            />
          )}
        </div>

        {/* 圖片集上傳（可選） */}
        {/* 
        <div className="mb-3">
          <label className="form-label">其他圖片（可多選）</label>
          <input
            type="file"
            className="form-control"
            name="gallery"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />
          {galleryPreviews.length > 0 && (
            <div className="mt-3 d-flex flex-wrap gap-2">
              {galleryPreviews.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Gallery ${i}`}
                  width={120}
                  height={120}
                  style={{ height: 'auto' }}
                />
              ))}
            </div>
          )}
        </div>
        */}

        <button
          className="btn bgc-primary mt-3 text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? '送出中...' : '新增保母'}
        </button>
      </form>
    </div>
  )
}
