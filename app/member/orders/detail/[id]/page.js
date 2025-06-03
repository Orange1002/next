'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaChevronLeft } from 'react-icons/fa'
import './order_detail.scss'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function OrderDetailPage({ params }) {
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams
  console.log('number為', id)

  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [services, setServices] = useState([])

  const router = useRouter()

  const goBack = () => {
    router.push('/member/orders')
  }

  const productSubtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  )

  const sitterSubtotal = services.reduce(
    (acc, service) => acc + Number(service.price),
    0
  )
  const subtotal = productSubtotal + sitterSubtotal

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3005/api/shopcart/orderDetail?order_number=${id}`
        )
        setOrder(res.data.order)
        setItems(res.data.items)
        setServices(res.data.services)
      } catch (err) {
        console.error('載入失敗:', err)
      }
    }

    fetchData()
  }, [id])

  if (!order) return <div>Loading...</div>

  return (
    <>
      <div className="text-center">
        <h2 className="fs-3">我的訂單</h2>
      </div>
      <div>
        <div className="d-flex justify-content-between">
          <button
            className="btn border-0 btnSize d-flex align-items-center"
            onClick={goBack}
          >
            <FaChevronLeft />
            回上頁
          </button>
          <div>訂單編號 #{order.order_number}</div>
        </div>
        <hr />
        <h2 className="fs-5 mb-4">收件地址</h2>
        <div className="mb-3">{order.recipient_name}</div>
        <div className="mb-3">{order.recipient_phone}</div>
        <div className="mb-3">{order.recipient_email}</div>
        <div className="mb-3">付款方式：{order.paymentName}</div>
        <div className="mb-3">配送方式：{order.delivery_method}</div>
        {order.delivery_method === '宅配' ? (
          <div className="mb-3">
            {order.city}
            {order.town}
            {order.address}
          </div>
        ) : (
          <div className="mb-3">
            {order.city}
            <span style={{ marginRight: '0.5rem' }}>{order.store_name}</span>
            {order.store_address}
          </div>
        )}

        <hr />
        <h2 className="fs-5 mb-3">訂單項目</h2>
        <h3 className="fw-bold mb-3">寵物商品：</h3>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="box1 d-flex mb-3">
              <Image
                src={item.img}
                alt={item.name}
                width={100}
                height={100}
                className="object-fit-cover box2"
              />
              <div className="p-2 w-100 position-relative">
                <div className="mb-2">商品名稱：{item.name}</div>
                <div className="mb-2">顏色：{item.color}</div>
                <div className="mb-2">規格：{item.size || item.packing}</div>
                <div className="mb-2">包裝：{item.items_group}</div>
                <div className="mb-2 fw-semibold">x{item.quantity}</div>
                <div className="position-absolute absolute1">
                  NT${Number(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <h3 className="fw-bold mb-3">寵物保姆：</h3>
        <ul>
          {services.map((services) => (
            <li key={services.id} className="box1 d-flex mb-3">
              <Image
                src={services.img}
                alt={services.sitter_name}
                width={100}
                height={100}
                className="object-fit-cover box2"
              />
              <div className="p-2 w-100 position-relative">
                <div className="mb-2">保姆名稱：{services.sitter_name}</div>
                <div className="mb-2">預約的狗：{services.dog_name}</div>
                <div className="mb-2">
                  預約時段：{services.start_time}~{services.end_time}
                </div>
                <div className="position-absolute absolute1">
                  NT${Number(services.price).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <div className="d-flex justify-content-end">
          <div className="box3">
            <div className="mb-2 d-flex justify-content-between">
              <div className="box4 text-end">小計</div>
              <div>NT${subtotal.toLocaleString()}</div>
            </div>
            <div className="mb-2 d-flex justify-content-between">
              <div className="box4 text-end">運費</div>
              <div>+NT$60</div>
            </div>
            <div className="mb-2 d-flex justify-content-between">
              <div className="box4 text-end">優惠</div>
              <div>
                {order.discount_type === 'fixed'
                  ? ` -NT$${Number(order.discount_value).toLocaleString()}`
                  : order.discount_type === 'percentage'
                    ? ` -NT$${Math.round(subtotal * (order.discount_value / 100)).toLocaleString()}`
                    : '無優惠'}
              </div>
            </div>
            <div className="mb-2 d-flex justify-content-between fs-5">
              <div className="text-end" style={{ paddingLeft: '2px' }}>
                總計
              </div>
              <span className="text-danger">
                NT${Number(order.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
