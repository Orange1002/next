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
    generateItemKey,
    selectedProductKeys,
    selectedSitterKeys,
    toggleSelectProduct,
    toggleSelectSitter,
    handleSelectAllProducts,
    handleSelectAllSitters,
    handleSelectAll,
    isAllProductSelected,
    isAllSitterSelected,
    isAllSelected,
  } = useCart() || {}

  // 用sweetalert2取代confirm，再加上onRemove(id)
  // 傳入購物車中項目的名稱與id
  const confirmAndRemove = (itemType, itemName, targetItem) => {
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
        onRemove(itemType, targetItem)
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

    // 檢查是否有選擇商品或保母
    const hasSelectedItems =
      selectedProductKeys.length > 0 || selectedSitterKeys.length > 0

    if (!hasSelectedItems) {
      MySwal.fire({
        title: '未選擇項目',
        text: '請先選擇要刪除的商品或保母',
        icon: 'info',
        confirmButtonColor: '#3085d6',
      })
      return
    }

    // 有選擇項目才顯示刪除確認
    MySwal.fire({
      title: '你確定要刪除所有選取的項目嗎？',
      text: `選取的商品和保母將會從購物車中移除`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fb966e',
      cancelButtonColor: '#d33',
      cancelButtonText: '取消',
      confirmButtonText: '確認刪除',
    }).then((result) => {
      if (result.isConfirmed) {
        onBatchRemove() // 執行批次刪除
        MySwal.fire({
          title: '已成功刪除!',
          text: '選取的項目已被移除',
          icon: 'success',
        })
      }
    })
  }

  const handleCheckout = () => {
    const hasSelectedProducts = selectedProductKeys.length > 0
    const hasSelectedSitters = selectedSitterKeys.length > 0

    if (!hasSelectedProducts && !hasSelectedSitters) {
      Swal.fire({
        icon: 'warning',
        title: '尚未選擇商品或保母',
        text: '請先選擇至少一項商品或保母，再進行結帳。',
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
            {items.some((item) => item.product_id) && (
              <div className="pt-3 d-none d-lg-flex gap-45 align-items-center">
                <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                  <input
                    type="checkbox"
                    checked={isAllProductSelected}
                    onChange={(e) => handleSelectAllProducts(e.target.checked)}
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
            )}
          </div>

          {/* 桌面版商品項目 */}
          {items
            .filter((item) => item.type === 'product')
            .map((item) => (
              <div
                key={`product-${item.product_id}-${item.color}-${item.size}`}
                className="d-none d-lg-flex gap-45 align-items-center bg-white mb-30"
              >
                <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                  <input
                    type="checkbox"
                    checked={selectedProductKeys.includes(
                      generateItemKey(item)
                    )}
                    onChange={() => toggleSelectProduct(item)}
                  />
                </div>

                <div className="box2 d-flex align-items-center justify-content-start p-3 text-center">
                  <Image
                    width={150}
                    height={150}
                    src={item.image}
                    alt=""
                    className="me-3"
                  />
                  {item.name}
                </div>
                <div className="d-flex flex-fill">
                  <div className="flex-item d-flex align-items-center justify-content-center">
                    <div className="d-flex flex-column gap-2">
                      {item.color && <div>顏色: {item.color}</div>}
                      {item.size && <div>尺寸: {item.size}</div>}
                      {item.packing && <div>包裝: {item.packing}</div>}
                      {item.items_group && (
                        <div>內容物: {item.items_group}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex-item d-flex align-items-center justify-content-center">
                    NT${item.price.toLocaleString()}
                  </div>
                  <div className="flex-item text-center d-flex justify-content-center align-items-center gap-1">
                    <button
                      className="btn box3 d-flex justify-content-center align-items-center"
                      onClick={() => {
                        if (item.count <= 1) {
                          confirmAndRemove('product', item.name, item)
                        } else {
                          onDecrease('product', item)
                        }
                      }}
                    >
                      -
                    </button>

                    {item.count || 1}
                    <button
                      className="btn box3 d-flex justify-content-center align-items-center"
                      onClick={() => onIncrease('product', item)}
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
                    onClick={() => confirmAndRemove('product', item.name, item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        confirmAndRemove('product', item.name, item)
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
                    key={`product-${item.product_id}-${item.color}-${item.size}`}
                    className="d-flex position-relative p-12 mb-2 mb-lg-0 border-gray2"
                  >
                    <div className="w-30 d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={selectedProductKeys.includes(
                          generateItemKey(item)
                        )}
                        onChange={() => toggleSelectProduct(item)}
                      />
                    </div>
                    <div className="box6 me-10">
                      <Image
                        width={100}
                        height={100}
                        src={item.image}
                        alt={item.name}
                        className=""
                      />
                    </div>
                    <div className="w-187">
                      <div className="box7 h-25 d-flex align-items-center">
                        {item.name}
                      </div>
                      <div className="d-flex flex-column gap-1 h-50">
                        {item.color && (
                          <div className="d-flex align-items-center">
                            顏色: {item.color}
                          </div>
                        )}
                        {item.size && (
                          <div className="d-flex align-items-center">
                            尺寸: {item.size}
                          </div>
                        )}
                        {item.packing && (
                          <div className="d-flex align-items-center">
                            包裝: {item.packing}
                          </div>
                        )}
                        {item.items_group && (
                          <div className="d-flex align-items-center">
                            內容物: {item.items_group}
                          </div>
                        )}
                      </div>

                      <div className="h-25 d-flex align-items-center justify-content-between">
                        <div>
                          NT${item.price * (item.count || 1).toLocaleString()}
                        </div>
                        <div className="text-center d-flex justify-content-center align-items-center gap-1">
                          <button
                            className="btn box3 d-flex justify-content-center align-items-center"
                            onClick={() => {
                              if (item.count <= 1) {
                                confirmAndRemove('product', item.name, item)
                              } else {
                                onDecrease('product', item)
                              }
                            }}
                          >
                            -
                          </button>
                          {item.count || 1}
                          <button
                            className="btn box3 d-flex justify-content-center align-items-center"
                            onClick={() => onIncrease('product', item)}
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
          {items.some((item) => item.sitter_id) && (
            <div className="d-none d-lg-block bg-white pt-3 mb-30 border-gray">
              <div className="d-flex gap-45 align-items-center">
                <div className="d-flex align-items-center gap-2 px-3 py-2 w-85">
                  <input
                    type="checkbox"
                    checked={isAllSitterSelected}
                    onChange={(e) => handleSelectAllSitters(e.target.checked)}
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
          )}

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
                    checked={selectedSitterKeys.includes(generateItemKey(item))}
                    onChange={() => toggleSelectSitter(item)}
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
                    src={item.image}
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
                    NT${item.price.toLocaleString()}
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex-item2 cursor-pointer d-flex align-items-center justify-content-center"
                    onClick={() => confirmAndRemove('sitter', item.name, item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        confirmAndRemove('sitter', item.name, item)
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
                        checked={selectedSitterKeys.includes(
                          generateItemKey(item)
                        )}
                        onChange={() => toggleSelectSitter(item)}
                      />
                    </div>
                    <div className="box6 me-10">
                      <Image
                        width={100}
                        height={100}
                        src={item.image}
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
                        <div>NT${item.price.toLocaleString()}</div>
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex-item2 cursor-pointer d-flex align-items-center justify-content-center"
                          onClick={() =>
                            confirmAndRemove('sitter', item.name, item)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              confirmAndRemove('sitter', item.name, item)
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
                // 切換商品＋保母的整批全選狀態
                handleSelectAll(!isAllSelected)
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
              <div>NT${totalAmount.toLocaleString()}</div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div>運費</div>
              <div className="text-color1">+NT$60</div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div>總金額</div>
              <div className="text-color2">
                NT${(totalAmount + 60).toLocaleString()}
              </div>
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
