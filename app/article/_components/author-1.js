import React, { useState } from 'react'

const getFullImagePath = (path, type) => {
  if (!path) return null
  if (path.startsWith('http')) return path

  if (type === 'author') return `/member/member_images/${path}`
  if (type === 'dog') return `/member/dogs_images/${path}`

  return null
}

const Author = ({ article = {} }) => {
  const handleClick = (who) => {
    console.log(`${who} 被點擊！可以在這裡加你的新功能。`)
  }

  const isArticleEmpty = !article || Object.keys(article).length === 0
  const hasDog = article.dogs_name && article.dogs_image_url

  // 印出 debug
  console.log('作者圖片路徑:', article.member_image_url)
  const authorImage = getFullImagePath(article.member_image_url, 'author')
  console.log('完整作者圖片路徑:', authorImage)

  const qaCards = [
    isArticleEmpty
      ? {
          id: 'no-author',
          title: '尚未取得主人資料',
          text: '',
          image: null,
          fallback: '/member/member_images/2025-04-22153116.png', // 你的 fallback 圖片
          onClick: () => {},
        }
      : {
          id: 'author',
          title: `作者：${article.member_username || '未知作者'}`,
          text: '',
          image: authorImage,
          fallback: '/member/member_images/2025-04-22153116.png',
          onClick: () =>
            handleClick(`作者 ${article.member_username || '未知作者'}`),
        },
    !hasDog
      ? {
          id: 'no-dog',
          title: '尚未取得狗狗資料',
          text: '',
          image: null,
          fallback: '/member/dogs_images/default-dog.png',
          onClick: () => {},
        }
      : {
          id: 'dog',
          title: `毛孩：${article.dogs_name || '未知毛孩'}`,
          text: `品種：${article.dogs_breed || '未知品種'}`,
          image: getFullImagePath(article.dogs_image_url, 'dog'),
          fallback: '/member/dogs_images/default-dog.png',
          onClick: () => handleClick(`毛孩 ${article.dogs_name || '未知毛孩'}`),
        },
  ]

  // 單張卡片圖片 render，有錯誤時 fallback
  const ImageWithFallback = ({ src, fallback, alt }) => {
    const [imgSrc, setImgSrc] = useState(src || fallback)
    return (
      <img
        src={imgSrc}
        alt={alt}
        width={100}
        height={100}
        onError={() => {
          if (imgSrc !== fallback) setImgSrc(fallback)
        }}
        className="rounded-circle me-4 object-fit-cover"
      />
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {qaCards.map((card) => (
          <div
            key={card.id}
            className="col-md-5 col-10 mb-4"
            style={{ cursor: 'pointer' }}
            onClick={card.onClick}
          >
            <div className="card p-3 border-0 shadow-sm h-100">
              <div className="d-flex align-items-center">
                <ImageWithFallback
                  src={card.image}
                  fallback={card.fallback}
                  alt={card.title}
                />
                <div>
                  <h5 className="mb-2">{card.title}</h5>
                  <p className="mb-0 text-muted">{card.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Author

// import React from 'react'
// import Image from 'next/image'

// const getFullImagePath = (path, type) => {
//   if (!path) return ''
//   if (path.startsWith('http')) return path // 完整網址直接用

//   // 不是完整網址，自己組成 public 目錄下路徑
//   if (type === 'author') return `/member/member_images/${path}`
//   if (type === 'dog') return `/member/dogs_images/${path}`

//   return path
// }

// const Author = ({ article = {} }) => {
//   const handleClick = (who) => {
//     console.log(`${who} 被點擊！可以在這裡加你的新功能。`)
//   }

//   const isArticleEmpty = !article || Object.keys(article).length === 0
//   // 這裡改成判斷新欄位是否有值
//   const hasDog = article.dogs_name && article.dogs_image_url

//   const qaCards = [
//     isArticleEmpty
//       ? {
//           id: 'no-author',
//           title: '尚未取得主人資料',
//           text: '',
//           image: '/default_author.jpg',
//           onClick: () => {},
//         }
//       : {
//           id: 'author',
//           title: `作者：${article.member_username || '未知作者'}`,
//           text: '',
//           // 改用 member_image_url
//           image:
//             getFullImagePath(article.member_image_url, 'author') ||
//             '/default_author.jpg',
//           onClick: () =>
//             handleClick(`作者 ${article.member_username || '未知作者'}`),
//         },
//     !hasDog
//       ? {
//           id: 'no-dog',
//           title: '尚未取得狗狗資料',
//           text: '',
//           image: '/member/dogs_images/default-dog.png',
//           onClick: () => {},
//         }
//       : {
//           id: 'dog',
//           title: `毛孩：${article.dogs_name || '未知毛孩'}`,
//           text: `品種：${article.dogs_breed || '未知品種'}`,
//           // 改用 dogs_image_url
//           image:
//             getFullImagePath(article.dogs_image_url, 'dog') ||
//             '/default-dog.png',
//           onClick: () => handleClick(`毛孩 ${article.dogs_name || '未知毛孩'}`),
//         },
//   ]

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         {qaCards.map((card) => (
//           <div
//             key={card.id}
//             className="col-md-5 col-10 mb-4"
//             style={{ cursor: 'pointer' }}
//             onClick={card.onClick}
//           >
//             <div className="card p-3 border-0 shadow-sm h-100">
//               <div className="d-flex align-items-center">
//                 <Image
//                   src={card.image}
//                   width={100}
//                   height={100}
//                   alt={card.title}
//                   className="rounded-circle me-4 object-fit-cover"
//                 />
//                 <div>
//                   <h5 className="mb-2">{card.title}</h5>
//                   <p className="mb-0 text-muted">{card.text}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Author
