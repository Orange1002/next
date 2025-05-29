import React from 'react'
import './_style/detail.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AiOutlineRight } from 'react-icons/ai'
import Image from 'next/image'

// React Icons
import { FaRegHeart, FaInstagram, FaYoutube, FaLine } from 'react-icons/fa'

const ArticlePage = () => {
  return (
    <main>
      <div className="d-flex align-items-center fw-light ms-5 detail-bread">
        <a href="#" className="mb-0 me-3 text-decoration-none">
          首頁
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          文章
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          文章列表
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          營養與飲食
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          冬季維持狗狗活力的中獸醫食療配方
        </a>
      </div>

      <div className="container">
        <div className="d-flex justify-content-center article-p">
          <Image
            width={780}
            height={405}
            src="../article_img/181944.png"
            alt=""
          />
        </div>

        <div className="row">
          <div className="col d-flex justify-content-center mb-5">
            <h2 className="title" style={{ fontSize: '40px' }}>
              「冬至」補氣：冬季維持狗狗活力的中獸醫食療配方
            </h2>
          </div>
        </div>

        {/* 卡片區塊 */}
        <div className="row d-flex justify-content-center mt-5">
          <div className="card mb-3 custom-card">
            <div className="row g-0">
              <div className="col-md-4">
                <Image
                  width={215}
                  height={203}
                  src="../article_img/171758376764_o.jpg"
                  className="img-fluid rounded-start object-fit-cover custom-card-photo"
                  alt="..."
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title mb-3">主治獸醫師 圖奇動物醫院</h5>
                  <p className="card-text mb-4">
                    <small className="text-body-secondary">
                      國立台灣大學獸醫系 學士
                    </small>
                  </p>
                  <p className="card-text">
                    現任 興沛動物醫院
                    主治獸醫師，擁有2486年寵物食療臨床經驗，寵物鮮食品牌【年年】共同創辦人
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 正文內容 */}
        <div className="row text-center">
          <p className="mx-auto custom-letter-spacing pb-3 border-1">
            冬至是一年中夜晚最長的一天，中醫認為此時是陰氣盛極而衰、陽氣初生的關鍵時刻，象徵著自然界生機的重新萌發。對於狗狗而言，這段時間也是調養身體、維持抵抗力的重要時期。透過合適的冬季的調理，幫助狗狗維持免疫力與活力，讓牠們健康快樂地度過寒冷的日子。本篇將介紹如何運用寵物能量補充的食療方法，幫助狗狗在寒冬也能保持最佳狀態！
          </p>
          <div className="share-area">
            <div className="col-12 d-flex justify-content-between align-items-center border-bottom pb-2">
              <p className="mt-3">2025/05/08 11:39</p>
              <div className="d-flex align-items-center py-1">
                <FaRegHeart className="share-heart me-5" />
                <p className="mb-1 me-2">分享--</p>
                <a className="me-2" href="#">
                  <FaInstagram />
                </a>
                <a className="me-2" href="#">
                  <FaYoutube />
                </a>
                <a href="#">
                  <FaLine />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 留言區 */}
        <div className="row">
          <div className="col-12 mt-5">
            <div className="mb-3 replay-area">
              <h6>留言區</h6>

              {/* 留言一 */}
              <div className="card mb-2 p-1">
                <div className="card-body">
                  <strong>使用者A：</strong>
                  <p className="mt-2 mb-2">
                    我家的狗狗冬天真的比較沒精神，謝謝分享！
                  </p>
                  <div className="reply-box">
                    <strong>使用者B：</strong>
                    <p className="mt-2 mb-2">
                      我家也是，準備給牠吃溫補食物看看。
                    </p>
                  </div>
                  <form className="mt-2 reply-box">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="回覆這則留言..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary replay-btn mt-1"
                    >
                      送出
                    </button>
                  </form>
                </div>
              </div>

              {/* 留言二 */}
              <div className="card card-replay mt-3 p-1">
                <div className="card-body">
                  <strong>使用者C：</strong>
                  <p className="mb-2 mt-2">可以推薦哪些補品嗎？</p>
                  <form className="mt-2 reply-box">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="回覆這則留言..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary replay-btn mt-1"
                    >
                      送出
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 留言底部輸入區 */}
      <div className="comment-footer">
        <form className="d-flex gap-2">
          <textarea
            className="form-control"
            placeholder=" 留下您的想法 🐶 ..."
          ></textarea>
          <button type="submit" className="btn btn-primary replay-btn">
            送出
          </button>
        </form>
      </div>
    </main>
  )
}

export default ArticlePage
