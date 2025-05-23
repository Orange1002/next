'use client'
import * as React from 'react'
import styles from './PetCareServices.module.css'
import ServiceHero from './ServiceHero'
import ServiceCard from './ServiceCard'

function PetCareServices() {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <ServiceHero />
        <div className={styles.servicesGrid}>
          <ServiceCard
            image="https://placehold.co/707x328/8B4513/8B4513"
            title="安親寄宿"
          />
          <ServiceCard
            image="https://placehold.co/707x328/4B7F52/4B7F52"
            title="陪伴散步"
          />
        </div>
      </div>
    </section>
  )
}

export default PetCareServices
