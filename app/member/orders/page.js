'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import ProductOrderCard from './_components/ProductOrderCard/layout'
import SitterOrderCard from './_components/SitterOrderCard/layout'
import styles from './orders.module.scss'
import Pagination from '../_components/Pagination/layout'
import SectionTitle from '../_components/SectionTitle/layout'
import { useAuth } from '@/hooks/use-auth'
import axios from 'axios'
import MobileMemberMenu from '../_components/mobileLinks/layout'

export default function ProductSection() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get('type') || 'products'
  const [activeTab, setActiveTab] = useState(type)

  const { member, loading } = useAuth()
  const [orderData, setOrderData] = useState([])

  console.log(member)

  useEffect(() => {
    if (!loading && member?.id) {
      const fetchOrders = async () => {
        try {
          const res = await axios.post(
            'http://localhost:3005/api/shopcart/order-list',
            { memberId: member.id }
          )
          setOrderData(res.data)
          console.log('取得訂單資料:', res.data)
        } catch (err) {
          console.error('載入訂單失敗', err)
        }
      }

      fetchOrders()
    }
  }, [loading, member])

  useEffect(() => {
    setActiveTab(type)
  }, [type])

  const handleTabClick = (tabType) => {
    router.push(`/member/orders?type=${tabType}`)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 拆分商品與保母訂單
  const productOrders = useMemo(
    () => orderData.filter((order) => order.items && order.items.length > 0),
    [orderData]
  )
  const sitterOrders = useMemo(
    () =>
      orderData.filter((order) => order.services && order.services.length > 0),
    [orderData]
  )

  const orders = activeTab === 'products' ? productOrders : sitterOrders
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <SectionTitle>我的訂單</SectionTitle>
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          {/* 切換按鈕 */}
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'products' ? styles.active : ''} btn`}
              onClick={() => handleTabClick('products')}
            >
              狗狗用品
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'sitters' ? styles.active : ''} btn`}
              onClick={() => handleTabClick('sitters')}
            >
              寵物保母
            </button>
          </div>

          {/* 訂單列表 */}
          <div className="mt-3">
            {activeTab === 'products' &&
              paginatedOrders.map((order, index) => (
                <ProductOrderCard
                  key={order.id}
                  orderId={order.id}
                  orderNumber={order.order_number}
                  orderDate={order.created_at}
                  paymentMethod={order.order_payment_name}
                  totalAmount={order.total_amount}
                  status={order.order_status_name}
                  products={order.items}
                  isFirst={index === 0}
                />
              ))}

            {activeTab === 'sitters' &&
              paginatedOrders.map((order, index) => (
                <SitterOrderCard
                  key={order.id}
                  orderId={order.id}
                  orderNumber={order.order_number}
                  orderDate={order.created_at}
                  paymentMethod={order.order_payment_name}
                  totalAmount={order.total_amount}
                  status={order.order_status_name}
                  sitters={order.services}
                  isFirst={index === 0}
                />
              ))}
          </div>
        </div>

        {/* 頁碼 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <MobileMemberMenu />
    </>
  )
}
