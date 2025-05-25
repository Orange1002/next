'use client'

import React, { useState } from 'react'
import LevelBar from './_components/levelBar/LevelBar'
import VIPCard from './_components/VIPCard/VIPCard'
import SelectCard from './_components/selectCard/SelectCard'
import CouponCard from './_components/couponCard/CouponCard'
import CouponCardUnused from './_components/couponCardUnused/CouponCardUnused'
import CouponCardUsed from './_components/couponCardUsed/CouponCardUsed'
import Pagination from './_components/pagination/Pagination'
import styles from './Page.module.scss'

export default function CouponPage() {
  const [activeTab, setActiveTab] = useState('available')

  return (
    <>
      <LevelBar />

      <VIPCard userName="李小明" accumulatedPoints={3000} />

      {/* Tab 選單 */}
      <SelectCard activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={`${styles.couponList} container`}>
        {activeTab === 'available' && (
          <>
            <CouponCard
              title="6/05 超市全站 $299 免運券"
              date="2025.06.05 起生效"
              minSpend={299}
              imageIndex={1}
            />
            <CouponCard
              title="6/01 限時 7-ELEVEN 免運券"
              date="2025.06.01 起生效"
              minSpend={399}
              multiplier="x2"
              imageIndex={2}
            />
            <CouponCard
              title="6/05 超市全站 $299 免運券"
              date="2025.06.05 起生效"
              minSpend={299}
              imageIndex={3}
            />
            <CouponCard
              title="6/05 超市全站 $299 免運券"
              date="2025.06.05 起生效"
              minSpend={299}
              imageIndex={4}
            />
            <CouponCard
              title="6/05 超市全站 $299 免運券"
              date="2025.06.05 起生效"
              minSpend={299}
              imageIndex={5}
            />
          </>
        )}
        {activeTab === 'usable' && (
          <CouponCardUnused
            title="全站免運券"
            date="2025.06.10 起生效"
            minSpend={199}
            imageIndex={4}
          />
        )}
        {activeTab === 'used' && (
          <CouponCardUsed
            title="5/15 美妝館折扣券"
            date="2025.05.15"
            minSpend={500}
            imageIndex={1}
          />
        )}
      </div>

      <div className={styles.paginationContainer}>
        <Pagination />
      </div>
    </>
  )
}
