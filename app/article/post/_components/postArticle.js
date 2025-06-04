'use client'

import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
function PostArticle() {
  const router = useRouter()
  const [previewSrcs, setPreviewSrcs] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([
    { value: '1', label: '營養與飲食' },
    { value: '2', label: '行為與訓練' },
    { value: '3', label: '健康與保健' },
    { value: '4', label: '戶外活動與探險' },
    { value: '5', label: '分享狗狗的一切' },
  ])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue)
    console.log('選擇的分類:', newValue)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((previews) => {
      setPreviewSrcs(previews)
    })
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const form = e.target
  //   const formData = new FormData()

  //   formData.append('title', form.title.value)
  //   if (selectedCategory) {
  //     formData.append('category', selectedCategory.label)
  //   }
  //   formData.append('content1', form.content1.value)

  //   for (const file of imageFiles) {
  //     formData.append('images', file)
  //   }

  //   try {
  //     const res = await fetch(
  //       'http://localhost:3005/api/article/article-detail',
  //       {
  //         method: 'POST',
  //         body: formData,
  //         credentials: 'include',
  //       }
  //     )

  //     const data = await res.json()
  //     if (data.success) {
  //       alert('文章發表成功')
  //       router.push('/article/list')
  //       form.reset()
  //       setPreviewSrcs([])
  //       setImageFiles([])
  //       setSelectedCategory(null)
  //     } else {
  //       alert('發表失敗: ' + data.message)
  //     }
  //   } catch (err) {
  //     alert('發生錯誤: ' + err.message)
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData()

    formData.append('title', form.title.value)
    if (selectedCategory) {
      formData.append('category', selectedCategory.label)
    }
    formData.append('content1', form.content1.value)

    for (const file of imageFiles) {
      formData.append('images', file)
    }

    try {
      const res = await fetch(
        'http://localhost:3005/api/article/article-detail',
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      )

      const data = await res.json()
      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: '文章發表成功',
          showConfirmButton: false,
          timer: 1500,
        })
        router.push('/article/list')
        form.reset()
        setPreviewSrcs([])
        setImageFiles([])
        setSelectedCategory(null)
      } else {
        Swal.fire({
          icon: 'error',
          title: '發表失敗',
          text: data.message,
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '發生錯誤',
        text: err.message,
      })
    }
  }

  return (
    <div className="post-art card shadow p-4 mt-5">
      <h2 className="mb-4">發表新文章</h2>

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
            placeholder="輸入文章標題"
            required
          />
        </div>

        {/* 內容 */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            文章內容
          </label>
          <textarea
            name="content1"
            className="form-control"
            id="content"
            rows="5"
            placeholder="輸入文章內容..."
            required
          ></textarea>
        </div>

        {/* 圖片上傳 */}
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            上傳圖片
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
              />
            ))}
          </div>
        </div>

        {/* 送出按鈕 */}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn replay-btn">
            送出文章
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostArticle


// import React, { useState } from 'react'
// import CreatableSelect from 'react-select/creatable'
// import { useRouter } from 'next/navigation'
// import Swal from 'sweetalert2'
// function PostArticle() {
//   const router = useRouter()
//   const [previewSrcs, setPreviewSrcs] = useState([])
//   const [imageFiles, setImageFiles] = useState([])
//   const [categoryOptions, setCategoryOptions] = useState([
//     { value: '1', label: '營養與飲食' },
//     { value: '2', label: '行為與訓練' },
//     { value: '3', label: '健康與保健' },
//     { value: '4', label: '戶外活動與探險' },
//     { value: '5', label: '分享狗狗的一切' },
//   ])
//   const [selectedCategory, setSelectedCategory] = useState(null)

//   const handleCategoryChange = (newValue) => {
//     setSelectedCategory(newValue)
//     console.log('選擇的分類:', newValue)
//   }

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files)
//     setImageFiles(files)

//     const readers = files.map((file) => {
//       return new Promise((resolve) => {
//         const reader = new FileReader()
//         reader.onloadend = () => resolve(reader.result)
//         reader.readAsDataURL(file)
//       })
//     })

//     Promise.all(readers).then((previews) => {
//       setPreviewSrcs(previews)
//     })
//   }

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()
//   //   const form = e.target
//   //   const formData = new FormData()

//   //   formData.append('title', form.title.value)
//   //   if (selectedCategory) {
//   //     formData.append('category', selectedCategory.label)
//   //   }
//   //   formData.append('content1', form.content1.value)

//   //   for (const file of imageFiles) {
//   //     formData.append('images', file)
//   //   }

//   //   try {
//   //     const res = await fetch(
//   //       'http://localhost:3005/api/article/article-detail',
//   //       {
//   //         method: 'POST',
//   //         body: formData,
//   //         credentials: 'include',
//   //       }
//   //     )

//   //     const data = await res.json()
//   //     if (data.success) {
//   //       alert('文章發表成功')
//   //       router.push('/article/list')
//   //       form.reset()
//   //       setPreviewSrcs([])
//   //       setImageFiles([])
//   //       setSelectedCategory(null)
//   //     } else {
//   //       alert('發表失敗: ' + data.message)
//   //     }
//   //   } catch (err) {
//   //     alert('發生錯誤: ' + err.message)
//   //   }
//   // }
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const form = e.target
//     const formData = new FormData()

//     formData.append('title', form.title.value)
//     if (selectedCategory) {
//       formData.append('category', selectedCategory.label)
//     }
//     formData.append('content1', form.content1.value)

//     for (const file of imageFiles) {
//       formData.append('images', file)
//     }

//     try {
//       const res = await fetch(
//         'http://localhost:3005/api/article/article-detail',
//         {
//           method: 'POST',
//           body: formData,
//           credentials: 'include',
//         }
//       )

//       const data = await res.json()
//       if (data.success) {
//         await Swal.fire({
//           icon: 'success',
//           title: '文章發表成功',
//           showConfirmButton: false,
//           timer: 1500,
//         })
//         router.push('/article/list')
//         form.reset()
//         setPreviewSrcs([])
//         setImageFiles([])
//         setSelectedCategory(null)
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: '發表失敗',
//           text: data.message,
//         })
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: 'error',
//         title: '發生錯誤',
//         text: err.message,
//       })
//     }
//   }

//   return (
//     <div className="post-art card shadow p-4 mt-5">
//       <h2 className="mb-4">發表新文章</h2>

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
//             placeholder="輸入文章標題"
//             required
//           />
//         </div>

//         {/* 內容 */}
//         <div className="mb-3">
//           <label htmlFor="content" className="form-label">
//             文章內容
//           </label>
//           <textarea
//             name="content1"
//             className="form-control"
//             id="content"
//             rows="5"
//             placeholder="輸入文章內容..."
//             required
//           ></textarea>
//         </div>

//         {/* 圖片上傳 */}
//         <div className="mb-3">
//           <label htmlFor="images" className="form-label">
//             上傳圖片
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
//               />
//             ))}
//           </div>
//         </div>

//         {/* 送出按鈕 */}
//         <div className="d-flex justify-content-end">
//           <button type="submit" className="btn replay-btn">
//             送出文章
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default PostArticle
