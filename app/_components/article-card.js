import React, { useState } from 'react'
import { Card, Button, Collapse, Row, Col } from 'react-bootstrap'
import { FaChevronCircleRight } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'

const articleData = [
  {
    image: '/images/article1.png',
    text: '從手作料理開始，兼顧毛孩的健康與美味！',
    likes: 137,
  },
]

const collapses = [
  '文章列表',
  '熱門文章',
  '最新活動',
  '推薦知識影音',
  '收藏文章',
  '寵物問答',
]

const ArticleCard = ({ image, text, likes }) => (
  <Card className="card-s mb-3 position-relative">
    <Card.Img variant="top" src={image} className="object-fit-cover" />
    <Card.Body className="d-flex align-items-center p-4">
      <Button
        variant="link"
        className="read-more d-flex justify-content-center align-items-center p-0"
      >
        <FaChevronCircleRight />
      </Button>
      <p className="card-text card-s-p ps-3 mb-0">{text}</p>
      <div className="position-absolute bottom-0 end-0 p-3 d-flex align-items-center gap-1">
        <span className="text-muted regular">{likes}</span>
        <AiOutlineHeart />
      </div>
    </Card.Body>
  </Card>
)

export default function MyArticleCard() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section>
      {/* 小螢幕版文章卡片 */}
      <div className="d-block d-lg-none mt-5 mb-5">
        <div className="article-title d-flex align-items-center justify-content-center">
          最新文章
        </div>
        {articleData.map((item, idx) => (
          <ArticleCard key={idx} {...item} />
        ))}
      </div>

      {/* 桌面版列表 + 精選文章 */}
      <div className="container d-none d-lg-flex my-96 py-5 justify-content-center">
        <div className="article-list-group d-block">
          <div className="article-list d-flex justify-content-center align-items-center">
            <p className="mb-0 me-2">Article List</p>
            <div className="al-circle"></div>
          </div>
          {collapses.map((label, idx) => (
            <React.Fragment key={idx}>
              <a
                className="article-list-group-item list-group-item-action d-flex justify-content-between align-items-center p-4 bg-white text-decoration-none"
                onClick={(e) => {
                  e.preventDefault()
                  setOpenIndex(openIndex === idx ? null : idx)
                }}
                href={`#subCatch${idx + 1}`}
              >
                {label}
                <span>&rsaquo;</span>
              </a>
              <Collapse in={openIndex === idx}>
                <div id={`subCatch${idx + 1}`}>
                  <div className="d-flex flex-column">
                    {[
                      '飲食與營養',
                      '行為與訓練',
                      '健康與保健',
                      '戶外活動與探險',
                    ].map((cat, catIdx) => (
                      <a
                        key={catIdx}
                        href="#"
                        className="d-flex align-items-center article-list-group-item article-text-color border-bottom text-decoration-none py-2 px-3"
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
              </Collapse>
            </React.Fragment>
          ))}
        </div>

        {/* 精選文章與小卡片 */}
        <div className="d-block ms-5">
          <Card className="card-1 d-none d-xl-block">
            <Row className="g-0">
              <Col md={5}>
                <Card.Img
                  src="/images/attract_1 2.png"
                  className="img-fluid float-start"
                />
              </Col>
              <Col md={7}>
                <Card.Body className="pt-4">
                  <div className="d-flex align-items-center mt-2">
                    <Button
                      variant="link"
                      className="read-more d-flex justify-content-center align-items-center p-0"
                    >
                      <FaChevronCircleRight />
                    </Button>
                    <h5 className="card-title title-1 ms-2 mt-2">
                      從散步開始，享受毛孩的健康與美好時光！
                    </h5>
                  </div>
                  <p className="card-text big-card">
                    <span className="text-content text-break lh-base">
                      每天的散步時間，是毛孩與主人最親密的時刻。
                      無論是清晨的微風還是傍晚的夕陽，散步不僅能讓狗狗放鬆心情，
                      更是促進健康的最佳方式。但有時，毛孩可能因為缺乏運動或年齡增長，
                      走路的速度變慢，甚至對散步失去興趣。作為主人，我們該如何幫助牠們重新找回散步的樂趣與活力呢？
                    </span>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          {/* 三張卡片 */}
          <Row className="g-3 mt-5">
            {[...Array(3)].map((_, idx) => (
              <Col key={idx} xs={4}>
                <ArticleCard {...articleData[0]} />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 小螢幕查看更多按鈕 */}
      <div className="d-flex d-lg-none justify-content-center mt-5">
        <div className="btn product-btn">查看更多</div>
      </div>
    </section>
  )
}
