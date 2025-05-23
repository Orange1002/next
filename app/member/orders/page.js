'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductOrderCard from './_components/ProductOrderCard/layout'
import SitterOrderCard from './_components/SitterOrderCard/layout'
import styles from './orders.module.scss'
import Pagination from '../_components/Pagination/layout'
import SectionTitle from '../_components/SectionTitle/layout'

export default function ProductSection() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const type = searchParams.get('type') || 'products'
  const [activeTab, setActiveTab] = useState(type)

  useEffect(() => {
    setActiveTab(type)
  }, [type])

  const handleTabClick = (tabType) => {
    router.push(`/member/orders?type=${tabType}`)
  }

  const testProductOrders = [
    {
      orderId: 'ORD-123456',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '已完成',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'ORD-123457',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '未付款',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'ORD-123458',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '未付款',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'ORD-123459',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '未付款',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'ORD-123460',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '未付款',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'ORD-123461',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '未付款',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'ORD-123462',
      orderDate: '2025/01/02',
      paymentMethod: '信用卡',
      totalAmount: 1997,
      status: '未付款',
      products: [
        {
          img: '/product_img/product1.png',
          name: '潔牙骨',
          qty: 2,
          spec: '中型',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
  ]

  const testSitterOrders = [
    {
      orderId: 'SIT-987654',
      orderDate: '2025/03/05',
      paymentMethod: '信用卡',
      totalAmount: 2500,
      status: '已付款',
      sitters: [
        {
          name: '林小旻',
          spec: '2025/08/08 下午:1500-1700',
          img: '/product_img/product1.png',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
    {
      orderId: 'SIT-987656',
      orderDate: '2025/03/05',
      paymentMethod: '信用卡',
      totalAmount: 2500,
      status: '已付款',
      sitters: [
        {
          name: '林小旻',
          spec: '2025/08/08 下午:1500-1700',
          img: '/product_img/product1.png',
          price: 199,
          originalPrice: 299,
        },
      ],
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const orders = activeTab === 'products' ? testProductOrders : testSitterOrders

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
              狗狗保母
            </button>
          </div>

          {/* 根據 activeTab 顯示訂單卡片列表 */}
          <div className="mt-3">
            {activeTab === 'products' &&
              paginatedOrders.map((order, index) => (
                <ProductOrderCard
                  key={order.orderId}
                  orderId={order.orderId}
                  orderDate={order.orderDate}
                  paymentMethod={order.paymentMethod}
                  totalAmount={order.totalAmount}
                  status={order.status}
                  products={order.products}
                  isFirst={index === 0} // 每頁第一筆
                />
              ))}

            {activeTab === 'sitters' &&
              paginatedOrders.map((order, index) => (
                <SitterOrderCard
                  key={order.orderId}
                  orderId={order.orderId}
                  orderDate={order.orderDate}
                  paymentMethod={order.paymentMethod}
                  totalAmount={order.totalAmount}
                  status={order.status}
                  sitters={order.sitters}
                  isFirst={index === 0} // 每頁第一筆
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
    </>
  )
}
