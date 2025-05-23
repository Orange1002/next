import React from 'react'
import styles from './ServiceCard.module.css'

function ServiceCard({ image, title }) {
  return (
    <article className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <div className={styles.overlay} />
      <h2 className={styles.cardTitle}>{title}</h2>
    </article>
  )
}

export default ServiceCard
