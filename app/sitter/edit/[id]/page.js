'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Image from 'next/image'
import '../../_styles/sitter-detail.module.css'

export default function EditSitterPage() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    area: '',
    service_time: '',
    experience: '',
    introduction: '',
    price: '',
  })

  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const [galleryImages, setGalleryImages] = useState([])
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])

  const [loading, setLoading] = useState(false)
  const defaultAvatar = '/siiter/default-avatar.png' // 放在 public 資料夾
  const avatarSrc =
    (typeof avatarPreview === 'string' && avatarPreview.trim()) ||
    (typeof avatarUrl === 'string' && avatarUrl.trim()) ||
    defaultAvatar

  useEffect(() => {
    const fetchSitter = async () => {
      try {
        const res = await fetch(`http://localhost:3005/api/sitter/${id}`, {
          credentials: 'include',
        })
        const data = await res.json()

        if (res.ok) {
          const fields = [
            'name',
            'area',
            'service_time',
            'experience',
            'introduction',
            'price',
          ]
          const cleanData = {}
          fields.forEach((key) => {
            cleanData[key] = data[key] ?? ''
          })
          setForm(cleanData)

          // ✅ 加入判斷是否為完整 http(s) 開頭網址
          const avatar = data.avatar_url || ''
          setAvatarUrl(
            avatar.startsWith('http')
              ? avatar
              : `http://localhost:3005${avatar}`
          )

          const gallery = Array.isArray(data.gallery) ? data.gallery : []
          setGalleryImages(
            gallery.map((img) =>
              img.startsWith('http') ? img : `http://localhost:3005${img}`
            )
          )
        } else {
          Swal.fire('錯誤', data.message || '載入失敗', 'error')
        }
      } catch (err) {
        console.error('載入保母資料錯誤', err)
        Swal.fire('錯誤', '伺服器錯誤', 'error')
      }
    }

    fetchSitter()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files)
    setGalleryFiles(files)
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      for (const key in form) {
        formData.append(key, form[key])
      }
      if (avatarFile) formData.append('avatar', avatarFile)
      galleryFiles.forEach((file) => formData.append('gallery', file))

      const res = await fetch(`http://localhost:3005/api/sitter/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()
      if (data.status === 'success') {
        Swal.fire('成功', '保母資料已更新', 'success').then(() => {
          router.push(`/sitter/sitter-list`)
        })
      } else {
        Swal.fire('錯誤', data.message || '更新失敗', 'error')
      }
    } catch (err) {
      console.error('更新錯誤', err)
      Swal.fire('錯誤', '伺服器錯誤', 'error')
    } finally {
      setLoading(false)
    }
  }

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
      const res = await fetch(`http://localhost:3005/api/sitter/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()
      if (data.status === 'success') {
        Swal.fire('已刪除', '保母資料已刪除', 'success').then(() => {
          router.push('/sitter/sitter-list')
        })
      } else {
        Swal.fire('錯誤', data.message || '刪除失敗', 'error')
      }
    } catch (err) {
      console.error('刪除失敗', err)
      Swal.fire('錯誤', '伺服器錯誤', 'error')
    } finally {
      setLoading(false)
    }
  }
  console.log({ avatarPreview, avatarUrl, avatarSrc })

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">✏️ 編輯保母資料</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="border rounded p-4 mb-4 bg-light">
          <h5 className="mb-3">📄 基本資料</h5>
          {[
            ['name', '姓名'],
            ['area', '服務地區'],
            ['service_time', '服務時段'],
            ['experience', '經歷'],
            ['introduction', '自我介紹'],
            ['price', '收費'],
          ].map(([field, label]) => (
            <div className="mb-3" key={field}>
              <label className="form-label">{label}</label>
              <input
                type="text"
                name={field}
                className="form-control"
                value={form[field] ?? ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="border rounded p-4 mb-4">
          <h5 className="mb-3">🖼️ 大頭貼</h5>
          <Image
            src={avatarSrc}
            alt="頭像"
            width={150}
            height={150}
            style={{ height: 'auto' }}
          />
          <input
            type="file"
            accept="image/*"
            className="form-control mt-2"
            onChange={handleAvatarChange}
          />
        </div>
        {/* <div className="border rounded p-4 mb-4">
          <h5 className="mb-3">📸 其他圖片</h5>
          <div className="d-flex flex-wrap gap-3 mb-2">
            {galleryImages
              .filter(
                (img) => typeof img === 'string' && img.startsWith('http')
              )
              .map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`gallery-${i}`}
                  width={120}
                  height={120}
                  style={{ height: 'auto', borderRadius: '6px' }}
                />
              ))}
            {galleryPreviews
              .filter((src) => typeof src === 'string')
              .map((src, i) => (
                <Image
                  key={`preview-${i}`}
                  src={src}
                  alt={`預覽-${i}`}
                  width={120}
                  height={120}
                  style={{ height: 'auto', borderRadius: '6px' }}
                />
              ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleGalleryChange}
          />
        </div> */}
        <div className="d-flex justify-content-between">
          <button
            className="btn bgc-primary px-4"
            type="submit"
            disabled={loading}
          >
            {loading ? '儲存中...' : '💾 儲存修改'}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger px-4"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? '刪除中...' : '🗑️ 刪除保母'}
          </button>
        </div>
      </form>
    </div>
  )
}
