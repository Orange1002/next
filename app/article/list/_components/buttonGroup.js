import React, { useState } from 'react'
import '../_style/list.scss'

const ButtonGroup = ({ onCategorySelect }) => {
  // 新增「全部」作為第一項
  const categories = [
    '所有文章',
    '營養與飲食',
    '行為與訓練',
    '健康與保健',
    '戶外活動與探險',
    '分享狗狗的一切',
  ]

  const [selectedCategory, setSelectedCategory] = useState('全部')

  const handleClick = (cat) => {
    if (cat === '所有文章') {
      setSelectedCategory('所有文章')
      onCategorySelect('')  // 傳空字串代表不過濾分類
    } else {
      const newCategory = selectedCategory === cat ? null : cat
      setSelectedCategory(newCategory)
      onCategorySelect(newCategory || '')
    }
  }

  return (
    <div className="d-flex justify-content-evenly gap-3 mt-4">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`btn list-btn ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => handleClick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default ButtonGroup

// import React, { useState } from 'react'
// import '../_style/list.scss'

// const ButtonGroup = ({ onCategorySelect }) => {
//   const categories = [
//     '飲食與營養',
//     '行為與訓練',
//     '健康與保健',
//     '戶外活動與探險',
//   ]

//   const [selectedCategory, setSelectedCategory] = useState(null)

//   const handleClick = (cat) => {
//     // 切換選擇，如果點選已選的分類則取消
//     const newCategory = selectedCategory === cat ? null : cat
//     setSelectedCategory(newCategory)
//     onCategorySelect(newCategory)
//   }

//   return (
//     <div className="d-flex justify-content-evenly gap-3 mt-4">
//       {categories.map((cat) => (
//         <button
//           key={cat}
//           type="button"
//           className={`btn list-btn ${selectedCategory === cat ? 'active' : ''}`}
//           onClick={() => handleClick(cat)}
//         >
//           {cat}
//         </button>
//       ))}
//     </div>
//   )
// }

// export default ButtonGroup
