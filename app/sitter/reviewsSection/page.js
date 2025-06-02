import React from 'react'
import StatisticsCard from '../_components/swiper-card/statisticsCard'
import ReviewsContainer from '../_components/swiper-card/reviewsContainer'
import styles from '../_components/swiper-card/reviewSection.module.css'

export default function ReviewsSection() {
  return (
    <section className={`${styles.reviewsSection} py-5 px-4`}>
      <div className="container">
        <div className="d-flex flex-wrap gap-4 flex-lg-row flex-column align-items-center">
          <div className="flex-grow-1">
            <h2 className="sectionTitle text-white fs-2">What our Platform</h2>
            <StatisticsCard />
          </div>
          <div className="reviewsContainer flex-grow-1">
            <ReviewsContainer />
          </div>
        </div>
      </div>
    </section>
  )
}
