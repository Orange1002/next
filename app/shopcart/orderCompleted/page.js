'use client'
import React from 'react'
import '../_styles/shopcart.scss'
import Link from 'next/link'

export default function OrderComplete() {
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
              <div className="shopcart-title-circle d-flex justify-content-center align-items-center">
                2
              </div>
              <div className="ms-4 fs-6">填寫資料</div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shopcart-title-circle d-flex justify-content-center align-items-center bg-orange">
                3
              </div>
              <div className="ms-4 fs-6">結帳完成</div>
            </div>
          </div>
        </div>

        <div className="shopcard-body py-3 mt-lg-5 mt-3">
          <div className="bg-white pt-3 mb-30 border-gray">
            <div className="d-flex justify-content-center fs-2 pb-3">
              感謝您的購買!
            </div>
            <div className="d-flex justify-content-center fs-2 pb-3">
              我們已收到您的訂單
            </div>
          </div>
          <div className="bg-white px-400 py-10">
            <div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">訂單編號:</div>
                <div>ABC123456789</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">訂單日期:</div>
                <div>2025/4/1 20:45:59</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">收件人:</div>
                <div>王小明</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">聯絡電話:</div>
                <div>0987654321</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">Email:</div>
                <div>ABC123@gamil.com</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">配送方式:</div>
                <div>宅配</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">配送地址: </div>
                <div className="box7">桃園市中壢區中央西路二段123號</div>
              </div>
              <div className="d-flex align-items-center mb-10">
                <div className="w-72 me-30">訂單總額:</div>
                <div>NT$3560</div>
              </div>
            </div>
          </div>
        </div>

        <div className="shopfooter mt-3 mb-5">
          <div className="d-flex justify-content-center align-items-center flex-column flex-lg-row">
            <div className="w-250 me-lg-5 mb-3 mb-lg-0">
              <Link
                href="/"
                className="btn box5 text-white d-flex align-items-center justify-content-center w-100"
              >
                前往主頁
              </Link>
            </div>
            <div className="w-250">
              <Link
                href="/member/orders"
                className="btn box5 text-white d-flex align-items-center justify-content-center w-100"
              >
                前往訂單
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
