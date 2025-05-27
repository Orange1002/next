import React from 'react'
import Image from 'next/image'
import { AiOutlineRightCircle } from 'react-icons/ai'
import { FaRegHeart } from 'react-icons/fa'

const Card2 = ({ article }) => {
  let images = []
  try {
    images = article.article_images ? JSON.parse(article.article_images) : []
  } catch (err) {
    console.error('圖片 JSON 解析錯誤', err)
  }

  const firstImage =
    images.length > 0 ? images[0] : '/article_img/default-image.jpeg'

  const imageSrc = firstImage.startsWith('/')
    ? `http://localhost:3005${firstImage}`
    : firstImage

  return (
    <div className="card card-2 mt-4 d-none d-xl-block">
      <div className="row g-0">
        <div className="col-md-5">
          <Image
            src={imageSrc}
            alt={article.title || '文章圖片'}
            width={426}
            height={250}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-7">
          <div className="card-body pt-4">
            <div className="d-flex align-items-center mt-2">
              <a
                href={`/article/article-detail/${article.id}`}
                className="icon-link"
              >
                <AiOutlineRightCircle className="icon" />
              </a>
              <h5 className="card-title title-1 ms-2 mt-2">
                {article.title && article.title.length > 20
                  ? article.title.substring(0, 20) + '…'
                  : article.title}
              </h5>
            </div>
            <div>
              <p className="text-content text-break lh-base big-card">
                {article.content1 && article.content1.substring(0, 100)}
              </p>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <div>
                <p>
                  {article.created_date &&
                    new Date(article.created_date).toLocaleString()}
                </p>
              </div>
              <div className="d-flex align-items-center">
                <FaRegHeart className="card-icon card-i-hover" />
                <span className="ms-1">123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card2

// import React from 'react'
// import Image from 'next/image'
// import { AiOutlineRightCircle } from 'react-icons/ai'
// import { FaRegHeart } from 'react-icons/fa'

// const Card2 = ({ article }) => {
//   let images = []
//   try {
//     images = article.article_images ? JSON.parse(article.article_images) : []
//   } catch (err) {
//     console.error('圖片 JSON 解析錯誤', err)
//   }

//   const firstImage =
//     images.length > 0 ? images[0] : '/article_img/default-image.jpeg'

//   const imageSrc = firstImage.startsWith('/')
//     ? `http://localhost:3005${firstImage}`
//     : firstImage

//   return (
//     <div className="card card-2 mt-4 d-none d-xl-block">
//       <div className="row g-0">
//         <div className="col-md-5">
//           <Image
//             src={imageSrc}
//             alt={article.title || '文章圖片'}
//             width={426}
//             height={250}
//             style={{ objectFit: 'cover' }}
//           />
//         </div>
//         <div className="col-md-7">
//           <div className="card-body pt-4">
//             <div className="d-flex align-items-center mt-2">
//               <a href="你的連結網址" className="icon-link">
//                 <AiOutlineRightCircle className="icon" />
//               </a>
//               <h5 className="card-title title-1 ms-2 mt-2">
//                 {article.title && article.title.length > 20
//                   ? article.title.substring(0, 20) + '…'
//                   : article.title}
//               </h5>
//             </div>
//             <div>
//               <p className="text-content text-break lh-base big-card">
//                 {article.content1 && article.content1.substring(0, 100)}
//               </p>
//             </div>
//             <div className="d-flex justify-content-between mt-4">
//               <div>
//                 <p>
//                   {article.created_date &&
//                     new Date(article.created_date).toLocaleString()}
//                 </p>
//               </div>
//               <div className="d-flex align-items-center">
//                 <FaRegHeart className="card-icon card-i-hover" />
//                 <span className="ms-1">123</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Card2
