'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CreatableSelect from 'react-select/creatable'
import Swal from 'sweetalert2'

function EditArticle() {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    content1: '',
    category: '',
  })

  const [categoryOptions, setCategoryOptions] = useState([
    { value: '營養與飲食', label: '營養與飲食' },
    { value: '行為與訓練', label: '行為與訓練' },
    { value: '健康與保健', label: '健康與保健' },
    { value: '戶外活動與探險', label: '戶外活動與探險' },
  ])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [imageFiles, setImageFiles] = useState([])
  const [previewSrcs, setPreviewSrcs] = useState([])

  // 載入文章資料
  useEffect(() => {
    if (!id) return

    fetch(`http://localhost:3005/api/article/article-detail/${id}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const { title, content1, category_name, article_images } = data.result
          setFormData({ title, content1, category: category_name })

          const matchedOption = categoryOptions.find(
            (opt) => opt.label === category_name
          ) || {
            label: category_name,
            value: category_name,
          }
          setSelectedCategory(matchedOption)

          try {
            const imageArray = article_images ? JSON.parse(article_images) : []
            setPreviewSrcs(
              imageArray.map((img) => `http://localhost:3005${img}`)
            )
          } catch {
            setPreviewSrcs([])
          }
        } else {
          Swal.fire('錯誤', '無法載入文章資料: ' + data.message, 'error')
        }
      })
      .catch(() => {
        Swal.fire('錯誤', '載入文章資料失敗', 'error')
      })
  }, [id, categoryOptions])

  // 表單輸入變更
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 分類選擇改變
  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue)
  }

  // 圖片選擇改變
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)

    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((previews) => {
      setPreviewSrcs(previews)
    })
  }

  // 表單送出 (更新)
  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('title', formData.title)
    data.append('content1', formData.content1)
    if (selectedCategory) {
      data.append('category', selectedCategory.label)
    }

    for (const file of imageFiles) {
      data.append('images', file)
    }

    try {
      const res = await fetch(
        `http://localhost:3005/api/article/article-detail/update/${id}`,
        {
          method: 'PATCH',
          body: data,
          credentials: 'include',
        }
      )
      const result = await res.json()

      if (result.success) {
        Swal.fire('成功', '文章更新成功', 'success').then(() => {
          router.push(`/article/article-detail/${id}`)
        })
      } else if (res.status === 403) {
        Swal.fire('權限不足', '你沒有權限修改此文章', 'warning')
      } else {
        Swal.fire('錯誤', '更新失敗: ' + result.message, 'error')
      }
    } catch (err) {
      Swal.fire('錯誤', '發生錯誤: ' + err.message, 'error')
    }
  }

  // 刪除文章
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '確定要刪除這篇文章嗎？',
      text: '此操作不可恢復！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '是的，刪除',
      cancelButtonText: '取消',
    })

    if (!result.isConfirmed) return

    try {
      const res = await fetch(
        `http://localhost:3005/api/article/article-detail/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      const result = await res.json()
      if (result.success) {
        Swal.fire('成功', '文章刪除成功', 'success').then(() => {
          router.push('/article')
        })
      } else {
        Swal.fire('錯誤', '刪除失敗: ' + result.message, 'error')
      }
    } catch (error) {
      Swal.fire('錯誤', '刪除時發生錯誤: ' + error.message, 'error')
    }
  }

  return (
    <div className="post-art card shadow p-4 mt-5">
      <h2 className="mb-4">編輯文章</h2>
      <form onSubmit={handleSubmit}>
        {/* 分類 */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            文章分類
          </label>
          <CreatableSelect
            id="category"
            name="category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            isClearable
            placeholder="請選擇或新增分類"
          />
        </div>

        {/* 標題 */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            文章標題
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 內容 */}
        <div className="mb-3">
          <label htmlFor="content1" className="form-label">
            文章內容
          </label>
          <textarea
            name="content1"
            className="form-control"
            id="content1"
            rows="5"
            value={formData.content1}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {/* 圖片上傳 */}
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            上傳新圖片（可選）
          </label>
          <input
            className="form-control"
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="preview-group mt-3">
            {previewSrcs.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`預覽圖 ${index + 1}`}
                className="preview-img"
                style={{ width: '120px', marginRight: '10px' }}
              />
            ))}
          </div>
        </div>

        {/* 按鈕區 */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-danger delete-btn"
            onClick={handleDelete}
          >
            刪除文章
          </button>

          <button type="submit" className="btn btn-primary replay-btn">
            更新文章
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditArticle

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import CreatableSelect from 'react-select/creatable'

// function EditArticle() {
//   const { id } = useParams()
//   const router = useRouter()

//   const [formData, setFormData] = useState({
//     title: '',
//     content1: '',
//     category: '',
//   })

//   const [categoryOptions, setCategoryOptions] = useState([
//     { value: '營養與飲食', label: '營養與飲食' },
//     { value: '行為與訓練', label: '行為與訓練' },
//     { value: '健康與保健', label: '健康與保健' },
//     { value: '戶外活動與探險', label: '戶外活動與探險' },
//   ])
//   const [selectedCategory, setSelectedCategory] = useState(null)

//   const [imageFiles, setImageFiles] = useState([])
//   const [previewSrcs, setPreviewSrcs] = useState([])

//   // 載入文章資料
//   useEffect(() => {
//     if (!id) return

//     fetch(`http://localhost:3005/api/article/article-detail/${id}`, {
//       credentials: 'include',
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           const { title, content1, category_name, article_images } = data.result
//           setFormData({ title, content1, category: category_name })

//           // 找出匹配的分類選項或新增新的
//           const matchedOption = categoryOptions.find(
//             (opt) => opt.label === category_name
//           ) || {
//             label: category_name,
//             value: category_name,
//           }
//           setSelectedCategory(matchedOption)

//           // 圖片預覽處理（防止 article_images 為 null）
//           try {
//             const imageArray = article_images ? JSON.parse(article_images) : []
//             setPreviewSrcs(
//               imageArray.map((img) => `http://localhost:3005${img}`)
//             )
//           } catch {
//             setPreviewSrcs([])
//           }
//         } else {
//           alert('無法載入文章資料: ' + data.message)
//         }
//       })
//       .catch(() => {
//         alert('載入文章資料失敗')
//       })
//   }, [id, categoryOptions])

//   // 表單輸入變更
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   // 分類選擇改變
//   const handleCategoryChange = (newValue) => {
//     setSelectedCategory(newValue)
//   }

//   // 圖片選擇改變
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files)
//     setImageFiles(files)

//     // 產生圖片預覽 base64
//     const readers = files.map(
//       (file) =>
//         new Promise((resolve) => {
//           const reader = new FileReader()
//           reader.onloadend = () => resolve(reader.result)
//           reader.readAsDataURL(file)
//         })
//     )
//     Promise.all(readers).then((previews) => {
//       setPreviewSrcs(previews)
//     })
//   }

//   // 表單送出 (更新)
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const data = new FormData()
//     data.append('title', formData.title)
//     data.append('content1', formData.content1)
//     if (selectedCategory) {
//       data.append('category', selectedCategory.label)
//     }

//     for (const file of imageFiles) {
//       data.append('images', file)
//     }

//     try {
//       const res = await fetch(
//         `http://localhost:3005/api/article/article-detail/update/${id}`,
//         {
//           method: 'PATCH',
//           body: data,
//           credentials: 'include',
//         }
//       )
//       const result = await res.json()

//       if (result.success) {
//         alert('文章更新成功')
//         router.push(`/article/article-detail/${id}`)
//       } else if (res.status === 403) {
//         alert('你沒有權限修改此文章')
//       } else {
//         alert('更新失敗: ' + result.message)
//       }
//     } catch (err) {
//       alert('發生錯誤: ' + err.message)
//     }
//   }

//   // 刪除文章
//   const handleDelete = async () => {
//     const confirmDelete = window.confirm(
//       '確定要刪除這篇文章嗎？此操作不可恢復！'
//     )
//     if (!confirmDelete) return

//     try {
//       const res = await fetch(
//         `http://localhost:3005/api/article/article-detail/delete/${id}`,
//         {
//           method: 'DELETE',
//           credentials: 'include',
//         }
//       )
//       const result = await res.json()
//       if (result.success) {
//         alert('文章刪除成功')
//         router.push('/article') // 刪除成功後導回文章列表
//       } else {
//         alert('刪除失敗: ' + result.message)
//       }
//     } catch (error) {
//       alert('刪除時發生錯誤: ' + error.message)
//     }
//   }

//   return (
//     <div className="post-art card shadow p-4 mt-5">
//       <h2 className="mb-4">編輯文章</h2>
//       <form onSubmit={handleSubmit}>
//         {/* 分類 */}
//         <div className="mb-3">
//           <label htmlFor="category" className="form-label">
//             文章分類
//           </label>
//           <CreatableSelect
//             id="category"
//             name="category"
//             options={categoryOptions}
//             value={selectedCategory}
//             onChange={handleCategoryChange}
//             isClearable
//             placeholder="請選擇或新增分類"
//           />
//         </div>

//         {/* 標題 */}
//         <div className="mb-3">
//           <label htmlFor="title" className="form-label">
//             文章標題
//           </label>
//           <input
//             type="text"
//             name="title"
//             id="title"
//             className="form-control"
//             value={formData.title}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* 內容 */}
//         <div className="mb-3">
//           <label htmlFor="content1" className="form-label">
//             文章內容
//           </label>
//           <textarea
//             name="content1"
//             className="form-control"
//             id="content1"
//             rows="5"
//             value={formData.content1}
//             onChange={handleInputChange}
//             required
//           ></textarea>
//         </div>

//         {/* 圖片上傳 */}
//         <div className="mb-3">
//           <label htmlFor="images" className="form-label">
//             上傳新圖片（可選）
//           </label>
//           <input
//             className="form-control"
//             type="file"
//             id="images"
//             name="images"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//           />
//           <div className="preview-group mt-3">
//             {previewSrcs.map((src, index) => (
//               <img
//                 key={index}
//                 src={src}
//                 alt={`預覽圖 ${index + 1}`}
//                 className="preview-img"
//                 style={{ width: '120px', marginRight: '10px' }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* 按鈕區 */}
//         <div className="d-flex justify-content-between">
//           <button
//             type="button"
//             className="btn btn-danger delete-btn"
//             onClick={handleDelete}
//           >
//             刪除文章
//           </button>

//           <button type="submit" className="btn btn-primary replay-btn">
//             更新文章
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EditArticle
