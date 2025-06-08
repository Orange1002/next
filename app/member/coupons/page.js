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
  const [activeTab, setActiveTab] = useState('available')
  const [member, setMember] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 3
  const [pointTotal, setPointTotal] = useState(0)

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

  const fetchCoupons = async () => {
    if (!member) return
    setLoading(true)
    try {
      const endpointMap = {
        available: 'claimable',
        usable: 'available',
        used: 'used',
      }

      const res = await fetch(
        `http://localhost:3005/api/coupon/members/${member.id}/coupons/${endpointMap[activeTab]}`,
        {
          credentials: 'include',
        }
      )
      const data = await res.json()
      setCoupons(data.data?.coupons || [])
    } catch (err) {
      console.error('❌ 抓優惠券失敗', err)
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [activeTab, member])

  useEffect(() => {
    setCurrentPage(1) // 回到第一頁
  }, [activeTab])

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/me/points', {
          credentials: 'include',
        })
        const data = await res.json()
        setPointTotal(data.total || 0)
      } catch (err) {
        console.error('❌ 無法取得點數', err)
      }
    }

    if (member) fetchPoints()
  }, [member])

  const renderCouponCard = (coupon) => {
    const isUsed = activeTab === 'used'
    const date = isUsed
      ? coupon.usedAt
        ? `使用於 ${new Date(coupon.usedAt).toLocaleDateString('zh-TW')}`
        : '使用時間不明'
      : coupon.endAt
        ? `${new Date(coupon.endAt).toLocaleDateString('zh-TW')} 前使用`
        : '無期限'

    const formatted = {
      title: coupon.title || '未命名優惠券',
      date,
      minSpend: isNaN(parseFloat(coupon.minPurchase))
        ? '不限'
        : Math.floor(Number(coupon.minPurchase)),
      multiplier: coupon.vipLevelId ? 'VIP' : null,
      image: coupon.image || '/coupon_img/DefaultCoupon.png',
    }

    if (activeTab === 'available') {
      return (
        <CouponCard
          key={coupon.id}
          couponId={coupon.id}
          memberId={member?.id}
          {...formatted}
          onClaimed={fetchCoupons}
        />
      )
    } else if (activeTab === 'usable') {
      return (
        <CouponCardUnused
          key={coupon.id}
          couponId={coupon.id}
          memberId={member?.id}
          categoryId={coupon.categoryId}
          usageTypeId={coupon.usageTypeId}
          {...formatted}
        />
      )
    } else {
      return (
        <CouponCardUsed
          key={coupon.id}
          couponId={coupon.id}
          memberId={member?.id}
          {...formatted}
        />
      )
    }
  }

  const startIdx = (currentPage - 1) * perPage
  const endIdx = startIdx + perPage
  const currentCoupons = coupons.slice(startIdx, endIdx)
  const totalPages = Math.ceil(coupons.length / perPage)

  return (
    <>
      <LevelBar />
      {member ? (
        <VIPCard userName={member.username} accumulatedPoints={pointTotal} />
      ) : (
        <p>載入會員資料中...</p>
      )}

      <SelectCard activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={styles.couponList}>
        {loading ? (
          <p>載入中...</p>
        ) : coupons.length === 0 ? (
          <p>目前沒有優惠券喔！</p>
        ) : (
          currentCoupons.map(renderCouponCard)
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  )
}
