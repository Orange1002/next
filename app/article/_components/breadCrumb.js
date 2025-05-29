'use client'
import React from 'react'
import { AiOutlineRight } from 'react-icons/ai'

// 接收 breadcrumb 陣列，例如：[{ name: '首頁', href: '/' }, { name: '文章', href: '/articles' }]
function Breadcrumb({ items = [] }) {
  return (
    <div className="container desktop">
      <div className="row">
        <div className="col-12 d-flex align-items-center mt-4">
          <div className="title-line"></div>
          <p className="ms-4 petknowledge">Pet knowledge</p>
          <div className="petknowledge-c ms-4"></div>
        </div>

        <div className="d-flex align-items-center fw-light gap-4 mt-4 flex-wrap">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <a
                href={item.href}
                className="mb-0 me-3 ms-3 text-decoration-none bread"
              >
                {item.name}
              </a>
              {index < items.length - 1 && <AiOutlineRight className="bread" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb

// 'use client'
// import React from 'react'
// import { AiOutlineRight } from 'react-icons/ai'

// function Breadcrumb() {
//   return (
//     <div className="container desktop">
//       <div className="row">
//         <div className="col-12 d-flex align-items-center mt-4">
//           <div className="title-line"></div>
//           <p className="ms-4 petknowledge">Pet knowledge</p>
//           <div className="petknowledge-c ms-4"></div>
//         </div>
//         <div className="d-flex align-items-center fw-light gap-4 mt-4">
//           <a href="#" className="mb-0 me-3 text-decoration-none bread">
//             首頁
//           </a>
//           <AiOutlineRight className="bread" />
//           <a href="#" className="mb-0 me-3 ms-3 text-decoration-none bread">
//             文章
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Breadcrumb
