import { useState, useEffect } from 'react'
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai'
import CardS from '../_components/card-s.js'

const EventSlider = () => {
  const [articles, setArticles] = useState([])
  const [cardMove, setCardMove] = useState(0)
  const cardsPerPage = 4

  // 抓取熱門文章
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          'http://localhost:3005/api/article/favorites/top-favorites'
        )
        const data = await res.json()
        if (data.success) {
          setArticles(data.result)
        }
      } catch (err) {
        console.error('載入文章失敗', err)
      }
    }
    fetchArticles()
  }, [])

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      setCardMove((prevMove) =>
        prevMove + cardsPerPage >= articles.length ? 0 : prevMove + cardsPerPage
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [articles])

  const handleLeftArrowClick = () => {
    setCardMove((prevMove) =>
      prevMove - cardsPerPage < 0
        ? articles.length - cardsPerPage
        : prevMove - cardsPerPage
    )
  }

  const handleRightArrowClick = () => {
    setCardMove((prevMove) =>
      prevMove + cardsPerPage >= articles.length ? 0 : prevMove + cardsPerPage
    )
  }

  const showCards = () =>
    articles
      .slice(cardMove, cardMove + cardsPerPage)
      .map((article) => <CardS key={article.id} article={article} />)

  return (
    <div className="row">
      <div className="category d-flex justify-content-between align-items-center mb-3">
        <div className="event-title d-flex align-items-center">熱門文章</div>
        <div className="d-flex align-items-center me-4 mb-5">
          <p className="more mb-0 me-2">More</p>
          <a href="/article-list" className="icon-link">
            <AiOutlineRightCircle className="icon" />
          </a>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-4 mt-4 mb-4">
        <AiOutlineLeftCircle
          className="arrow-left"
          size={32}
          onClick={handleLeftArrowClick}
          style={{ cursor: 'pointer', color: '#333' }}
        />
        <div className="d-flex cards-container gap-4">{showCards()}</div>
        <AiOutlineRightCircle
          className="arrow-right"
          size={32}
          onClick={handleRightArrowClick}
          style={{ cursor: 'pointer', color: '#333' }}
        />
      </div>
    </div>
  )
}

export default EventSlider


// import { useState, useEffect } from 'react'
// import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai'
// import CardS from '../_components/card-s.js'

// const EventSlider = () => {
//   const [articles, setArticles] = useState([])
//   const [cardMove, setCardMove] = useState(0)
//   const cardsPerPage = 4

//   // 抓取熱門文章
//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const res = await fetch(
//           'http://localhost:3005/api/article/favorites/top-favorites'
//         )
//         const data = await res.json()
//         if (data.success) {
//           setArticles(data.result)
//         }
//       } catch (err) {
//         console.error('載入文章失敗', err)
//       }
//     }
//     fetchArticles()
//   }, [])

//   // 自動輪播
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCardMove((prevMove) =>
//         prevMove + cardsPerPage >= articles.length ? 0 : prevMove + cardsPerPage
//       )
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [articles])

//   const handleLeftArrowClick = () => {
//     setCardMove((prevMove) =>
//       prevMove - cardsPerPage < 0
//         ? articles.length - cardsPerPage
//         : prevMove - cardsPerPage
//     )
//   }

//   const handleRightArrowClick = () => {
//     setCardMove((prevMove) =>
//       prevMove + cardsPerPage >= articles.length ? 0 : prevMove + cardsPerPage
//     )
//   }

//   const showCards = () =>
//     articles
//       .slice(cardMove, cardMove + cardsPerPage)
//       .map((article) => <CardS key={article.id} article={article} />)

//   return (
//     <div className="row">
//       <div className="category d-flex justify-content-between align-items-center mb-3">
//         <div className="event-title d-flex align-items-center">熱門文章</div>
//         <div className="d-flex align-items-center me-4 mb-5">
//           <p className="more mb-0 me-2">More</p>
//           <a href="/article-list" className="icon-link">
//             <AiOutlineRightCircle className="icon" />
//           </a>
//         </div>
//       </div>

//       <div className="d-flex justify-content-center align-items-center gap-4 mt-4 mb-4">
//         <AiOutlineLeftCircle
//           className="arrow-left"
//           size={32}
//           onClick={handleLeftArrowClick}
//           style={{ cursor: 'pointer', color: '#333' }}
//         />
//         <div className="d-flex cards-container gap-4">{showCards()}</div>
//         <AiOutlineRightCircle
//           className="arrow-right"
//           size={32}
//           onClick={handleRightArrowClick}
//           style={{ cursor: 'pointer', color: '#333' }}
//         />
//       </div>
//     </div>
//   )
// }

// export default EventSlider
