import React, { useState } from 'react'

export default function ArticleSidebar() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const sections = [
    {
      title: '文章列表',
      items: ['飲食與營養', '行為與訓練', '健康與保健', '戶外活動與探險'],
    },
    {
      title: '熱門文章',
      items: ['飲食與營養', '行為與訓練', '健康與保健', '戶外活動與探險'],
    },
    // {
    //   title: '最新活動',
    //   items: ['活動預告', '熱烈進行中'],
    // },
    {
      title: '推薦知識影音',
      items: [],
    },
    // {
    //   title: '收藏文章',
    //   items: [
    //     '我的文章',
    //     '飲食與營養',
    //     '行為與訓練',
    //     '健康與保健',
    //     '戶外活動與探險',
    //   ],
    // },
    // {
    //   title: '寵物問答',
    //   items: ['我要詢問'],
    // },
  ]

  return (
    <div className="col-2 d-none d-xl-block">
      <div className="list-group">
        <div className="article-list d-flex justify-content-center pt-4">
          <p>Article List</p>
          <div className="al-circle"></div>
        </div>

        {sections.map((section, idx) => (
          <React.Fragment key={idx}>
            <a
              href="#"
              className="list-group-item2 list-group-item-action d-flex justify-content-between align-items-center p-4 bg-white text-decoration-none"
              onClick={(e) => {
                e.preventDefault()
                toggleCollapse(idx)
              }}
            >
              {section.title}
              <span>&rsaquo;</span>
            </a>

            <div className={`collapse ${openIndex === idx ? 'show' : ''}`}>
              {section.items.map((item, subIdx) => (
                <a
                  key={subIdx}
                  href="#"
                  className={`list-group-item2 list-group-item-action border-bottom p-3 text-decoration-none ${
                    subIdx === section.items.length - 1 ? 'last-item' : ''
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// import React, { useState } from 'react'

// export default function ArticleSidebar() {
//   const [openIndex, setOpenIndex] = useState(null)

//   const toggleCollapse = (index) => {
//     setOpenIndex(openIndex === index ? null : index)
//   }

//   const sections = [
//     {
//       title: '文章列表',
//       items: ['飲食與營養', '行為與訓練', '健康與保健', '戶外活動與探險'],
//     },
//     {
//       title: '熱門文章',
//       items: ['飲食與營養', '行為與訓練', '健康與保健', '戶外活動與探險'],
//     },
//     {
//       title: '最新活動',
//       items: ['活動預告', '熱烈進行中'],
//     },
//     {
//       title: '推薦知識影音',
//       items: ['營養體重與健康', '行為與訓練'],
//     },
//     {
//       title: '收藏文章',
//       items: [
//         '我的文章',
//         '飲食與營養',
//         '行為與訓練',
//         '健康與保健',
//         '戶外活動與探險',
//       ],
//     },
//     {
//       title: '寵物問答',
//       items: ['我要詢問'],
//     },
//   ]

//   return (
//     <div className="col-2 d-none d-xl-block">
//       <div className="list-group">
//         <div className="article-list d-flex justify-content-center pt-4">
//           <p>Article List</p>
//           <div className="al-circle"></div>
//         </div>

//         {sections.map((section, idx) => (
//           <React.Fragment key={idx}>
//             <a
//               href="#"
//               className="list-group-item2 list-group-item-action d-flex justify-content-between align-items-center p-4 bg-white text-decoration-none"
//               onClick={(e) => {
//                 e.preventDefault()
//                 toggleCollapse(idx)
//               }}
//             >
//               {section.title}
//               <span>&rsaquo;</span>
//             </a>

//             <div className={`collapse ${openIndex === idx ? 'show' : ''}`}>
//               {section.items.map((item, subIdx) => (
//                 <a
//                   key={subIdx}
//                   href="#"
//                   className={`list-group-item2 list-group-item-action border-bottom p-3 text-decoration-none ${
//                     subIdx === section.items.length - 1 ? 'last-item' : ''
//                   }`}
//                 >
//                   {item}
//                 </a>
//               ))}
//             </div>
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   )
// }