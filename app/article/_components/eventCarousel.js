import React, { useRef, useCallback } from 'react'
import { AiOutlineRightCircle, AiOutlineLeftCircle } from 'react-icons/ai'
import Image from 'next/image'

const EventCarousel = () => {
  const scrollRef = useRef(null)
  const cardWidth = 240
  const totalItems = 4
  const scrollPositionRef = useRef(0)

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      if (scrollRef.current.scrollLeft > 0) {
        scrollPositionRef.current -= cardWidth
      } else {
        scrollPositionRef.current = (totalItems - 1) * cardWidth
      }
      scrollRef.current.scrollTo({
        left: scrollPositionRef.current,
        behavior: 'smooth',
      })
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      if (scrollRef.current.scrollLeft < (totalItems - 1) * cardWidth) {
        scrollPositionRef.current += cardWidth
      } else {
        scrollPositionRef.current = 0
      }
      scrollRef.current.scrollTo({
        left: scrollPositionRef.current,
        behavior: 'smooth',
      })
    }
  }, [])

  const events = [
    { img: './article_img/AIRBUGGY1 1.png', text: '春季_狗狗新裝上線!!' },
    {
      img: './article_img/AIRBUGGY1 2.png',
      text: '外出必備!! 春日好禮大放送！',
    },
    { img: './article_img/AIRBUGGY1 3.png', text: '達指定金額 運費$0元！' },
    { img: './article_img/AIRBUGGY1 3.png', text: '達指定金額 運費$0元！' },
  ]

  return (
    <div className="event-wrapper bg-gray py-5 container-fluid">
      <div className="container-fluid">
        <div className="category d-flex justify-content-between mt-3">
          <div className="event-title d-flex align-items-center">最新活動</div>
          <div className="d-flex me-5">
            <p className="more">More</p>
            {/* <div
              className="icon-link d-flex justify-content-center align-items-center rounded-circle"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  window.location.href = '你的連結網址'
              }}
              onClick={() => (window.location.href = '你的連結網址')}
              style={{ cursor: 'pointer', width: '32px', height: '32px' }}
            >
              <AiOutlineRightCircle className="icon" />
            </div> */}
          </div>
        </div>
      </div>

      <div className="event-body d-flex justify-content-center align-items-center">
        <div
          className="event-arrow d-flex justify-content-center align-items-center icon-link"
          onClick={scrollLeft}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') scrollLeft()
          }}
          style={{ cursor: 'pointer' }}
        >
          <AiOutlineLeftCircle className="icon" />
        </div>

        <div
          className="event-card-group d-flex align-items-center flex-nowrap"
          ref={scrollRef}
          style={{ overflowX: 'hidden', scrollBehavior: 'smooth' }}
        >
          {events.map((event, index) => (
            <a className="event-card" key={index}>
              <Image
                width={200}
                height={200}
                src={event.img}
                alt={`活動${index + 1}`}
              />
              <div className="event-card-content">{event.text}</div>
            </a>
          ))}
        </div>

        <div
          className="event-arrow d-flex justify-content-center align-items-center icon-link"
          onClick={scrollRight}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') scrollRight()
          }}
          style={{ cursor: 'pointer' }}
        >
          <AiOutlineRightCircle className="icon" />
        </div>
      </div>
    </div>
  )
}

export default EventCarousel
