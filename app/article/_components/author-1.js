import React, { useState } from 'react'

const baseUrl = 'http://localhost:3005'

const Author = ({ article = {} }) => {
  const timestamp = new Date().getTime()

  const getFullImagePath = (path, type) => {
    if (!path) return null
    if (typeof path !== 'string') return null

    if (path.startsWith('http')) {
      return `${path}?t=${timestamp}`
    } else if (path.startsWith('/')) {
      return `${baseUrl}${path}?t=${timestamp}`
    } else {
      let folder = ''
      if (type === 'author') folder = '/member/member_images/'
      else if (type === 'dog') folder = '/dogs_images/'
      else folder = '/'
      return `${baseUrl}${folder}${path}?t=${timestamp}`
    }
  }

  // 處理 dogs_image_url 支援：JSON 字串 / 陣列 / 單字串
  const parseDogsImages = (input) => {
    if (!input) return []
    if (Array.isArray(input)) return input.filter(Boolean)

    if (typeof input === 'string') {
      // 嘗試解析 JSON 字串
      try {
        const parsed = JSON.parse(input)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
        if (typeof parsed === 'string') return [parsed].filter(Boolean)
        return []
      } catch {
        // 解析失敗當作單純字串
        return [input].filter(Boolean)
      }
    }
    return []
  }

  const dogsImages = parseDogsImages(article.dogs_image_url)
  const dogImage =
    dogsImages.length > 0 ? getFullImagePath(dogsImages[0], 'dog') : null
  const hasDog = article.dogs_name && dogImage

  const isArticleEmpty = !article || Object.keys(article).length === 0

  const authorImage = getFullImagePath(
    article.member_image_url || article.image_url,
    'author'
  )

  const handleClick = (who) => {
    console.log(`${who} 被點擊！可以在這裡加你的新功能。`)
  }

  const qaCards = [
    isArticleEmpty
      ? {
          id: 'no-author',
          title: '尚未取得主人資料',
          text: '',
          image: null,
          fallback: '/member/member_images/user-img.svg',
          onClick: () => {},
        }
      : {
          id: 'author',
          title: `作者：${article.member_username || '未知作者'}`,
          text: '',
          image: authorImage,
          fallback: '/member/member_images/user-img.svg',
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
          image: dogImage,
          fallback: '/member/dogs_images/default-dog.png',
          onClick: () => handleClick(`毛孩 ${article.dogs_name || '未知毛孩'}`),
        },
  ]

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

// import React, { useState } from 'react'

// const baseUrl = 'http://localhost:3005'

// const Author = ({ article = {} }) => {
//   const timestamp = new Date().getTime()

//   const getFullImagePath = (path, type) => {
//     if (!path) return null
//     if (typeof path !== 'string') return null
//     if (path.startsWith('http')) return `${path}?t=${timestamp}`
//     if (path.startsWith('/')) return `${baseUrl}${path}?t=${timestamp}`
//     if (type === 'author')
//       return `${baseUrl}/member/member_images/${path}?t=${timestamp}`
//     if (type === 'dog')
//       return `${baseUrl}/dogs_images/${path}?t=${timestamp}`
//     return null
//   }

//   const handleClick = (who) => {
//     console.log(`${who} 被點擊！可以在這裡加你的新功能。`)
//   }

//   const isArticleEmpty = !article || Object.keys(article).length === 0

//   const authorImage = getFullImagePath(
//     article.member_image_url || article.image_url,
//     'author'
//   )

//   // 狗狗圖片處理，article.dogs_image_url 可能是陣列或字串
//   const dogsImages = Array.isArray(article.dogs_image_url)
//     ? article.dogs_image_url
//     : [article.dogs_image_url]
//   const dogImage = getFullImagePath(dogsImages[0], 'dog')

//   const hasDog = article.dogs_name && dogImage

//   const qaCards = [
//     isArticleEmpty
//       ? {
//           id: 'no-author',
//           title: '尚未取得主人資料',
//           text: '',
//           image: null,
//           fallback: '/member/member_images/user-img.svg',
//           onClick: () => {},
//         }
//       : {
//           id: 'author',
//           title: `作者：${article.member_username || '未知作者'}`,
//           text: '',
//           image: authorImage,
//           fallback: '/member/member_images/user-img.svg',
//           onClick: () =>
//             handleClick(`作者 ${article.member_username || '未知作者'}`),
//         },
//     !hasDog
//       ? {
//           id: 'no-dog',
//           title: '尚未取得狗狗資料',
//           text: '',
//           image: null,
//           fallback: '/member/dogs_images/default-dog.png',
//           onClick: () => {},
//         }
//       : {
//           id: 'dog',
//           title: `毛孩：${article.dogs_name || '未知毛孩'}`,
//           text: `品種：${article.dogs_breed || '未知品種'}`,
//           image: dogImage,
//           fallback: '/member/dogs_images/default-dog.png',
//           onClick: () => handleClick(`毛孩 ${article.dogs_name || '未知毛孩'}`),
//         },
//   ]

//   const ImageWithFallback = ({ src, fallback, alt }) => {
//     const [imgSrc, setImgSrc] = useState(src || fallback)

//     return (
//       <img
//         src={imgSrc}
//         alt={alt}
//         width={100}
//         height={100}
//         onError={() => {
//           if (imgSrc !== fallback) setImgSrc(fallback)
//         }}
//         className="rounded-circle me-4 object-fit-cover"
//       />
//     )
//   }

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
//                 <ImageWithFallback
//                   src={card.image}
//                   fallback={card.fallback}
//                   alt={card.title}
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
