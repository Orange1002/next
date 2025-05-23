import styles from './layout.module.css'
import React from 'react'

export default function SectionTitle({ children }) {
  return (
    <div className={`${styles.eventTitle} d-flex align-items-center`}>
      {children}
    </div>
  )
}
