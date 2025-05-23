import React from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css'
import { AiOutlineRightCircle } from 'react-icons/ai'
import Image from 'next/image'

const ArticleCardLarge = () => {
  return (
    <div className="card card-1 mt-4 d-none d-xl-block">
      <div className="row g-0">
        <div className="col-md-5">
          <Image
            width={100}
            height={100}
            src="/article_img/image-11.jpeg"
            className="h-100 w-100 img-fluid float-start"
            alt="散步與毛孩"
          />
        </div>
        <div className="col-md-7">
          <div className="card-body pt-4">
            <div className="d-flex align-items-center mt-2">
              <a href="" className="icon-link">
                <AiOutlineRightCircle className="icon" />
              </a>
              <h5 className="card-title title-1 ms-2 mt-2">
                從散步開始，享受毛孩的健康與美好時光！
              </h5>
            </div>
            <div>
              <p className="text-content text-break lh-base big-card">
                每天的散步時間，是毛孩與主人最親密的時刻。無論是清晨的微風還是傍晚的夕陽，散步不僅能讓狗狗放鬆心情，更是促進健康的最佳方式。
              </p>
              <p className="text-content text-break lh-base big-card-2">
                但有時，毛孩可能因為缺乏運動或年齡增長，走路的速度變慢，甚至對散步失去興趣。作為主人，我們該如何幫助牠們重新找回散步的樂趣與活力呢？
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleCardLarge
