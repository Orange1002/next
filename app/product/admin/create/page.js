'use client'

import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import styles from './adminProductCreate.module.scss'

export default function AdminProductCreatePage() {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [variantTypes, setVariantTypes] = useState([])
  const [variantOptions, setVariantOptions] = useState([])

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    brand_id: '',
    category_id: '',
    subcategory_id: '',
    valid: 'true',
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [filteredSubcategories, setFilteredSubcategories] = useState([])

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [activeVariantTypes, setActiveVariantTypes] = useState([])
  const [variantGroups, setVariantGroups] = useState([
    {
      optionIds: {},
      price: '',
      stock: '',
    },
  ])

  const categoryVariantMap = {
    1: [1],
    2: [1],
    3: [2],
    4: [4],
    5: [2],
    6: [1, 4],
    7: [2, 3],
  }

  useEffect(() => {
    fetch('http://localhost:3005/api/product/products/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data?.data?.brands || []))

    fetch('http://localhost:3005/api/product/products/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data?.data?.categories || []))

    fetch('http://localhost:3005/api/product/products/subcategories')
      .then((res) => res.json())
      .then((data) => setSubcategories(data?.data?.subcategories || []))

    fetch('http://localhost:3005/api/product/products/variant-types')
      .then((res) => res.json())
      .then((data) => setVariantTypes(data?.data?.variantTypes || []))

    fetch('http://localhost:3005/api/product/products/variant-options')
      .then((res) => res.json())
      .then((data) => setVariantOptions(data?.data?.variantOptions || []))
  }, [])

  useEffect(() => {
    const filtered = subcategories.filter(
      (s) => s.categoryId === Number(selectedCategoryId)
    )
    setFilteredSubcategories(filtered)

    const cid = Number(selectedCategoryId)
    const allowedTypes = categoryVariantMap[cid] || []
    setActiveVariantTypes(allowedTypes)
    setVariantGroups([
      {
        optionIds: {},
        price: '',
        stock: '',
      },
    ])
  }, [selectedCategoryId])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 6) {
      Swal.fire('最多只能上傳 6 張圖片')
      return
    }
    if (files.length < 1) {
      Swal.fire('請至少上傳一張圖片')
      return
    }
    setImages(files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const addVariantGroup = () => {
    const variant = {
      optionIds: {},
      price: '',
      stock: '',
    }
    setVariantGroups([...variantGroups, variant])
  }

  const updateVariantGroup = (index, key, value) => {
    const newGroups = [...variantGroups]
    if (key === 'optionIds') {
      newGroups[index].optionIds = { ...newGroups[index].optionIds, ...value }
    } else {
      newGroups[index][key] = value
    }
    setVariantGroups(newGroups)
  }

  const handleSubmit = async () => {
    if (!images.length) {
      Swal.fire('請上傳至少一張圖片')
      return
    }

    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', product.price)
    formData.append('brand_id', product.brand_id)
    formData.append('category_id', product.category_id)
    formData.append('subcategory_id', product.subcategory_id)

    images.forEach((img) => {
      formData.append('images', img)
    })

    formData.append('variants', JSON.stringify(variantGroups))

    try {
      const res = await fetch('http://localhost:3005/api/product/products', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        Swal.fire('新增成功', `商品 ID：${data.productId}`, 'success')
      } else {
        Swal.fire('錯誤', data.error || '新增失敗', 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('錯誤', '伺服器連線失敗', 'error')
    }
  }

  return (
    <section className={styles.formSection}>
      <h1>新增商品</h1>
      <form className={styles.form}>
        <label>
          商品名稱
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </label>

        <label>
          商品描述
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </label>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ flex: 1 }}>
            價格
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </label>

          <label style={{ flex: 1 }}>
            品牌
            <select
              value={product.brand_id}
              onChange={(e) =>
                setProduct({ ...product, brand_id: e.target.value })
              }
            >
              <option value="">請選擇品牌</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ flex: 1 }}>
            主分類
            <select
              value={product.category_id}
              onChange={(e) => {
                setProduct({ ...product, category_id: e.target.value })
                setSelectedCategoryId(e.target.value)
              }}
            >
              <option value="">請選擇主分類</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ flex: 1 }}>
            子分類
            <select
              value={product.subcategory_id}
              onChange={(e) =>
                setProduct({ ...product, subcategory_id: e.target.value })
              }
            >
              <option value="">請選擇子分類</option>
              {filteredSubcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          上傳圖片（最多6張）
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </label>

        <div className={styles.imagePreviewGroup}>
          {imagePreviews.map((src, i) => (
            <div key={i} className={styles.imagePreview}>
              <img src={src} alt={`預覽圖 ${i + 1}`} />
            </div>
          ))}
        </div>

        {selectedCategoryId && (
          <div className={styles.variantBlock}>
            <h3>規格（依分類顯示）</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={addVariantGroup}
            >
              新增
            </button>

            {variantGroups.map((group, index) => (
              <div key={index} className={styles.variantItem}>
                {activeVariantTypes.map((typeId) => (
                  <select
                    key={typeId}
                    value={group.optionIds[typeId] || ''}
                    onChange={(e) =>
                      updateVariantGroup(index, 'optionIds', {
                        [typeId]: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">
                      選擇{variantTypes.find((t) => t.id === typeId)?.name}
                    </option>
                    {variantOptions
                      .filter((opt) => opt.typeId === typeId)
                      .map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                  </select>
                ))}
                {index > 0 && (
                  <input
                    placeholder="價格增加"
                    type="number"
                    value={group.price}
                    onChange={(e) =>
                      updateVariantGroup(index, 'price', e.target.value)
                    }
                  />
                )}
                <input
                  placeholder="庫存"
                  type="number"
                  value={group.stock}
                  onChange={(e) =>
                    updateVariantGroup(index, 'stock', e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
        >
          建立商品
        </button>
      </form>
    </section>
  )
}
