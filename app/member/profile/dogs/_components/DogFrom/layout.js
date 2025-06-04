'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './layout.module.css'
import Image from 'next/image'
import CancelButton from '../../../../_components/BtnCustomGray/layout'
import SubmitButton from '../../../../_components/BtnCustom/layout'

const DEFAULT_IMAGE = '/member/dogs_images/default-dog.png'

export default function DogForm({ initialData = {}, onSubmit }) {
  const inputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: '',
    description: '',
    photo: null, // 實際檔案
    preview: DEFAULT_IMAGE, // 預覽圖
    ...initialData,
  })

  useEffect(() => {
    if (initialData.photo && typeof initialData.photo === 'string') {
      setFormData((prev) => ({ ...prev, preview: initialData.photo }))
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        preview: URL.createObjectURL(file),
      }))
    }
  }

  const clearSelectedFile = () => {
    // 清空 input 欄位 & 回復為 initial 或 default 圖
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setFormData((prev) => ({
      ...prev,
      photo: null,
      preview: initialData.photo || DEFAULT_IMAGE,
    }))
  }

  const resetToDefault = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setFormData((prev) => ({
      ...prev,
      photo: null,
      preview: DEFAULT_IMAGE,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 頭貼區塊 */}
      <div className="mb-3">
        <div className={styles.imagePreview}>
          <Image
            src={formData.preview}
            alt="狗狗照片"
            width={100}
            height={100}
            priority
            className="h-100 w-100 rounded border object-fit-cover"
          />
        </div>

        <label htmlFor="dogPhoto" className="form-label mt-2">
          上傳狗狗照片
        </label>
        <input
          id="dogPhoto"
          type="file"
          className="form-control"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
        />

        <div className="d-flex justify-content-center gap-2 mt-2">
          {/* 刪除已選頭貼：有 photo（使用者剛選檔案） */}
          {formData.photo instanceof File && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={clearSelectedFile}
            >
              刪除已選頭貼
            </button>
          )}

          {/* 刪除頭貼（使用預設）：不是預設圖時才顯示 */}
          {formData.preview !== DEFAULT_IMAGE && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={resetToDefault}
            >
              刪除頭貼（使用預設頭貼）
            </button>
          )}
        </div>
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
          autoComplete="name"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="dogAge" className="form-label">
          年齡
        </label>
        <input
          id="dogAge"
          type="text"
          className="form-control"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
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
        ></textarea>
      </div>
      <div className="d-flex justify-content-center gap-5">
        <CancelButton to="/member/profile/dogs">取消</CancelButton>
        <SubmitButton to="/member/profile/dogs">儲存</SubmitButton>
      </div>
    </form>
  )
}
