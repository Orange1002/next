'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.css'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function SitterOrderCard({
  orderId,
  orderDate,
  paymentMethod,
  totalAmount,
  status,
  sitters = [],
  isFirst = false, // 新增 props 判斷是否為最新一筆
}) {
  const [isOpen, setIsOpen] = useState(false)

  // 初始時，若是最新一筆預設展開
  useEffect(() => {
    if (isFirst) setIsOpen(true)
  }, [isFirst])

  return (
    <div className={`${styles.blockOut} d-flex flex-column mb-3`}>
      <div className="d-flex justify-content-between w-100 px-3 py-3 order-header flex-column flex-lg-row gap-1 gap-lg-0">
        <div className="d-flex order-0 order-lg-0 justify-content-between justify-content-lg-start w-100">
          <div>
            <p className={styles.zh}>
              訂單編號 :
              <a href={`/orders?type=sitters/${orderId}`}>
                <span className={`${styles.en} ${styles.span}`}>{orderId}</span>
              </a>
            </p>
          </div>
          {isOpen ? (
            <FaChevronUp
              className="d-lg-none"
              role="button"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <FaChevronDown
              className="d-lg-none"
              role="button"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
        <div className="d-flex order-3 order-lg-1 w-100">
          <p className={styles.zh}>訂單日期 : </p>
          <p className="en ms-1">{orderDate}</p>
        </div>
        <div className="d-flex order-4 order-lg-2 w-100">
          <p className={`${styles.zh} ms-1`}>付款方式 : {paymentMethod}</p>
        </div>
        <div className="d-flex order-5 order-lg-3 w-100">
          <p className={styles.zh}>訂單金額 : </p>
          <p className={`${styles.en} ms-1`}>${totalAmount}</p>
        </div>
        <div className="d-flex order-1 order-lg-4 w-100">
          <p className={`${styles.zh} w-100`}>
            訂單狀態 : <span className={styles.zh}>{status}</span>
          </p>
          {isOpen ? (
            <FaChevronUp
              className="order-lg-5 d-none d-lg-block"
              role="button"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <FaChevronDown
              className="order-lg-5 d-none d-lg-block"
              role="button"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="pb-3 ps-3 pe-3 pe-lg-0">
          <div className="mb-2 d-flex">
            <p className="zh">狗狗保母</p> -{' '}
            <span className="zh">{sitters.length}件</span>
          </div>
          <div className="row g-0 h-100">
            <div className="col-12 col-lg-9 mb-3 mb-lg-0">
              <div className={`${styles.blockIn} p-3 d-flex flex-column gap-3`}>
                {sitters.map((sitter, index) => (
                  <div className="d-flex" key={index}>
                    <div
                      className={`${styles.productImg} ratio ratio-1x1 me-3`}
                      style={{ width: 80 }}
                    >
                      <Image
                        src={sitter.img}
                        alt={sitter.name}
                        width={80}
                        height={80}
                        className="object-fit-cover h-100 w-100 rounded-circle"
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <p>保母名稱 : {sitter.name}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>預約時段 : {sitter.spec}</p>
                      </div>
                      <div className="d-flex justify-content-end gap-1">
                        {sitter.originalPrice && <s>${sitter.originalPrice}</s>}
                        <p className="mb-0">${sitter.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-3 d-flex flex-column justify-content-end gap-2 align-items-center pb-lg-1">
              <Link
                href={`/member/orders/detail/${orderId}`}
                className={styles.btnCustom}
              >
                訂單詳情
              </Link>
              {/* 只有訂單狀態是「已完成」才顯示「去評價」 */}
              {status === '已完成' && (
                <Link
                  href={`/member/orders/orders/${orderId}`}
                  className={styles.btnCustom}
                >
                  去評價
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
