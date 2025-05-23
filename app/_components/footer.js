'use client'

import { usePathname } from 'next/navigation'
import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLine,
} from 'react-icons/fa'

export default function MyFooter() {
  const pathname = usePathname()

  if (pathname.includes('/admin')) return null
  return (
    <>
      {/* Desktop Footer */}
      <footer id="footer-desktop" className="d-none d-xl-block">
        <Container className="h-100">
          <Row className="h-100 align-items-center">
            <Col md={9}>
              <Row>
                <Col className="ms-4">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="fw-bold mb-4">
                      Online Store
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        首頁
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        新客優惠
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        熱門產品
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        相處課程
                      </a>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col className="me-3">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="mb-4">
                      <a className="text-decoration-none" href="">
                        常見問題
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        關於支付方式
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        關於配送方式、運費
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        隱私權政策
                      </a>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col className="">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="mb-4">
                      <a className="text-decoration-none" href="">
                        尺寸
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        禮品包裝
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none" href="">
                        標示
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a className="text-decoration-none fw-semibold" href="">
                        For Overseas Customers
                      </a>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col className="d-flex justify-content-center">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="fw-bold mb-4">
                      Brand
                    </ListGroup.Item>
                    <ListGroup.Item>品牌網站</ListGroup.Item>
                    <ListGroup.Item>公司情報</ListGroup.Item>
                    <ListGroup.Item>徵人情報</ListGroup.Item>
                    <ListGroup.Item>聯絡我們</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
            <Col md={3} className="box">
              <ListGroup variant="flush" className="d-flex flex-column">
                <ListGroup.Item className="fw-bold mb-4">
                  Social Media
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex social-icon fs-5 gap-4">
                    <a className="" href="">
                      <FaFacebook />
                    </a>
                    <a className="" href="">
                      <FaTwitter />
                    </a>
                    <a className="" href="">
                      <FaInstagram />
                    </a>
                    <a className="" href="">
                      <FaYoutube />
                    </a>
                    <a className="" href="">
                      <FaLine />
                    </a>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Mobile Footer */}
      <footer id="footer-mobile" className="d-block d-lg-none w-100 h-100 py-5">
        <Container>
          <Row>
            <Col xs={6} className="d-flex justify-content-center">
              <ListGroup variant="flush">
                <ListGroup.Item className="fw-bold mt-3">
                  Online Store
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    首頁
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    新客優惠
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    熱門產品
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    相處課程
                  </a>
                </ListGroup.Item>

                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    常見問題
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    關於支付方式
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    關於配送方式、運費
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    隱私權政策
                  </a>
                </ListGroup.Item>

                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    尺寸
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    禮品包裝
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none" href="">
                    標示
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a className="text-decoration-none fw-semibold" href="">
                    For Overseas Customers
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col xs={6}>
              <ListGroup
                variant="flush"
                className="d-flex justify-content-center"
              >
                <ListGroup.Item className="fw-bold mt-3">Brand</ListGroup.Item>
                <ListGroup.Item>品牌網站</ListGroup.Item>
                <ListGroup.Item>公司情報</ListGroup.Item>
                <ListGroup.Item>徵人情報</ListGroup.Item>
                <ListGroup.Item>聯絡我們</ListGroup.Item>
                <ListGroup.Item className="fw-bold mb-1 mt-30">
                  Social Media
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-lg-flex social-icon fs-5 gap-3 pb-3">
                    <div className="mb-2">
                      <a className="me-3" href="">
                        <FaFacebook />
                      </a>
                      <a className="me-3" href="">
                        <FaTwitter />
                      </a>
                      <a className="me-3" href="">
                        <FaInstagram />
                      </a>
                    </div>
                    <div>
                      <a className="me-3" href="">
                        <FaYoutube />
                      </a>
                      <a className="me-3" href="">
                        <FaLine />
                      </a>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}
