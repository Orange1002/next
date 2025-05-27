import React from 'react'
import styles from './reviewSection.module.css'

const StatisticItem = ({ value, description }) => (
  <div className={styles.statisticItem}>
    <h3 className={styles.statisticValue}>{value}</h3>
    <p className={styles.statisticDescription}>{description}</p>
  </div>
)

export default function StatisticsCard() {
  return (
    <div className="d-flex justify-content-between gap-4 mt-3 px-3">
      <div className="flex-fill">
        <h3 className="text-white fw-bold display-6 lh-1">4.8</h3>
        <p className="text-white fs-6 lh-base">1000+ reviews on TripAdvisor.</p>
      </div>
      <div className="flex-fill">
        <h3 className="text-white fw-bold display-6 lh-1">16M</h3>
        <p className="text-white fs-6 lh-base">Happy customers</p>
      </div>
    </div>
  )
}
