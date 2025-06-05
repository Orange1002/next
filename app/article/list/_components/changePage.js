import React from 'react'
import '../_style/list.scss'
import {
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiOutlineRight,
  AiOutlineLeft,
} from 'react-icons/ai'

const ChangePage = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  const handleClick = (e, page) => {
    e.preventDefault() // 阻止預設跳轉
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'not-allowed' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={(e) => handleClick(e, 1)}
              aria-label="First Page"
            >
              <AiOutlineDoubleLeft />
            </button>
          </li>

          <li className={`page-item ${currentPage === 1 ? 'not-allowed' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={(e) => handleClick(e, currentPage - 1)}
              aria-label="Previous Page"
            >
              <AiOutlineLeft />
            </button>
          </li>

          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? 'active' : ''}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={(e) => handleClick(e, page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${currentPage === totalPages ? 'not-allowed' : ''}`}
          >
            <button
              type="button"
              className="page-link"
              onClick={(e) => handleClick(e, currentPage + 1)}
              aria-label="Next Page"
            >
              <AiOutlineRight />
            </button>
          </li>

          <li
            className={`page-item ${currentPage === totalPages ? 'not-allowed' : ''}`}
          >
            <button
              type="button"
              className="page-link"
              onClick={(e) => handleClick(e, totalPages)}
              aria-label="Last Page"
            >
              <AiOutlineDoubleRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default ChangePage

// import React from 'react'
// import '../_style/list.scss'
// import { AiOutlineDoubleRight } from 'react-icons/ai'
// import { AiOutlineDoubleLeft } from 'react-icons/ai'
// import { AiOutlineRight } from 'react-icons/ai'
// import { AiOutlineLeft } from 'react-icons/ai'

// const ChangePage = () => {
//   return (
//     <div className="d-flex justify-content-center mt-5">
//       <nav aria-label="Page navigation">
//         <ul className="pagination">
//           <li className="page-item">
//             <a className="page-link" href="#">
//               <AiOutlineDoubleLeft />
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               <AiOutlineLeft />
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               1
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               2
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               3
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               <AiOutlineRight />
//             </a>
//           </li>
//           <li className="page-item">
//             <a className="page-link" href="#">
//               <AiOutlineDoubleRight />
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   )
// }

// export default ChangePage
