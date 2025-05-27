'use client'

import React, { useState, useEffect } from 'react'
import LevelBar from './_components/levelBar/LevelBar'
import VIPCard from './_components/VIPCard/VIPCard'
import SelectCard from './_components/selectCard/SelectCard'
import CouponCard from './_components/couponCard/CouponCard'
import CouponCardUnused from './_components/couponCardUnused/CouponCardUnused'
import CouponCardUsed from './_components/couponCardUsed/CouponCardUsed'
import Pagination from './_components/pagination/Pagination'
import styles from './Page.module.scss'

export default function CouponPage() {
  const [activeTab, setActiveTab] = useState('available') // 預設顯示「可領取」
  const [member, setMember] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  // 抓取登入會員資訊
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/me/me', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('尚未登入')
        const data = await res.json()
        setMember(data)
      } catch (err) {
        console.error('❌ 無法取得會員資訊', err)
      }
    }
    fetchMember()
  }, [])

  // 根據 activeTab 抓取對應優惠券清單
  useEffect(() => {
    if (!member) return

    const fetchCoupons = async () => {
      setLoading(true)
      try {
        const endpointMap = {
          available: 'claimable', // 尚未領取
          usable: 'available', // 已領可用
          used: 'used', // 已使用
        }

        const res = await fetch(
          `http://localhost:3005/api/coupon/members/${member.id}/coupons/${endpointMap[activeTab]}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        setCoupons(data.coupons || [])
      } catch (err) {
        console.error('❌ 抓優惠券失敗', err)
        setCoupons([])
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [activeTab, member])

  return (
    <>
      <LevelBar />

      <VIPCard userName="李小明" accumulatedPoints={3000} />

      {/* Tab 選單 */}
      <SelectCard activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={styles.couponList}>
        {loading ? (
          <p>載入中...</p>
        ) : coupons.length === 0 ? (
          <p>目前沒有優惠券喔！</p>
        ) : (
          coupons.map((coupon) => {
            if (activeTab === 'available') {
              return <CouponCard key={coupon.id} {...coupon} />
            } else if (activeTab === 'usable') {
              return <CouponCardUnused key={coupon.id} {...coupon} />
            } else {
              return <CouponCardUsed key={coupon.id} {...coupon} />
            }
          })
        )}
      </div>

      <div className={styles.paginationContainer}>
        <Pagination />
      </div>
    </>
  )
}
