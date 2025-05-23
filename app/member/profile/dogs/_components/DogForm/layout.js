'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import CancelButton from '../../../../_components/BtnCustomGray/layout'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import { useAuth } from '../../../../../../hooks/use-auth.js'

const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'

export default function DogForm({ initialData = {}, onSubmit }) {
  const { isAuth, member, loading } = useAuth()
  const inputRef = useRef(null)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    breed: '',
    description: '',
    photos: [], // 實際檔案 (File)
    previews: [], // 圖片預覽 (url)
    ...initialData,
  })

  useEffect(() => {
    if (
      initialData.photos &&
      Array.isArray(initialData.photos) &&
      initialData.photos.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        previews: initialData.photos,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        previews: [DEFAULT_IMAGE],
      }))
    }
  }, [initialData.photos])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    if (newFiles.length === 0) return

    const maxFiles = 5 - formData.photos.length
    const selectedFiles = newFiles.slice(0, maxFiles)

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...selectedFiles],
      previews: [
        ...prev.previews.filter((p) => p !== DEFAULT_IMAGE),
        ...newPreviews,
      ],
    }))
  }

  const triggerFileSelect = () => {
    if (inputRef.current) inputRef.current.click()
  }

  const removePreviewAt = (index) => {
    setFormData((prev) => {
      const newPhotos = prev.photos.filter((_, i) => i !== index)
      const newPreviews = prev.previews.filter((_, i) => i !== index)
      return {
        ...prev,
        photos: newPhotos,
        previews: newPreviews.length > 0 ? newPreviews : [DEFAULT_IMAGE],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuth) {
      alert('請先登入')
      return
    }

    if (!formData.name.trim()) {
      alert('請輸入狗狗的名字')
      return
    }

    const form = new FormData()
    form.append('name', formData.name)
    form.append('age', formData.age)
    form.append('breed', formData.breed)
    form.append('description', formData.description)

    formData.photos.forEach((file) => {
      form.append('dog_images', file)
    })

    try {
      const isEdit = !!initialData.id
      const url = isEdit
        ? `http://localhost:3005/api/member/dogs/edit/${initialData.id}`
        : 'http://localhost:3005/api/member/dogs/add'

      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: form,
        credentials: 'include',
      })

      if (!res.ok) throw new Error('上傳失敗')
      const result = await res.json()
      console.log(isEdit ? '編輯成功' : '新增成功', result)

      onSubmit?.() // 通知父元件處理後續(例如跳轉)
    } catch (err) {
      console.error('上傳錯誤', err)
      alert('上傳失敗，請稍後再試')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 頭貼區塊 */}
      <div className="mb-3">
        <label className="form-label">狗狗照片（最多可上傳 5 張）</label>
        <div className="d-flex gap-2 flex-wrap mb-2">
          {formData.previews.map((preview, index) => (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={preview}
                alt={`預覽圖 ${index + 1}`}
                width={80}
                height={80}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removePreviewAt(index)}
              >
                ×
              </button>
            </div>
          ))}

          {formData.photos.length < 5 && (
            <button
              type="button"
              onClick={triggerFileSelect}
              className={styles.addPhotoButton}
              aria-label="新增照片"
            >
              +
            </button>
          )}
        </div>

        {/* 隱藏 input */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* 表單欄位 */}
      <div className="mb-3">
        <label htmlFor="dogName" className="form-label">
          名字
        </label>
        <input
          id="dogName"
          className="form-control"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="dogAge" className="form-label">
          年齡
        </label>
        <select
          id="dogAge"
          className="form-select"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        >
          <option value="">請選擇年齡</option>
          <option value="0">1 歲以下</option>
          <option value="1">1 歲</option>
          <option value="2">2 歲</option>
          <option value="3">3 歲</option>
          <option value="4">4 歲</option>
          <option value="5">5 歲</option>
          <option value="6">6 歲</option>
          <option value="7">7 歲</option>
          <option value="8">8 歲</option>
          <option value="9">9 歲</option>
          <option value="10">10 歲</option>
          <option value="11">11 歲</option>
          <option value="12">12 歲</option>
          <option value="13">13 歲</option>
          <option value="14">14 歲</option>
          <option value="15">15 歲</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="dogBreed" className="form-label">
          品種
        </label>
        <input
          id="dogBreed"
          type="text"
          className="form-control"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="dogDesc" className="form-label">
          備註
        </label>
        <textarea
          id="dogDesc"
          className="form-control"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* 按鈕 */}
      <div className="d-flex justify-content-center gap-5">
        <CancelButton to="/member/profile/dogs">取消</CancelButton>
        <SubmitButton>{initialData.id ? '更新' : '新增'}</SubmitButton>
      </div>
    </form>
  )
}
