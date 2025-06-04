'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Articlelist({ onSelectCategory }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const sections = [
    {
      title: '我的文章',
      items: [],
    },
    {
      title: '我的收藏',
      items: [],
    },
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
            {section.title === '我的收藏' ? (
              <Link
                href="/member/favorite"
                className="list-group-item2 list-group-item-action d-flex justify-content-between align-items-center p-4 bg-white text-decoration-none"
              >
                {section.title}
                <span>&rsaquo;</span>
              </Link>
            ) : (
              <>
                <a
                  href="#"
                  className="list-group-item2 list-group-item-action d-flex justify-content-between align-items-center p-4 bg-white text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleCollapse(idx)
                    if (section.title === '我的文章' && onSelectCategory) {
                      onSelectCategory('我的文章')
                    }
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
                      onClick={(e) => {
                        e.preventDefault()
                        if (onSelectCategory) {
                          if (
                            section.title === '我的文章' &&
                            item === '所有文章'
                          ) {
                            onSelectCategory('我的文章')
                          } else {
                            onSelectCategory(item)
                          }
                        }
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState } from 'react'

// export default function Articlelist({ onSelectCategory }) {
//   const [openIndex, setOpenIndex] = useState(null)

//   const toggleCollapse = (index) => {
//     setOpenIndex(openIndex === index ? null : index)
//   }

//   const sections = [
//     {
//       title: '我的文章',
//       items: [],
//     },
//     {
//       title: '我的收藏',
//       items: [],
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
//                 // 如果點擊的是「我的文章」這個主標題
//                 if (section.title === '我的文章' && onSelectCategory) {
//                   onSelectCategory('我的文章') // 傳遞特殊標識符
//                 }
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
//                   onClick={(e) => {
//                     e.preventDefault()
//                     if (onSelectCategory) {
//                       // 如果是「我的文章」下的「所有文章」，或點擊了「我的文章」下的其他子分類，
//                       // 並且是「我的文章」的區塊，則傳遞「我的文章」標識 (因為後端會根據 member_id 篩選，忽略 category_name)
//                       if (section.title === '我的文章' && item === '所有文章') {
//                         onSelectCategory('我的文章')
//                       } else {
//                         onSelectCategory(item) // 正常傳遞類別名
//                       }
//                     }
//                   }}
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
