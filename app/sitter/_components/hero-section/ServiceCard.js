import React from 'react'
import styles from './ServiceCard.module.css'
import Image from 'next/image'

function ServiceCard({ src, title }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          alt={title}
          fill
          className={styles.cardImage}
          priority
        />
        <div className={styles.overlay} />
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
    </article>
  )
}

export default ServiceCard
