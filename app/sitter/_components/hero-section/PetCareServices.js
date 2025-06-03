'use client'
import * as React from 'react'
import styles from './PetCareServices.module.css'
import ServiceHero from './ServiceHero'
import ServiceCard from './ServiceCard'

function PetCareServices() {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.servicesGrid}>
          <ServiceCard src="/images/bigImg-4.png" title="寵物寄宿" />
          <ServiceCard src="/images/bigImg-2.png" title="溫馨陪伴" />
        </div>
        <ServiceHero />
      </div>
    </section>
  )
}

export default PetCareServices
