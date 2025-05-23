'use client'

import React from 'react'
import LevelBar from './_components/levelBar/LevelBar'
import VIPCard from './_components/VIPCard/VIPCard'
import SelectCard from './_components/selectCard/SelectCard'
import CouponCard from './_components/couponCard/CouponCard'
import Pagination from './_components/pagination/Pagination'
import customCard from './_components/VIPCard/img/vipcard.jpg'
import iconStar from './_components/VIPCard/img/icon-paw.png'
import styles from './Page.module.scss'

export default function CouponPage() {
  return (
    <>
      {/* Hero level progress bar area */}
      <LevelBar />

      {/* MyCard area */}
      <VIPCard
        userName="李小明"
        level="忠實會員"
        statusNote="（即將升級）"
        accumulatedPoints={5200}
        nextLevelPoints={8000}
        cardImage={customCard}
        iconImage={iconStar}
      />

      {/* Tab menu */}
      <SelectCard />

      <div className={`${styles.couponList} container`}>
        {/* 在這裡放你的 coupon 元件 */}
        <CouponCard
          title="6/01 限時 7-ELEVEN 免運券"
          date="2025.06.01 起生效"
          minSpend={399}
          multiplier="x2"
        />
        <CouponCard
          title="6/05 超市全站 $299 免運券"
          date="2025.06.05 起生效"
          minSpend={299}
          multiplier={null}
        />
      </div>

      {/* Pagination area */}
      <div className={styles.paginationContainer}>
        <Pagination />
      </div>
    </>
  )
}
