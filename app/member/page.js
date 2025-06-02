'use client'
import React from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import { FaRegUser, FaRegHeart } from 'react-icons/fa6'
import { IoTicketOutline } from 'react-icons/io5'
import SectionTitle from './_components/SectionTitle/layout'
import { useAuth } from '../../hooks/use-auth'

export default function MemberPage() {
  const { member } = useAuth()

  return (
    <>
      <SectionTitle>會員中心</SectionTitle>
      <div className="mt-lg-3">
        <div
          className={`${styles.block} d-flex flex-column flex-lg-row g-0 justify-content-evenly align-items-center ps-lg-5 pe-lg-5 pt-lg-3 pb-lg-3 mb-5 p-3`}
        >
          <div className={`${styles.vipCard} rounded-3 order-1 order-lg-0`}>
            {/* 會員卡片區塊 */}
          </div>
          <div className="order-0 order-lg-1 mb-3 m-lg-0">
            <p>{member.username}</p>
            <div>
              <p>{`BARK & BIJOU ${member.vip_levels_id}`}</p>
              <span>等級說明</span>
            </div>
          </div>
        </div>
        <div
          className={`${styles.block} justify-content-evenly align-items-center ps-lg-5 pe-lg-5 py-lg-0 mb-5`}
        >
          <div className="row g-0 p-3">
            <div className="d-flex flex-column justify-content-center col-4 col-lg-3 text-center">
              <div>{member.pendingShipment}</div>
              <p className="m-0">待出貨</p>
            </div>
            <div className="d-flex flex-column justify-content-center col-4 col-lg-3 text-center">
              <div>{member.shipped}</div>
              <p className="m-0">已出貨</p>
            </div>
            <div className="d-flex flex-column justify-content-center col-4 col-lg-3 text-center">
              <div>{member.pendingPickup}</div>
              <p className="m-0">待取貨</p>
            </div>
            <div className="col-12 col-lg-3 d-flex justify-content-center text-center">
              <Link
                href="/member/orders/product"
                className={`${styles.btnCustom} d-flex justify-content-center align-items-center mt-3 mt-lg-0`}
              >
                查看訂單
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`${styles.block} d-flex justify-content-evenly align-items-center ps-lg-5 pe-lg-5 pt-lg-3 pb-lg-3 p-3`}
        >
          <div className="col d-flex flex-column text-center">
            <Link
              href="/member/profile/info"
              className="text-decoration-none member-button d-flex flex-column justify-content-center align-items-center w-100 h-100"
            >
              <FaRegUser className="fs-4 text-dark mb-2" />
              <p className={`m-0 ${styles.myText}`}>會員基本資料</p>
            </Link>
          </div>
          <div className="col d-flex flex-column text-center">
            <Link
              href="/member/coupons"
              className="text-decoration-none member-button d-flex flex-column justify-content-center align-items-center w-100 h-100"
            >
              <IoTicketOutline className="fs-4 text-dark mb-2" />
              <p className={`m-0 ${styles.myText}`}>我的優惠券</p>
            </Link>
          </div>
          <div className="col d-flex flex-column text-center">
            <Link
              href="/member/favorite/products"
              className="text-decoration-none member-button d-flex flex-column justify-content-center align-items-center w-100 h-100"
            >
              <FaRegHeart className="fs-4 text-dark mb-2" />
              <p className={`m-0 ${styles.myText}`}>我的收藏</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
