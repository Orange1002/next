'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const imageList = [
  '/images/big-1.png',
  '/images/big-2.webp',
  '/images/big-3.webp',
  '/images/big-4.webp',
  '/images/big-5.webp',
]

export default function MyCarousel() {
  const wrapperRef = useRef(null)
  const groupRef = useRef(null)
  const disableMove = useRef(false)
  const position = useRef(0)
  const distanceBetweenContent = useRef(0)
  const contentToShow = 1
  const moveSpeed = 500
  const intervalRef = useRef(null)

  useEffect(() => {
    const carousel = wrapperRef.current
    const bigImgGroup = groupRef.current
    const cards = Array.from(bigImgGroup.querySelectorAll('.bigImgCard'))
    const card = cards[0]
    const contentAmount = cards.length

    const setContentWidth = () => {
      distanceBetweenContent.current =
        card.nextElementSibling.offsetLeft - card.offsetLeft
    }

    const setContentHeight = () => {
      if (carousel && card) {
        const style = getComputedStyle(card)
        carousel.style.height = style.height
      }
    }

    const insertClonedSlider = () => {
      const firstContent = cards[0]
      const lastContent = cards[cards.length - 1]

      cards
        .slice(0, Math.ceil(contentToShow))
        .reverse()
        .forEach((el) =>
          lastContent.insertAdjacentElement('afterend', el.cloneNode(true))
        )

      cards
        .slice(-Math.ceil(contentToShow))
        .forEach((el) =>
          firstContent.insertAdjacentElement('beforebegin', el.cloneNode(true))
        )
    }

    const move = (step) => {
      if (disableMove.current) return

      position.current -= step
      bigImgGroup.style.transition = `transform ${moveSpeed}ms`
      bigImgGroup.style.transform = `translateX(${
        distanceBetweenContent.current *
        (position.current - Math.ceil(contentToShow))
      }px)`

      if (
        position.current <= -contentAmount ||
        position.current >= Math.ceil(contentToShow)
      ) {
        const resetPos =
          position.current >= Math.ceil(contentToShow)
            ? -contentAmount + Math.ceil(contentToShow)
            : 0

        position.current = resetPos

        bigImgGroup.addEventListener(
          'transitionend',
          () => {
            bigImgGroup.style.transition = 'transform 0s'
            bigImgGroup.style.transform = `translateX(${
              distanceBetweenContent.current *
              (position.current - Math.ceil(contentToShow))
            }px)`
          },
          { once: true }
        )
      }
    }

    insertClonedSlider()
    setContentWidth()
    setContentHeight()

    bigImgGroup.style.transform = `translateX(${
      -distanceBetweenContent.current * Math.ceil(contentToShow)
    }px)`

    bigImgGroup.addEventListener('transitionstart', () => {
      disableMove.current = true
    })
    bigImgGroup.addEventListener('transitionend', () => {
      disableMove.current = false
    })

    intervalRef.current = setInterval(() => move(1), 3000)

    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <section>
      <div
        className="bigImg-wrapper d-flex justify-content-center d-none d-lg-block position-relative"
        ref={wrapperRef}
      >
        <div className="d-flex bigImg-group position-absolute" ref={groupRef}>
          {imageList.map((src, idx) => (
            <div className="bigImgCard" key={idx}>
              <Image
                src={src}
                alt={`image ${idx + 1}`}
                width={980}
                height={440}
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
