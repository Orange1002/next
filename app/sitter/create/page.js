'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Image from 'next/image'

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

      // 附加文字欄位
      for (const key in form) {
        formData.append(key, form[key])
      }

      // 附加圖片欄位
      if (avatar) formData.append('avatar', avatar)
      gallery.forEach((file) => {
        formData.append('gallery', file)
      })

      const res = await fetch('http://localhost:3005/api/sitter', {
        method: 'POST',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()

      if (data.status === 'success') {
        const sitterId = data.sitter?.id
        Swal.fire('成功', '保母新增成功', 'success').then(() => {
          router.push(`/sitter/edit/${sitterId}`)
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

  return (
    <div className="container py-5">
      <h1 className="mb-4">新增保母資料</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* 文字欄位 */}
        {[
          ['name', '姓名'],
          ['area', '服務地區'],
          ['service_time', '服務時段'],
          ['experience', '經歷'],
          ['introduction', '自我介紹'],
          ['price', '收費（元）'], // ✅ 新增欄位
        ].map(([field, label]) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{label}</label>
            <input
              type={field === 'price' ? 'number' : 'text'} // 若是 price，用數字輸入框
              className="form-control"
              name={field}
              value={form[field]}
              onChange={handleChange}
              min={field === 'price' ? 0 : undefined} // 限制價格為正數
            />
          </div>
        ))}

        {/* 大頭照上傳 + 預覽 */}
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

        {/* 圖片集上傳 + 預覽 */}
        {/* <div className="mb-3">
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
        </div> */}

        {/* 送出按鈕 */}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '送出中...' : '新增保母'}
        </button>
      </form>
    </div>
  )
}
