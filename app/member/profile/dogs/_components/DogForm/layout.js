'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import CancelButton from '../../../../_components/BtnCustomGray/layout'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import { useAuth } from '../../../../../../hooks/use-auth.js'

const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'

export default function DogForm({
  initialData = {},
  onSubmit,
  isEdit = false,
}) {
  const { isAuth, member, loading } = useAuth()
  const inputRef = useRef(null)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    breed: '',
    description: '',
    size_id: '',
    photos: [],
    previews: [DEFAULT_IMAGE],
  })

  // 這裡同步 initialData 到 formData
  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return

    setFormData({
      id: initialData.id || '',
      name: initialData.name || '',
      age: initialData.age || '',
      breed: initialData.breed || '',
      description: initialData.description || '',
      size_id: initialData.size_id || '',
      photos: [],
      previews:
        Array.isArray(initialData.photos) && initialData.photos.length > 0
          ? initialData.photos
          : [DEFAULT_IMAGE],
    })
  }, [initialData])

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
      id: initialData.id ?? '',
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
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('送出的 formData', formData)
    if (!isAuth) return alert('請先登入')
    if (!formData.name.trim()) return alert('請輸入狗狗的名字')
    if (isEdit && !formData.id) return alert('缺少狗狗 ID')

    onSubmit?.(formData) // 將 formData 回傳給父層
  }
  return (
    <form
      className={`${styles.form} h-100 d-flex flex-column justify-content-between align-items-center mt-lg-3`}
      onSubmit={handleSubmit}
    >
      {/* 頭貼區塊 */}
      <div className="">
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
      {/* 名字 */}
      <div className={`${styles.inputField} mb-2`}>
        <p className="d-flex justify-content-center">名字</p>
        <input
          type="text"
          placeholder="狗狗名字"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      {/* 年齡 */}
      <div className={`${styles.inputField} mb-2`}>
        <p className="d-flex justify-content-center">年齡</p>
        <select
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          className="form-select border-0"
          style={{ backgroundColor: 'transparent' }}
        >
          <option value="">請選擇年齡</option>
          {Array.from({ length: 16 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? '1 歲以下' : `${i} 歲`}
            </option>
          ))}
        </select>
      </div>

      {/* 品種 */}
      <div className={`${styles.inputField} mb-2`}>
        <p className="d-flex justify-content-center">品種</p>
        <input
          type="text"
          placeholder="品種"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
        />
      </div>

      {/* 體型選擇 */}
      <div className={`${styles.inputField} mb-2`}>
        <p className="d-flex justify-content-center">體型</p>
        <select
          id="dogSize"
          name="size_id"
          className="form-select border-0"
          value={formData.size_id}
          onChange={handleChange}
          required
          style={{ backgroundColor: 'transparent' }}
        >
          <option value="">請選擇體型</option>
          <option value="1">迷你型（4公斤以下）</option>
          <option value="2">小型（5~10公斤）</option>
          <option value="3">中型（11~25公斤）</option>
          <option value="4">大型（26~44公斤）</option>
          <option value="5">超大型（45公斤以上）</option>
        </select>
      </div>

      {/* 備註欄位 */}
      <div className={`${styles.inputField} mb-2`}>
        <p className="d-flex justify-content-center">備註</p>
        <textarea
          id="dogDesc"
          name="description"
          rows="2"
          placeholder="備註"
          value={formData.description}
          onChange={handleChange}
          className="form-control border-0"
          style={{ resize: 'none', backgroundColor: 'transparent' }}
        />
      </div>

      {/* 按鈕 */}
      <div className="d-flex justify-content-center gap-5">
        <CancelButton to="/member/profile/dogs">取消</CancelButton>
        <SubmitButton>{isEdit ? '更新' : '新增'}</SubmitButton>
      </div>
    </form>
  )
}
