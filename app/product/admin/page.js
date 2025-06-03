'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import styles from './adminProductList.module.scss'
import Pagination from './_components/pagination/Pagination'

export default function AdminProductIndexPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchName, setSearchName] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const perPage = 10

  useEffect(() => {
    fetch('http://localhost:3005/api/product/products/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.data.categories || []))
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams({
        type: 'all',
        page: currentPage,
        perpage: perPage,
      })
      if (selectedCategory) params.set('category_ids', selectedCategory)
      if (searchName) params.set('name_like', searchName)

      const res = await fetch(
        `http://localhost:3005/api/product/products?${params.toString()}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      setProducts(data.data?.products || [])
      setTotalPages(data.data?.pageCount || 1)
      setLoading(false)
    }
    fetchProducts()
  }, [currentPage, selectedCategory, searchName])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '確認刪除？',
      text: '刪除後無法恢復，請再次確認',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
    })

    if (!result.isConfirmed) return

    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (res.ok) {
      Swal.fire('已刪除', '', 'success')
      setProducts(products.filter((p) => p.id !== id))
    } else {
      Swal.fire('刪除失敗', data.error || '發生錯誤', 'error')
    }
  }

  const toggleValid = async (id, currentValid) => {
    const res = await fetch(`/api/products/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: !currentValid }),
    })
    const data = await res.json()
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, valid: !currentValid } : p))
      )
    } else {
      Swal.fire('更新狀態失敗', data.error || '發生錯誤', 'error')
    }
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.adminContainer}>
        <div className={styles.header}>
          <h1>商品管理</h1>
          <div className={styles.actions}>
            <input
              type="text"
              placeholder="搜尋商品名稱"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">所有分類</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button onClick={() => router.push('/product/admin/create')}>
              新增商品
            </button>
          </div>
        </div>

        {loading ? (
          <p>載入中...</p>
        ) : (
          <>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>圖片</th>
                  <th>名稱</th>
                  <th>價格</th>
                  <th>品牌</th>
                  <th>分類</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img
                        src={p.product_images?.[0]?.image || '/fallback.jpg'}
                        alt={p.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.brand?.name || '-'}</td>
                    <td>{p.productCategory?.name || '-'}</td>
                    <td>
                      <button
                        className={p.valid ? styles.valid : styles.invalid}
                        onClick={() => toggleValid(p.id, p.valid)}
                      >
                        {p.valid ? '上架中' : '已下架'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.btnContainer}>
                        <button
                          className={styles.editBtn}
                          onClick={() =>
                            router.push(`/product/admin/${p.id}/edit`)
                          }
                        >
                          編輯
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(p.id)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  )
}
