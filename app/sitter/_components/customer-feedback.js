'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../_styles/style-sitter-list.scss'

export default function ComponentsCustomerFeedback(props) {
  return (
    <>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3">
            <div className="flex-grow-1 border-top border-3 border-dark title-line" />
            <h2 className="text-secondary section-title">客戶反饋</h2>
            <div className="rounded-circle bg-dark dot-circle" />
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          {/* 卡片項目 x6 */}
          {/* 以下是卡片模板，可重複使用六次 */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <Image
                src="/images/craiyon_103140_dog_playing_in_the_park.png"
                className="card-img-top"
                alt="客戶圖片"
                width={345}
                height={210}
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                非常專業又親切！
                第一次使用就感覺非常放心，保母照顧得好仔細，孩子都不想回家了！
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <Image
                src="\images\craiyon_102958_dog_playing_in_the_park.png"
                className="card-img-top"
                alt="客戶圖片"
                width={345}
                height={210}
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                五星推薦！ 從預約到服務結束，每一個流程都很順暢，還會再來使用！
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <Image
                src="\images\craiyon_103302_dog.png"
                className="card-img-top"
                alt="客戶圖片"
                width={345}
                height={210}
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                寵物明顯變開朗！
                我家狗狗原本怕生，但回來後變得更開朗，感覺被用心照顧！
              </div>
            </div>
          </div>
          {/* 再複製上面 .col 這段共 5 次，修改文字即可 */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <Image
                src="\images\craiyon_103309_dog.png"
                className="card-img-top"
                alt="客戶圖片"
                width={345}
                height={210}
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                彈性又可靠的安排 臨時改時間也能配合，真的替我們減少好多壓力。
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <Image
                src="\images\craiyon_103316_dog.png"
                className="card-img-top"
                alt="客戶圖片"
                width={345}
                height={210}
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                照片與回報都很即時！
                期間有收到多張照片和即時回報，讓我們很安心。
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow h-100">
              <Image
                src="\images\Corgi.jpg"
                className="card-img-top"
                alt="客戶圖片"
                width={345}
                height={210}
              />
              <div
                className="card-body bg-white text-secondary text-center text-uppercase fw-semibold"
                style={{ letterSpacing: 2 }}
              >
                服務值得信賴 整體感受就是兩個字：「放心」。每次回來都精神超好！
              </div>
            </div>
          </div>
          {/* 再貼三個類似卡片 */}
        </div>
        <div className="text-center mt-5">
          <a
            href=""
            className="btn btn-lg bgc-primary text-white fw-bold px-5 py-3"
            style={{ letterSpacing: 5 }}
          >
            查看更多
          </a>
        </div>
      </div>
    </>
  )
}
