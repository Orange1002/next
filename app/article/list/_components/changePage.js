'use client'

import React from 'react'
import '../_style/list.scss'
import {
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiOutlineRight,
  AiOutlineLeft,
} from 'react-icons/ai'

const ChangePage = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginatedPages = () => {
    const visiblePages = []
    const threshold = 5 // 當總頁數超過這個值時，會開始顯示省略符號
    const pagesToShowAroundCurrent = 2 // 當前頁碼前後顯示的頁數 (例如，2 表示當前頁碼前後各顯示2個頁碼)
    const firstPage = 1
    const lastPage = totalPages

    if (totalPages <= threshold) {
      // 如果總頁數不多於閾值，直接顯示所有頁碼
      for (let i = firstPage; i <= lastPage; i++) {
        visiblePages.push(i)
      }
    } else {
      // 確保第一頁和最後一頁總是被考慮，即使它們可能被省略號取代
      // (後續的過濾會決定它們是否最終顯示)
      visiblePages.push(firstPage)

      // 定義中間頁碼的顯示範圍
      let startRange = currentPage - pagesToShowAroundCurrent
      let endRange = currentPage + pagesToShowAroundCurrent

      // 調整範圍，確保至少有一定數量的頁碼被顯示
      // 如果當前頁碼接近開頭
      if (currentPage <= firstPage + pagesToShowAroundCurrent + 1) {
        // 例如 current=1,2,3,4 (當 pagesToShowAroundCurrent=2 時)
        startRange = firstPage
        endRange = threshold // 顯示 1,2,3,4,5...
      }
      // 如果當前頁碼接近結尾
      else if (currentPage >= lastPage - pagesToShowAroundCurrent - 1) {
        // 例如 current=7,8,9,10 (當 totalPages=10, pagesToShowAroundCurrent=2 時)
        startRange = lastPage - threshold + 1 // ...6,7,8,9,10
        endRange = lastPage
      }

      // 確保 startRange 和 endRange 在有效範圍內
      startRange = Math.max(startRange, firstPage + 1) // 中間頁碼不包含第一頁
      endRange = Math.min(endRange, lastPage - 1) // 中間頁碼不包含最後一頁

      // 添加左邊的省略符號
      // 只有當 startRange 比第二頁大時才需要
      if (startRange > firstPage + 1) {
        visiblePages.push('...')
      }

      // 添加中間的數字頁碼
      for (let i = startRange; i <= endRange; i++) {
        visiblePages.push(i)
      }

      // 添加右邊的省略符號
      // 只有當 endRange 比倒數第二頁小時才需要
      if (endRange < lastPage - 1) {
        visiblePages.push('...')
      }

      // 總是顯示最後一頁，但在這個邏輯中，只有在結尾範圍內才會被自然包含
      // 否則，只有在當前頁接近最後一頁時才顯示
      // 這裡不主動加，讓後面的過濾器處理
      if (currentPage >= lastPage - pagesToShowAroundCurrent - 1) {
        if (!visiblePages.includes(lastPage)) {
          // 避免重複
          visiblePages.push(lastPage)
        }
      }
    }

    // 最後的過濾：移除重複的頁碼和不必要的省略號
    const finalPages = []
    let lastAdded = null // 用來追蹤上一個被添加到 finalPages 的項目

    visiblePages.forEach((item, index) => {
      // 避免重複數字頁碼
      if (typeof item === 'number' && item === lastAdded) {
        return
      }
      // 避免連續的省略號
      if (item === '...' && lastAdded === '...') {
        return
      }

      // 避免 `...` 在 1 之後立刻出現，例如 `1 ... 3` 但實際中間只有 2
      // 如果 `...` 前是數字 `N`，後是數字 `M`，且 `M - N <= 1`，則 `...` 無意義
      if (
        item === '...' &&
        typeof lastAdded === 'number' &&
        typeof visiblePages[index + 1] === 'number'
      ) {
        if (visiblePages[index + 1] - lastAdded <= 1) {
          return
        }
      }

      finalPages.push(item)
      lastAdded = item
    })

    // 額外檢查和調整邊界情況，確保 1 和 totalPages 的正確顯示
    // 確保第一頁始終存在 (除非 totalPages是0)
    if (totalPages > 0 && finalPages[0] !== firstPage) {
      finalPages.unshift(firstPage)
    }
    // 確保最後一頁顯示 (當 currentPage 靠近末尾時)
    if (
      currentPage >= totalPages - pagesToShowAroundCurrent - 1 &&
      !finalPages.includes(lastPage) &&
      totalPages > threshold
    ) {
      // 如果倒數第二個是...，且最後一頁沒有被包含
      if (finalPages[finalPages.length - 1] === '...') {
        finalPages.pop() // 移除舊的...
      }
      finalPages.push(lastPage)
    } else if (
      totalPages > threshold &&
      currentPage < totalPages - pagesToShowAroundCurrent - 1 &&
      finalPages[finalPages.length - 1] !== '...' &&
      finalPages[finalPages.length - 1] !== lastPage
    ) {
      // 當前頁碼不在最後，且最後一個不是...也不是最後一頁時，可能需要添加...
      finalPages.push('...')
    }

    // 最後的最終過濾，確保格式正確
    return finalPages.filter((item, idx, arr) => {
      // 移除開頭的 `...` 如果它緊跟著 1
      if (
        item === '...' &&
        arr[idx - 1] === firstPage &&
        typeof arr[idx + 1] === 'number' &&
        arr[idx + 1] - firstPage <= pagesToShowAroundCurrent + 1
      ) {
        return false
      }
      // 移除結尾的 `...` 如果它緊鄰著 totalPages
      if (
        item === '...' &&
        arr[idx + 1] === lastPage &&
        typeof arr[idx - 1] === 'number' &&
        lastPage - arr[idx - 1] <= pagesToShowAroundCurrent + 1
      ) {
        return false
      }
      // 移除重複的 ...
      if (item === '...' && idx > 0 && arr[idx - 1] === '...') {
        return false
      }
      return true
    })
  }

  const finalPages = getPaginatedPages()

  const handleClick = (e, page) => {
    e.preventDefault()
    if (page === '...') {
      return
    }
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
              disabled={currentPage === 1}
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
              disabled={currentPage === 1}
            >
              <AiOutlineLeft />
            </button>
          </li>

          {finalPages.map((page, index) => (
            <li
              key={typeof page === 'number' ? page : `ellipsis-${index}`}
              className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={(e) => handleClick(e, page)}
                aria-current={page === currentPage ? 'page' : undefined}
                disabled={page === '...'}
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
              disabled={currentPage === totalPages}
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
              disabled={currentPage === totalPages}
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
// import {
//   AiOutlineDoubleRight,
//   AiOutlineDoubleLeft,
//   AiOutlineRight,
//   AiOutlineLeft,
// } from 'react-icons/ai'

// const ChangePage = ({ currentPage, totalPages, onPageChange }) => {
//   const pages = []
//   for (let i = 1; i <= totalPages; i++) {
//     pages.push(i)
//   }

//   const handleClick = (e, page) => {
//     e.preventDefault() // 阻止預設跳轉
//     if (page !== currentPage && page >= 1 && page <= totalPages) {
//       onPageChange(page)
//     }
//   }

//   return (
//     <div className="d-flex justify-content-center mt-5">
//       <nav aria-label="Page navigation">
//         <ul className="pagination">
//           <li className={`page-item ${currentPage === 1 ? 'not-allowed' : ''}`}>
//             <button
//               type="button"
//               className="page-link"
//               onClick={(e) => handleClick(e, 1)}
//               aria-label="First Page"
//             >
//               <AiOutlineDoubleLeft />
//             </button>
//           </li>

//           <li className={`page-item ${currentPage === 1 ? 'not-allowed' : ''}`}>
//             <button
//               type="button"
//               className="page-link"
//               onClick={(e) => handleClick(e, currentPage - 1)}
//               aria-label="Previous Page"
//             >
//               <AiOutlineLeft />
//             </button>
//           </li>

//           {pages.map((page) => (
//             <li
//               key={page}
//               className={`page-item ${page === currentPage ? 'active' : ''}`}
//             >
//               <button
//                 type="button"
//                 className="page-link"
//                 onClick={(e) => handleClick(e, page)}
//                 aria-current={page === currentPage ? 'page' : undefined}
//               >
//                 {page}
//               </button>
//             </li>
//           ))}

//           <li
//             className={`page-item ${currentPage === totalPages ? 'not-allowed' : ''}`}
//           >
//             <button
//               type="button"
//               className="page-link"
//               onClick={(e) => handleClick(e, currentPage + 1)}
//               aria-label="Next Page"
//             >
//               <AiOutlineRight />
//             </button>
//           </li>

//           <li
//             className={`page-item ${currentPage === totalPages ? 'not-allowed' : ''}`}
//           >
//             <button
//               type="button"
//               className="page-link"
//               onClick={(e) => handleClick(e, totalPages)}
//               aria-label="Last Page"
//             >
//               <AiOutlineDoubleRight />
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   )
// }

// export default ChangePage
