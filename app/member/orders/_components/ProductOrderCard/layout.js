'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.css'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function ProductOrderCard({
  orderId,
  orderNumber,
  orderDate,
  paymentMethod,
  totalAmount,
  status,
  products = [],
  isFirst = false, // 新增判斷是否為最新一筆訂單
}) {
  const [isOpen, setIsOpen] = useState(false)

  const [productId, setProductId] = useState()

  useEffect(() => {
    if (isFirst) setIsOpen(true)
  }, [isFirst])

  return (
    <div className={`${styles.blockOut} d-flex flex-column mb-3`}>
      <div className="d-flex justify-content-between w-100 px-3 py-3 order-header flex-column flex-lg-row gap-1 gap-lg-0">
        <div className="d-flex order-0 order-lg-0 justify-content-between justify-content-lg-start w-100">
          <div className="w-100">
            <p className={styles.zh}>
              訂單編號 :
              <span className={`${styles.en} ${styles.span} ps-1`}>
                {orderNumber}
              </span>
            </p>
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
        </div>
        <div className="d-flex order-3 order-lg-1 w-100">
          <p className={`${styles.zh}`}>訂單日期 : </p>
          <p className="en ms-1">{orderDate}</p>
        </div>
        <div className="d-flex order-4 order-lg-2 w-100">
          <p className={`${styles.zh} ms-1`}>付款方式 : {paymentMethod}</p>
        </div>
        <div className="d-flex order-5 order-lg-3 w-100">
          <p className={`${styles.zh}`}>訂單金額 : </p>
          <p className={`${styles.en} ms-1`}>${totalAmount}</p>
        </div>
        <div className="d-flex justify-content-between order-1 order-lg-4 w-100">
          <p className={`${styles.zh} w-100`}>
            訂單狀態 : <span className={`${styles.zh}`}>{status}</span>
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
            <p className="zh">狗狗用品</p> -{' '}
            <span className="zh">{products.length}件</span>
          </div>
          <div className="row g-0 h-100">
            <div className="col-12 col-lg-9 mb-3 mb-lg-0">
              <div className={`${styles.blockIn} p-3 d-flex flex-column gap-3`}>
                {products.map((product, index) => (
                  <div className="d-flex" key={index}>
                    <div
                      className={`${styles.productImg} ratio ratio-1x1 me-3`}
                      style={{ width: 80 }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-fit-cover h-100 w-100"
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <p>{product.name}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="zh">顏色:{product.color}</p>
                          <p className="zh">
                            規格:{product.size || product.packing}
                          </p>
                          <p className="zh">內容物:{product.items_group}</p>
                        </div>
                        <div>
                          <p className="en">x{product.quantity}</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end gap-1">
                        {product.originalPrice && (
                          <s className="en">${product.originalPrice}</s>
                        )}
                        <div>
                          <p className="en">${product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-3 d-flex flex-column justify-content-end gap-2 align-items-center">
              <Link
                href={`/member/orders/detail/${orderNumber}`}
                className={styles.btnCustom}
              >
                訂單詳情
              </Link>
              {/* 只在已完成狀態顯示去評價 */}
              {status === '已完成' && (
                <Link
                  href={`/product/${products.product_id}`}
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
