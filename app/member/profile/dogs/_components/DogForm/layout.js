'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import CancelButton from '../../../../_components/BtnCustomGray/layout'
import SubmitButton from '../../../../_components/BtnCustom/layout'
import { useAuth } from '../../../../../../hooks/use-auth.js'

const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'
const BASE_URL = 'http://localhost:3005' // 調整為你的後端 domain

export default function DogForm({
  initialData = {},
  onSubmit,
  isEdit = false,
}) {
  const { isAuth } = useAuth()
  const inputRef = useRef(null)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    breed: '',
    description: '',
    size_id: '',
    existingPhotos: [], // ✅ 相對路徑
    newPhotos: [],
    photosToDelete: [],
  })

  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return

    const photos = Array.isArray(initialData.photos) ? initialData.photos : []

    setFormData({
      id: initialData.id || '',
      name: initialData.name || '',
      age: initialData.age || '',
      breed: initialData.breed || '',
      description: initialData.description || '',
      size_id: initialData.size_id || '',
      existingPhotos: photos, // ✅ 相對路徑保留
      newPhotos: [],
      photosToDelete: [],
    })
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const maxFiles =
      5 - (formData.existingPhotos.length + formData.newPhotos.length)
    const selected = files.slice(0, maxFiles)

    setFormData((prev) => ({
      ...prev,
      newPhotos: [...prev.newPhotos, ...selected],
    }))
  }

  const triggerFileSelect = () => {
    if (inputRef.current) inputRef.current.click()
  }

  const removeImage = (type, index) => {
    setFormData((prev) => {
      if (type === 'existing') {
        const removed = prev.existingPhotos[index]
        return {
          ...prev,
          existingPhotos: prev.existingPhotos.filter((_, i) => i !== index),
          photosToDelete: [...prev.photosToDelete, removed],
        }
      } else {
        return {
          ...prev,
          newPhotos: prev.newPhotos.filter((_, i) => i !== index),
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuth) return alert('請先登入')
    if (!formData.name.trim()) return alert('請輸入狗狗的名字')
    if (isEdit && !formData.id) return alert('缺少狗狗 ID')

    onSubmit?.(formData)
  }

  return (
    <form
      className={`${styles.form} h-100 d-flex flex-column justify-content-between align-items-center mt-lg-3`}
      onSubmit={handleSubmit}
    >
      {/* 照片區塊 */}
      <div>
        <label className="form-label">狗狗照片（最多可上傳 5 張）</label>
        <div className="d-flex gap-2 flex-wrap mb-2 justify-content-center">
          {/* 舊照片 */}
          {formData.existingPhotos.map((url, index) => (
            <div key={`old-${index}`} className={styles.imageWrapper}>
              <Image
                src={
                  url.startsWith('http')
                    ? url
                    : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
                }
                alt={`舊圖 ${index + 1}`}
                width={80}
                height={80}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeImage('existing', index)}
              >
                ×
              </button>
            </div>
          ))}

          {/* 新照片 */}
          {formData.newPhotos.map((file, index) => (
            <div key={`new-${index}`} className={styles.imageWrapper}>
              <Image
                src={URL.createObjectURL(file)}
                alt={`新圖 ${index + 1}`}
                width={80}
                height={80}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeImage('new', index)}
              >
                ×
              </button>
            </div>
          ))}

          {/* 新增按鈕 */}
          {formData.existingPhotos.length + formData.newPhotos.length < 5 && (
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

      <div className={`${styles.inputField} mb-2 position-relative`}>
        <p className="d-flex justify-content-center">備註</p>
        <textarea
          id="dogDesc"
          name="description"
          rows="2"
          placeholder="備註"
          maxLength={50}
          value={formData.description}
          onChange={handleChange}
          className="form-control border-0 pe-5"
          style={{ resize: 'none', backgroundColor: 'transparent' }}
        />
        <p
          className="position-absolute text-muted small"
          style={{
            bottom: '20px',
            right: '10px',
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          {formData.description.length}/50
        </p>
      </div>

      <div className="d-flex justify-content-center gap-3 gap-lg-5">
        <CancelButton to="/member/profile/dogs">取消</CancelButton>
        <SubmitButton>{isEdit ? '更新' : '新增'}</SubmitButton>
      </div>
    </form>
  )
}
