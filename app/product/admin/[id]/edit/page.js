'use client'

import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useParams, useRouter } from 'next/navigation'
import styles from './adminProductEdit.module.scss'

export default function AdminProductEditPage() {
  const { id } = useParams()
  const router = useRouter()

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
    start_at: '',
    end_at: '',
    notice: '',
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [filteredSubcategories, setFilteredSubcategories] = useState([])

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [activeVariantTypes, setActiveVariantTypes] = useState([])
  const [variantGroups, setVariantGroups] = useState([])
  const [specifications, setSpecifications] = useState([])

  const categoryVariantMap = {
    1: [1],
    2: [1],
    3: [2],
    4: [4],
    5: [2],
    6: [1, 4],
    7: [2, 3],
  }

  // 初始化選項
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3005/api/product/products/brands'),
      fetch('http://localhost:3005/api/product/products/categories'),
      fetch('http://localhost:3005/api/product/products/subcategories'),
      fetch('http://localhost:3005/api/product/products/variant-types'),
      fetch('http://localhost:3005/api/product/products/variant-options'),
      fetch(`http://localhost:3005/api/product/products/${id}`),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([b, c, s, t, o, p]) => {
        setBrands(b.data.brands)
        setCategories(c.data.categories)
        setSubcategories(s.data.subcategories)
        setVariantTypes(t.data.variantTypes)
        setVariantOptions(o.data.variantOptions)

        const prod = p.data.product
        setProduct({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          brand_id: prod.brand_id,
          category_id: prod.category_id,
          subcategory_id: prod.subcategory_id,
          valid: prod.valid,
          start_at: prod.start_at?.slice(0, 16),
          end_at: prod.end_at?.slice(0, 16),
          notice: prod.notice,
        })
        setSelectedCategoryId(prod.category_id)
        setImagePreviews(
          prod.product_images.map((img) => `http://localhost:3005${img.image}`)
        )
        setSpecifications(
          prod.product_specifications.map((s) => ({
            title: s.title,
            content: s.value,
          }))
        )
        setVariantGroups(
          prod.variantCombinations.map((v) => ({
            optionIds: Object.fromEntries(
              v.optionIds.map((oid, i) => [prod.variantTypes[i]?.id, oid])
            ),
            price: v.price,
            stock: v.stock,
          }))
        )
      })
  }, [id])

  useEffect(() => {
    const filtered = subcategories.filter(
      (s) => s.categoryId === Number(selectedCategoryId)
    )
    setFilteredSubcategories(filtered)

    const cid = Number(selectedCategoryId)
    const allowedTypes = categoryVariantMap[cid] || []
    setActiveVariantTypes(allowedTypes)
  }, [selectedCategoryId, subcategories])

  const updateSpecification = (index, key, value) => {
    const newSpecs = [...specifications]
    newSpecs[index][key] = value
    setSpecifications(newSpecs)
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

  const addSpecification = () => {
    setSpecifications([...specifications, { title: '', content: '' }])
  }

  const addVariantGroup = () => {
    setVariantGroups([
      ...variantGroups,
      { optionIds: {}, price: '', stock: '' },
    ])
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 6) {
      Swal.fire('最多只能上傳 6 張圖片')
      return
    }
    setImages(files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const handleUpdate = async () => {
    const start = new Date(product.start_at)
    const end = new Date(product.end_at)

    if (end < start) {
      Swal.fire('錯誤', '結束時間不能早於上架時間', 'error')
      return
    }

    const formData = new FormData()
    Object.entries(product).forEach(([key, value]) =>
      formData.append(key, value)
    )
    formData.append('variants', JSON.stringify(variantGroups))
    formData.append('specifications', JSON.stringify(specifications))

    images.forEach((img) => formData.append('images', img))

    try {
      const res = await fetch(
        `http://localhost:3005/api/product/products/${id}`,
        {
          method: 'PATCH',
          body: formData,
        }
      )
      const data = await res.json()
      if (res.ok) {
        Swal.fire('編輯成功', `商品 ID：${id}`, 'success')
        router.push('/product/admin')
      } else {
        Swal.fire('錯誤', data.error || '編輯失敗', 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('錯誤', '伺服器連線失敗', 'error')
    }
  }

  return (
    <section className={styles.formSection}>
      <h1>編輯商品</h1>
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
            上架時間
            <input
              type="datetime-local"
              value={product.start_at || ''}
              onChange={(e) =>
                setProduct({ ...product, start_at: e.target.value })
              }
            />
          </label>

          <label style={{ flex: 1 }}>
            結束時間
            <input
              type="datetime-local"
              value={product.end_at || ''}
              onChange={(e) =>
                setProduct({ ...product, end_at: e.target.value })
              }
            />
          </label>
        </div>

        <label>
          商品注意事項
          <textarea
            value={product.notice}
            onChange={(e) => setProduct({ ...product, notice: e.target.value })}
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
              value={String(product.brand_id || '')}
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

        <div className={styles.specificationBlock}>
          <h3>商品規格</h3>
          {specifications.map((spec, index) => (
            <div key={index} className={styles.specificationItem}>
              <input
                type="text"
                placeholder="標題（如：材質）"
                value={spec.title}
                onChange={(e) =>
                  updateSpecification(index, 'title', e.target.value)
                }
              />
              <input
                type="text"
                placeholder="內容（如：棉 100%）"
                value={spec.content}
                onChange={(e) =>
                  updateSpecification(index, 'content', e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            className={styles.addSpecButton}
            onClick={addSpecification}
          >
            新增一組規格
          </button>
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
          onClick={handleUpdate}
        >
          更新商品
        </button>
      </form>{' '}
    </section>
  )
}
