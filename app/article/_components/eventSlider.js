import React, { useState, useEffect } from 'react'
import {
  AiOutlineLeftCircle,
  AiOutlineRightCircle,
  AiOutlineHeart,
} from 'react-icons/ai'
import Image from 'next/image'

const EventSlider = () => {
  const [cardMove, setCardMove] = useState(0)
  const cardsPerPage = 4
  const cards = [
    {
      img: './article_img/8297dee2d3f3e92a18cca6191d35938d.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
    {
      img: './article_img/istockphoto-1300658241-612x612.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
    {
      img: './article_img/download.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
    {
      img: './article_img/8297dee2d3f3e92a18cca6191d35938d.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
    {
      img: './article_img/istockphoto-1300658241-612x612.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
    {
      img: './article_img/8297dee2d3f3e92a18cca6191d35938d.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
    {
      img: './article_img/download.jpg',
      text: '從手作料理開始，兼顧毛孩的健康與美味！',
    },
  ]

  // 顯示當前頁面的卡片
  const showCards = () =>
    cards.slice(cardMove, cardMove + cardsPerPage).map((card, index) => (
      <div
        className="card card-h"
        key={index}
        style={{ position: 'relative', width: '230px' }}
      >
        <Image
          width={200}
          height={200}
          src={card.img}
          className="card-img-top object-fit-cover"
          alt="文章圖片"
        />
        <div className="card-body d-flex align-items-center p-3">
          <a
            href="你的連結網址"
            className="icon-link d-flex justify-content-center align-items-center rounded-circle p-2"
          >
            <AiOutlineRightCircle className="icon" size={20} />
          </a>
          <p className="card-text card-s-p ps-3">{card.text}</p>
          <div className="position-absolute bottom-0 end-0 p-3">
            <AiOutlineHeart size={20} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    ))

  // 左箭頭點擊事件
  const handleLeftArrowClick = () => {
    setCardMove((prevMove) =>
      prevMove - cardsPerPage < 0
        ? cards.length - cardsPerPage
        : prevMove - cardsPerPage
    )
  }

  // 右箭頭點擊事件
  const handleRightArrowClick = () => {
    setCardMove((prevMove) =>
      prevMove + cardsPerPage >= cards.length ? 0 : prevMove + cardsPerPage
    )
  }

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      setCardMove((prevMove) =>
        prevMove + cardsPerPage >= cards.length ? 0 : prevMove + cardsPerPage
      )
    }, 5000) // 每5秒切換一次

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="row">
      <div className="category d-flex justify-content-between align-items-center mb-3">
        <div className="event-title d-flex align-items-center">熱門文章</div>
        <div className="d-flex align-items-center me-4 mb-5">
          <p className="more mb-0 me-2">More</p>
          <a href="" className="icon-link">
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
