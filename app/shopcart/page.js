'use client'
import './_styles/shopcart.scss'
import React, { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ShopcartPage() {
  const {
    items = [],
    totalAmount = 0,
    totalQty = 0,
    onDecrease = () => {},
    onIncrease = () => {},
    onRemove = () => {},
    onBatchRemove = () => {},
    selectedProductIds,
    selectedSitterIds,
    toggleSelectProduct,
    toggleSelectSitter,
    setSelectedProductIds,
    setSelectedSitterIds,
    setAllSelectedProductIds,
    setAllSelectedSitterIds,
    isAllSelected,
    handleSelectAllChange,
  } = useCart() || {}

  // 用sweetalert2取代confirm，再加上onRemove(id)
  // 傳入購物車中項目的名稱與id
  const confirmAndRemove = (itemType, itemName, itemId) => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      title: '你確定要刪除此項目?',
      text: `${itemName} 將會在購物車中被移除`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fb966e',
      cancelButtonColor: '#d33',
      cancelButtonText: '取消',
      confirmButtonText: '確認刪除',
    }).then((result) => {
      if (result.isConfirmed) {
        onRemove(itemType, itemId) // 這裡補上 itemType
        MySwal.fire({
          title: '已成功刪除!',
          text: `${itemName} 已被移除`,
          icon: 'success',
        })
      }
    })
  }

  const confirmAndRemoveAll = () => {
    const MySwal = withReactContent(Swal)

    if (selectedProductIds.length + selectedSitterIds.length === 0) {
      MySwal.fire({
        icon: 'warning',
        title: '沒有選擇任何商品',
        confirmButtonText: '確定',
        confirmButtonColor: '#fb966e',
      })
      return
    }

    MySwal.fire({
      title: '你確定要刪除選取的所有項目嗎？',
      text: `將會刪除 ${selectedProductIds.length + selectedSitterIds.length} 項商品`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fb966e',
      cancelButtonColor: '#d33',
      cancelButtonText: '取消',
      confirmButtonText: '確認刪除',
    }).then((result) => {
      if (result.isConfirmed) {
        onBatchRemove(selectedProductIds, selectedSitterIds)
        setSelectedProductIds([])
        setSelectedSitterIds([])
        MySwal.fire({
          title: '已成功刪除',
          icon: 'success',
        })
      }
    })
  }

  const handleCheckout = () => {
    const selectedCount = selectedProductIds.length + selectedSitterIds.length
    if (selectedCount === 0) {
      Swal.fire({
        icon: 'warning',
        title: '請勾選要結帳的商品',
        confirmButtonText: '確定',
        confirmButtonColor: '#fb966e',
      })
      return
    }
    router.push('/shopcart/order')
  }

  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('http://localhost:3005/api/member/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          router.replace('/member/login')
          return null
        }
        if (!res.ok) throw new Error('無法取得會員資料')
        return res.json()
      })
      .then((data) => {
        console.log({ data })
        if (data.status != 'error') {
          setIsLogin(true)
        }
        if (data) setMember(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div>載入中...</div>
  if (!member) return null

  return (
    <main>
      <div className="container">
        {/* 標題區塊 */}
        <div className="shopcart-title mt-93">
          <div className="d-flex justify-content-center p-lg-5 pt-5 fs-1">
            購物車
          </div>
          <div className="d-none d-lg-flex align-items-center justify-content-between">
            {['清單', '填寫資料', '結帳完成'].map((text, i) => (
              <div
                key={i}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={`shopcart-title-circle d-flex justify-content-center align-items-center ${
                    i === 0 ? 'bg-orange' : ''
                  }`}
                >
                  {i + 1}
                </div>
                <div className="ms-4 fs-6">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 購物車內容 */}
        <div className="shopcard-body py-3 mt-lg-5 mt-3">
          {/* 桌面版商品表頭 */}
          <div className="bg-white pt-3 mb-30 border-gray">
            <div className="d-flex justify-content-center fs-2 pb-3">
              你的購物車裡共有{totalQty}樣商品
            </div>
            <div className="pt-3 d-none d-lg-flex gap-45 align-items-center">
              <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                <input
                  type="checkbox"
                  checked={
                    selectedProductIds.length ===
                      items.filter((item) => item.type === 'product').length &&
                    items.filter((item) => item.type === 'product').length > 0
                  }
                  onChange={(e) => {
                    const checked = e.target.checked
                    if (checked) {
                      const allProductIds = items
                        .filter((item) => item.type === 'product')
                        .map((item) => item.product_id)
                      setAllSelectedProductIds(allProductIds)
                    } else {
                      setAllSelectedProductIds([])
                    }
                  }}
                />

                <label htmlFor="selectAll" className="m-0 user-select-none">
                  商品
                </label>
              </div>
              <div className="box1 d-flex align-items-center justify-content-center">
                商品名稱
              </div>
              <div className="d-flex flex-fill">
                {['規格', '價格', '數量', '統計', '操作'].map((item, idx) => (
                  <div key={idx} className="flex-item text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 桌面版商品項目 */}
          {items
            .filter((item) => item.type === 'product')
            .map((item) => (
              <div
                key={`product-${item.product_id}`}
                className="d-none d-lg-flex gap-45 align-items-center bg-white mb-30"
              >
                <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(item.product_id)}
                    onChange={() => toggleSelectProduct(item.product_id)}
                  />
                </div>

                <div className="box2 d-flex align-items-center justify-content-start p-3 text-center">
                  <Image
                    width={150}
                    height={150}
                    src={null}
                    alt=""
                    className="me-3"
                  />
                  {item.name}
                </div>
                <div className="d-flex flex-fill">
                  <div className="flex-item d-flex align-items-center justify-content-center ">
                    <div>
                      <div className="mb-2">顏色:{item.color}</div>
                      {item.size && (
                        <div className="mb-2">尺寸: {item.size}</div>
                      )}
                      {item.packing && (
                        <div className="mb-2">包裝: {item.packing}</div>
                      )}

                      <div>內容物:{item.items_group}</div>
                    </div>
                  </div>
                  <div className="flex-item d-flex align-items-center justify-content-center">
                    NT${item.price}
                  </div>
                  <div className="flex-item text-center d-flex justify-content-center align-items-center gap-1">
                    <button
                      className="btn box3 d-flex justify-content-center align-items-center"
                      onClick={() => {
                        if (item.count <= 1) {
                          confirmAndRemove(
                            'product',
                            item.name,
                            item.product_id
                          )
                        } else {
                          onDecrease('product', item.product_id)
                        }
                      }}
                    >
                      -
                    </button>
                    {item.count || 1}
                    <button
                      className="btn box3 d-flex justify-content-center align-items-center"
                      onClick={() => onIncrease('product', item.product_id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-item d-flex align-items-center justify-content-center">
                    NT${item.price * (item.count || 1)}
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex-item cursor-pointer d-flex align-items-center justify-content-center"
                    onClick={() =>
                      confirmAndRemove('product', item.name, item.product_id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        confirmAndRemove('product', item.name, item.product_id)
                      }
                    }}
                    aria-label={`刪除 ${item.name}`}
                  >
                    <FaTrash size={30} />
                  </div>
                </div>
              </div>
            ))}

          {/* 手機版商品項目 */}
          <div className="d-block d-lg-none bg-white">
            <div className="p-3 fs-4 fw-semibold border-gray">商品 :</div>
            <div className="py-10">
              {items
                .filter((item) => item.type === 'product')
                .map((item) => (
                  <div
                    key={`product-${item.product_id}`}
                    className="d-flex position-relative p-12 mb-2 mb-lg-0 border-gray2"
                  >
                    <div className="w-30 d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(item.product_id)}
                        onChange={() => toggleSelectProduct(item.product_id)}
                      />
                    </div>
                    <div className="box6 me-10">
                      <Image
                        width={100}
                        height={100}
                        src={null}
                        alt={item.name}
                        className=""
                      />
                    </div>
                    <div className="w-187">
                      <div className="box7 h-20 d-flex align-items-center">
                        {item.name}
                      </div>
                      <div className="h-2 d-flex align-items-center">
                        顏色:{item.color}
                      </div>
                      {item.size && (
                        <div className="h-20 d-flex align-items-center">
                          尺寸: {item.size}
                        </div>
                      )}

                      {item.packing && (
                        <div className="h-20 d-flex align-items-center">
                          包裝: {item.packing}
                        </div>
                      )}
                      <div className="h-20 d-flex align-items-center">
                        內容物:{item.items_group}
                      </div>
                      <div className="h-20 d-flex align-items-center justify-content-between">
                        <div>NT${item.price * (item.count || 1)}</div>
                        <div className="text-center d-flex justify-content-center align-items-center gap-1">
                          <button
                            className="btn box3 d-flex justify-content-center align-items-center"
                            onClick={() => {
                              if (item.count <= 1) {
                                confirmAndRemove(
                                  'product',
                                  item.name,
                                  item.product_id
                                )
                              } else {
                                onDecrease('product', item.product_id)
                              }
                            }}
                          >
                            -
                          </button>
                          {item.count || 1}
                          <button
                            className="btn box3 d-flex justify-content-center align-items-center"
                            onClick={() =>
                              onIncrease('product', item.product_id)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 桌面版保姆表頭 */}
          <div className="d-none d-lg-block bg-white pt-3 mb-30 border-gray">
            <div className="d-flex gap-45 align-items-center">
              <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                <input
                  type="checkbox"
                  checked={
                    selectedSitterIds.length ===
                      items.filter((item) => item.type === 'sitter').length &&
                    items.filter((item) => item.type === 'sitter').length > 0
                  }
                  onChange={(e) => {
                    const checked = e.target.checked
                    if (checked) {
                      const allSitterIds = items
                        .filter((item) => item.type === 'sitter')
                        .map((item) => item.sitter_id)
                      setAllSelectedSitterIds(allSitterIds)
                    } else {
                      setAllSelectedSitterIds([])
                    }
                  }}
                />
                <label className="m-0 user-select-none">保姆</label>
              </div>
              <div className="box1 d-flex align-items-center justify-content-center">
                保姆名稱
              </div>
              <div className="d-flex flex-fill">
                {['狗狗名稱', '日期', '價格', '操作'].map((item, idx) => (
                  <div key={idx} className="flex-item2 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 桌面版保姆項目 */}
          {items
            .filter((item) => item.type === 'sitter')
            .map((item) => (
              <div
                key={`product-${item.sitter_id}`}
                className="d-none d-lg-flex gap-45 align-items-center bg-white mb-30"
              >
                <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                  <input
                    type="checkbox"
                    checked={selectedSitterIds.includes(item.sitter_id)}
                    onChange={() => toggleSelectSitter(item.sitter_id)}
                  />

                  <label
                    className="m-0 user-select-none"
                    htmlFor={`checkbox-${item.id}`}
                  ></label>
                </div>

                <div className="box2 d-flex align-items-center justify-content-start p-3 text-center">
                  <Image
                    width={150}
                    height={150}
                    src={null}
                    alt=""
                    className="me-3"
                  />
                  {item.name}
                </div>

                <div className="d-flex flex-fill">
                  <div className="flex-item2 text-center d-flex align-items-center justify-content-center">
                    <div>{item.petname}</div>
                  </div>
                  <div className="flex-item2 d-flex align-items-center justify-content-center">
                    <div>
                      <div className="mb-2">開始:{item.start_time}</div>
                      <div>結束:{item.end_time}</div>
                    </div>
                  </div>
                  <div className="flex-item2 d-flex align-items-center justify-content-center">
                    NT${item.price}
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex-item2 cursor-pointer d-flex align-items-center justify-content-center"
                    onClick={() =>
                      confirmAndRemove('sitter', item.name, item.sitter_id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        confirmAndRemove('sitter', item.name, item.sitter_id)
                      }
                    }}
                    aria-label={`刪除 ${item.name}`}
                  >
                    <FaTrash size={30} />
                  </div>
                </div>
              </div>
            ))}

          {/* 手機版保姆項目 */}
          <div className="d-block d-lg-none bg-white mt-4">
            <div className="p-3 fs-4 fw-semibold border-gray">保姆 :</div>
            <div className="py-10">
              {items
                .filter((item) => item.type === 'sitter')
                .map((item) => (
                  <div
                    key={`product-${item.sitter_id}`}
                    className="d-flex position-relative p-12 mb-2 mb-lg-0 border-gray2"
                  >
                    <div className="w-30 d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={selectedSitterIds.includes(item.sitter_id)}
                        onChange={() => toggleSelectSitter(item.sitter_id)}
                      />
                    </div>
                    <div className="box6 me-10">
                      <Image
                        width={100}
                        height={100}
                        src={null}
                        alt={item.name}
                        className=""
                      />
                    </div>
                    <div className="w-187">
                      <div className="box7 h-25 d-flex align-items-center">
                        {item.name}
                      </div>
                      <div className="h-25 d-flex align-items-center">
                        {item.petname}
                      </div>
                      <div className="h-25 d-flex align-items-center">
                        {item.start_time}~{item.end_time}
                      </div>
                      <div className="h-25 d-flex align-items-center justify-content-between">
                        <div>NT${item.price}</div>
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex-item2 cursor-pointer d-flex align-items-center justify-content-center"
                          onClick={() =>
                            confirmAndRemove(
                              'sitter',
                              item.name,
                              item.sitter_id
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              confirmAndRemove(
                                'sitter',
                                item.name,
                                item.sitter_id
                              )
                            }
                          }}
                          aria-label={`刪除 ${item.name}`}
                        >
                          <FaTrash size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 購物車底部小計 */}
        <div className="shopcard-footer row align-items-start justify-content-between mb-5 px-12">
          <div className="col-6 d-none d-lg-flex align-items-center justify-content-start gap-3 p-0">
            <button
              className="btn box4 text-white d-flex align-items-center justify-content-center"
              onClick={() => {
                // 利用 isAllSelected 判斷狀態，切換全選與取消全選
                handleSelectAllChange(!isAllSelected)
              }}
            >
              {isAllSelected ? '取消全選' : '整批全選'}
            </button>
            <button
              className="btn box4 text-white d-flex align-items-center justify-content-center"
              onClick={confirmAndRemoveAll}
            >
              整批刪除
            </button>
          </div>

          <div className="col-lg-6 bg-white px-30 py-10">
            <div className="text-center fs-20 mb-3">購物車總計</div>
            <div className="d-flex justify-content-between mb-2">
              <div>小記</div>
              <div>NT${totalAmount}</div>
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
              onClick={handleCheckout}
              className="btn box5 text-white d-flex align-items-center justify-content-center w-100"
            >
              前往結帳
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
