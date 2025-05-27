import React from 'react'
import Image from 'next/image'

const Author = () => {
  const handleClick = (who) => {
    console.log(`${who} 被點擊！可以在這裡加你的新功能。`)
  }

  const qaCards = [
    {
      id: 1,
      title: '作者：Roger',
      text: '如何幫毛小孩整理毛髮？這我有經驗，我自己就是狗畜生',
      image: '/article_img/channels4_profile.jpg',
      onClick: () => handleClick('作者 Roger'),
    },
    {
      id: 2,
      title: '毛孩：皮皮',
      text: '每天刷毛讓我好舒服～汪！記得用我最愛的那把梳子喔！',
      image: '/article_img/channels4_profile.jpg', // 請自行放一張狗狗照片在 public 資料夾
      onClick: () => handleClick('毛孩 皮皮'),
    },
  ]

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
                <Image
                  src={card.image}
                  width={100}
                  height={100}
                  alt={card.title}
                  className="rounded-circle me-4 object-fit-cover"
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

// const PetQASection = () => {
//   const handleClick = () => {
//     // 在這裡執行你未來的新用途，例如導航、彈窗、跳轉、顯示說明等
//     console.log('客服 Roger 被點擊！可以在這裡加你的新功能。')
//   }

//   return (
//     <div className="row mt-5">
//       <div className="category d-flex justify-content-between mt-5 mb-5">
//         <p>寵物問答</p>
//         <div className="d-flex me-4"></div>
//       </div>

//       <div className="d-flex justify-content-center mb-5">
//         <div
//           className="card border-none service mt-5"
//           style={{ cursor: 'pointer', maxWidth: '600px', width: '100%' }}
//           onClick={handleClick}
//         >
//           <div className="row g-0">
//             <div className="col-md-4">
//               <Image
//                 width={200}
//                 height={200}
//                 src="./article_img/channels4_profile.jpg"
//                 className="img-fluid rounded-circle"
//                 alt="客服專員 Roger"
//               />
//             </div>
//             <div className="col-md-8">
//               <div className="card-body border-bottom pb-5">
//                 <h3 className="card-title mb-5 mt-2">客服專員: Roger</h3>
//                 <p className="card-text mt-4">
//                   如何幫毛小孩整理毛髮？這我有經驗，我自己就是狗畜生
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PetQASection
