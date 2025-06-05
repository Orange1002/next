import RelatedProductCard from './RelatedProductCard'
import styles from './RelatedProductList.module.scss'
import { useEffect, useRef } from 'react'

export default function RelatedProductList({
  title = 'Related Products',
  products = [],
  id,
}) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let isDown = false
    let startX
    let scrollLeft

    const onMouseDown = (e) => {
      isDown = true
      startX = e.pageX - container.offsetLeft
      scrollLeft = container.scrollLeft
      container.classList.add(styles.dragging)
    }

    const onMouseLeave = () => {
      isDown = false
      container.classList.remove(styles.dragging)
    }

    const onMouseUp = () => {
      isDown = false
      container.classList.remove(styles.dragging)
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX) * 2
      container.scrollLeft = scrollLeft - walk
    }

    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('mouseup', onMouseUp)
    container.addEventListener('mousemove', onMouseMove)

    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('mouseleave', onMouseLeave)
      container.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className={styles.relatedProducts}>
      <div className={styles.titleBarContainer}>
        <div className={styles.titleBar}>
          <span className={styles.titleLine}></span>
          <div className={styles.titleText}>{title}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#505050" />
          </svg>
        </div>
      </div>

      <div className={styles.relatedProductCardContainer} ref={scrollRef}>
        {products.map((product, i) => (
          <div key={i} className={styles.cardWrapper}>
            <RelatedProductCard
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
