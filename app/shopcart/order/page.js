'use client'
import '../_styles/shopcart.scss'
import React, { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2'
import { useSearchParams } from 'next/navigation'

export default function OrderPage() {
  const {
    items = [],
    totalAmount = 0,
    selectedProductIds = [],
    selectedSitterIds = [],
    onBatchRemove,
    setAllSelectedProductIds,
    setAllSelectedSitterIds,
  } = useCart() || {}

  const router = useRouter()
  const { member } = useAuth()
  const memberId = member.id

  const [formData, setFormData] = useState({
    memberId: memberId,
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    deliveryMethod: '宅配',
    recipientCity: '',
    recipientTown: '',
    recipientAddress: '',
    storeName: '',
    storeAddress: '',
    paymentMethod: '1',
    totalAmount: 0,
    orderItems: items.filter(
      (item) =>
        item.type === 'product' && selectedProductIds.includes(item.product_id)
    ),
    orderServices: items.filter(
      (item) =>
        item.type === 'sitter' && selectedSitterIds.includes(item.sitter_id)
    ),
  })

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.storeName && event.data.storeAddress) {
        setFormData((prev) => ({
          ...prev,
          storeName: event.data.storeName,
          storeAddress: event.data.storeAddress,
        }))
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const storeName = searchParams.get('storeName')
    const storeAddress = searchParams.get('storeAddress')

    if (storeName && storeAddress) {
      setFormData((prev) => ({
        ...prev,
        storeName,
        storeAddress,
        deliveryMethod: '超商取貨',
      }))
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 基本欄位驗證
    const requiredFields = [
      'recipientName',
      'recipientPhone',
      'recipientEmail',
      'deliveryMethod',
      'paymentMethod',
    ]

    // 根據配送方式加入欄位驗證
    if (formData.deliveryMethod === '宅配') {
      requiredFields.push('recipientCity', 'recipientTown', 'recipientAddress')
    } else if (formData.deliveryMethod === '超商取貨') {
      requiredFields.push('storeName', 'storeAddress')
    }

    // 檢查是否有空白欄位
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return Swal.fire({
          icon: 'warning',
          title: '欄位未填寫',
          text: '請確認所有必填欄位都已填寫',
          confirmButtonText: '確定',
          confirmButtonColor: '#fb966e',
        })
      }
    }

    const orderData = {
      memberId: memberId,
      recipientName: formData.recipientName,
      recipientPhone: formData.recipientPhone,
      recipientEmail: formData.recipientEmail,
      deliveryMethod: formData.deliveryMethod,
      recipientCity: formData.recipientCity,
      recipientTown: formData.recipientTown,
      recipientAddress: formData.recipientAddress,
      storeName: formData.storeName,
      storeAddress: formData.storeAddress,
      paymentMethod: formData.paymentMethod,
      totalAmount: totalAmount + 60,
      orderItems: items.filter(
        (item) =>
          item.type === 'product' &&
          selectedProductIds.includes(item.product_id)
      ),
      orderServices: items.filter(
        (item) =>
          item.type === 'sitter' && selectedSitterIds.includes(item.sitter_id)
      ),
    }

    try {
      const res = await fetch('http://localhost:3005/api/shopcart/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const amount = Number(orderData.totalAmount)
      onBatchRemove(selectedProductIds, selectedSitterIds)
      setAllSelectedProductIds([])
      setAllSelectedSitterIds([])

      const result = await res.json()
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '訂單建立成功！',
          text: `訂單編號：${result.orderId}`,
          confirmButtonText: '前往付款',
          confirmButtonColor: '#fb966e',
        }).then((res) => {
          if (res.isConfirmed) {
            router.push(
              `http://localhost:3005/api/shopcart/ecpay-test-only?amount=${amount}`
            )
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '訂單建立失敗',
          text: result.message || '請稍後再試',
          confirmButtonColor: '#fb966e',
        })
      }
    } catch (err) {
      console.error('送出錯誤', err)
      alert('系統錯誤，請稍後再試')
    }
  }

  return (
    <main>
      <div className="container">
        <div className="shopcart-title mt-93">
          <div className="d-flex justify-content-center p-lg-5 pt-5 fs-1">
            購物車
          </div>
          <div className="d-none d-lg-flex align-items-center justify-content-between">
            <div className="d-flex justify-content-center align-items-center">
              <div className="shopcart-title-circle d-flex justify-content-center align-items-center">
                1
              </div>
              <div className="ms-4 fs-6">清單</div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shopcart-title-circle d-flex justify-content-center align-items-center bg-orange">
                2
              </div>
              <div className="ms-4 fs-6">填寫資料</div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shopcart-title-circle d-flex justify-content-center align-items-center">
                3
              </div>
              <div className="ms-4 fs-6">結帳完成</div>
            </div>
          </div>
        </div>

        <div className="shopcard-body py-3 mt-lg-5 mt-3 mb-lg-5 mb-32">
          <div className="bg-white pt-3 mb-30 border-gray">
            <div className="d-flex justify-content-center fs-2 pb-3">
              請填入聯絡資訊
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="d-lg-flex gap-5">
              <div className="box10 bg-white px-50 py-10">
                <div className="mb-3">
                  <label htmlFor="recipientName" className="form-label">
                    收件人姓名
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipientName"
                    placeholder="請輸入收件人姓名"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="recipientPhone" className="form-label">
                    電話
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="recipientPhone"
                    placeholder="請輸入聯絡人電話"
                    name="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="recipientEmail" className="form-label">
                    電子信箱
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="recipientEmail"
                    placeholder="請輸入電子郵件"
                    name="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2">配送方式</label>
                  <br />
                  <input
                    type="radio"
                    id="home"
                    name="deliveryMethod"
                    value="宅配"
                    checked={formData.deliveryMethod === '宅配'}
                    onChange={handleChange}
                  />
                  <label htmlFor="home" className="me-3">
                    宅配
                  </label>

                  <input
                    type="radio"
                    id="store"
                    name="deliveryMethod"
                    value="超商取貨"
                    checked={formData.deliveryMethod === '超商取貨'}
                    onChange={handleChange}
                  />
                  <label htmlFor="store">超商取貨</label>
                </div>

                {formData.deliveryMethod === '宅配' && (
                  <>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label htmlFor="recipientCity" className="form-label">
                          都市名稱
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="recipientCity"
                          placeholder="請輸入都市名稱"
                          name="recipientCity"
                          value={formData.recipientCity}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label htmlFor="recipientTown" className="form-label">
                          鄉鎮市名稱
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="recipientTown"
                          placeholder="請輸入鄉鎮市名稱"
                          name="recipientTown"
                          value={formData.recipientTown}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="recipientAddress" className="form-label">
                        地址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipientAddress"
                        placeholder="請輸入地址"
                        name="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {formData.deliveryMethod === '超商取貨' && (
                  <div className="mb-3">
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn box11 d-flex align-items-center justify-content-center w-100"
                        onClick={() => {
                          window.open(
                            `https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&&servicetype=1&url=http://localhost:3005/api/shopcart/store-callback`,
                            'store',
                            'width=500,height=600'
                          )
                        }}
                      >
                        請選擇取貨門市
                      </button>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="storeName" className="form-label">
                        7-11門市名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="storeName"
                        placeholder="7-11門市名稱"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="storeAddress" className="form-label">
                        7-11門市地址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="storeAddress"
                        placeholder="7-11門市地址"
                        name="storeAddress"
                        value={formData.storeAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="mb-2">付款方式</label>
                  <br />
                  <input
                    type="radio"
                    id="creditCard"
                    name="paymentMethod"
                    value="1"
                    checked={formData.paymentMethod === '1'}
                    onChange={handleChange}
                  />
                  <label htmlFor="creditCard" className="me-3">
                    信用卡
                  </label>

                  <input
                    type="radio"
                    id="ecPay"
                    name="paymentMethod"
                    value="2"
                    checked={formData.paymentMethod === '2'}
                    onChange={handleChange}
                  />
                  <label htmlFor="ecPay">綠界付款</label>
                </div>

                {formData.paymentMethod === '1' && (
                  <>
                    <div className="row mb-3">
                      <div className="col-lg-6 mb-3">
                        <label htmlFor="cardNumber" className="form-label">
                          信用卡卡號
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardNumber"
                          placeholder="請輸入卡號"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label htmlFor="cardHolder" className="form-label">
                          持卡人姓名
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardHolder"
                          placeholder="請輸入持卡人姓名"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-6 mb-3">
                        <label htmlFor="expiryDate" className="form-label">
                          到期日(MM/YY)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="expiryDate"
                          placeholder="請輸入時間"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label htmlFor="securityCode" className="form-label">
                          CVC安全碼
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="securityCode"
                          placeholder="請輸入安全碼"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-grow-1">
                <div className="bg-white px-30 py-10 mb-30 mt-30">
                  <div className="text-center fs-20 mb-3">使用優惠卷</div>
                  <div className="row align-items-center">
                    <div className="col mb-3 mb-lg-0">
                      <button className="btn box9 d-flex align-items-center justify-content-center w-100">
                        選擇優惠卷
                      </button>
                    </div>
                    {/* <div className="col-lg-4">
                    <button className="btn box5 text-white d-flex align-items-center justify-content-center w-100">
                      使用優惠卷
                    </button>
                  </div> */}
                  </div>
                </div>

                <div className="bg-white px-30 py-10">
                  <div className="text-center fs-20 mb-3">購物車總計</div>
                  <div className="d-flex justify-content-between mb-2">
                    <div>小記</div>
                    <div>NT${totalAmount}</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div>優惠</div>
                    <div className="text-color1">-NT$0</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div>運費</div>
                    <div className="text-color1">+NT$60</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div>總金額</div>
                    <div className="text-color2">NT${totalAmount + 60}</div>
                  </div>

                  <button
                    type="submit"
                    className="btn box5 text-white d-flex align-items-center justify-content-center w-100"
                  >
                    前往結帳
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
