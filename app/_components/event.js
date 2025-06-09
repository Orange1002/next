'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { FaChevronCircleLeft } from 'react-icons/fa'
import { FaChevronCircleRight } from 'react-icons/fa'
import Link from 'next/link'

const eventCards = [
  {
    src: './images/AIRBUGGY1 1.png',
    alt: 'event 1',
    text: '春季_狗狗新裝上線!!',
    href: '#',
  },
  {
    src: './images/AIRBUGGY1 2.png',
    alt: 'event 2',
    text: '外出必備!! 春日好禮大放送！',
    href: '/new',
  },
  {
    src: './images/AIRBUGGY1 3.png',
    alt: 'event 3',
    text: '達指定金額 運費$0元！',
    href: '#',
  },
  {
    src: './images/AIRBUGGY1 4.webp',
    alt: 'event 4',
    text: '夏季外出，狗狗運動會!',
    href: '#',
  },
]

export default function MyEvent() {
  // 第三部分 左右無限輪播
  const carouselRef = useRef(null)
  const groupRef = useRef(null)
  const disableMove = useRef(false)
  const position = useRef(0)
  const contentToShow = 3
  const moveSpeed = 500
  const distanceBetweenContent = useRef(0)

  useEffect(() => {
    if (window.innerWidth > 575.98) {
      const eventCardGroup = groupRef.current
      const allCards = eventCardGroup.querySelectorAll('.event-card')
      const firstCard = allCards[0]
      const lastCard = allCards[allCards.length - 1]

      // 設定卡片寬度
      const contentWidth = 478.8
      allCards.forEach((el) => (el.style.width = `${contentWidth}px`))

      distanceBetweenContent.current =
        allCards[1].offsetLeft - allCards[0].offsetLeft || contentWidth + 30

      // 複製卡片實現無限輪播
      Array.from(allCards)
        .slice(0, contentToShow)
        .reverse()
        .forEach((el) => lastCard.after(el.cloneNode(true)))

      Array.from(allCards)
        .slice(-contentToShow)
        .forEach((el) => firstCard.before(el.cloneNode(true)))

      position.current = contentToShow
      eventCardGroup.style.transform = `translateX(${
        -distanceBetweenContent.current * contentToShow
      }px)`

      const onTransitionEnd = () => {
        disableMove.current = false
        if (position.current <= 0) {
          position.current = allCards.length
          eventCardGroup.style.transition = 'none'
          eventCardGroup.style.transform = `translateX(${
            -distanceBetweenContent.current * position.current
          }px)`
        } else if (position.current >= allCards.length + contentToShow) {
          position.current = contentToShow
          eventCardGroup.style.transition = 'none'
          eventCardGroup.style.transform = `translateX(${
            -distanceBetweenContent.current * position.current
          }px)`
        }
      }

      eventCardGroup.addEventListener('transitionend', onTransitionEnd)

      const move = (step) => {
        if (disableMove.current) return
        disableMove.current = true

        position.current += step
        eventCardGroup.style.transition = `transform ${moveSpeed}ms`
        eventCardGroup.style.transform = `translateX(${
          -distanceBetweenContent.current * position.current
        }px)`
      }

      const prevBtn = document.getElementById('event-left-arrow')
      const nextBtn = document.getElementById('event-right-arrow')

      prevBtn.onclick = () => move(-1)
      nextBtn.onclick = () => move(1)

      return () => {
        prevBtn.onclick = null
        nextBtn.onclick = null
        eventCardGroup.removeEventListener('transitionend', onTransitionEnd)
      }
    } else {
      // 手機滑動 + 點點同步
      const scrollContainer = document.querySelector('.carousel')
      const eventDots = document.querySelectorAll('.event-indicator-dot')
      const eventCards = document.querySelectorAll('.event-card')

      const handleScroll = () => {
        const scrollLeft = scrollContainer.scrollLeft
        const eventCardWidth = eventCards[0].offsetWidth + 30
        const currentIndex = Math.round(scrollLeft / eventCardWidth)

        eventDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex)
        })
      }

      if (scrollContainer && eventDots.length > 0) {
        scrollContainer.addEventListener('scroll', handleScroll)
      }

      // 清除事件監聽
      return () => {
        scrollContainer?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <>
      <section>
        <div className="event-wrapper bg-gray py-96">
          <div className="event-title d-flex align-items-center mb-5 mb-lb-0">
            最新消息
          </div>
          <div className="event-body d-flex justify-content-center align-items-center">
            <div
              className="event-arrow d-flex justify-content-center align-items-center"
              id="event-left-arrow"
              aria-label="Scroll left"
            >
              <FaChevronCircleLeft />
            </div>

            <div className="carousel position-relative" ref={carouselRef}>
              <div
                className="event-card-group d-flex position-absolute"
                ref={groupRef}
              >
                {eventCards.map((card, index) => (
                  <Link
                    href={card.href}
                    className="event-card text-decoration-none object-fit-cover"
                    key={index}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={card.src}
                      alt={card.alt}
                    />
                    <div className="event-card-content">{card.text}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="event-arrow d-flex justify-content-center align-items-center"
              id="event-right-arrow"
              aria-label="Scroll right"
            >
              <FaChevronCircleRight />
            </div>
          </div>

          {/* 手機版點點，可自行用 state 控制 active */}
          <div className="event-indicators d-flex d-lg-none justify-content-center">
            <span className="event-indicator-dot active"></span>
            <span className="event-indicator-dot"></span>
            <span className="event-indicator-dot"></span>
            <span className="event-indicator-dot"></span>
          </div>
        </div>
      </section>
    </>
  )
}
