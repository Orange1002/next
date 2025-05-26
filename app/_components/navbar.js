'use client'

import { usePathname } from 'next/navigation'
import { Navbar, Nav, Container, Button, Form } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'

export default function MyNavbar() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 進入頁面時檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/member/profile', {
          method: 'GET',
          credentials: 'include', // 確保帶上 cookie
        })
        if (res.ok) {
          const data = await res.json()
          setIsAuthenticated(!!data?.id)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('檢查登入狀態失敗', error)
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  // admin 頁面不顯示 navbar
  if (pathname.includes('/admin')) return null

  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="top"
      className="border-bottom shadow-sm custom-navbar-padding"
    >
      <Container fluid>
        <Navbar.Brand>
          <Link href="/" className="text-decoration-none text-dark">
            <div className="logo-text">BARK &amp; BIJOU</div>
            <div className="logo-slogan">LUXURY &amp; LOVE FOR YOUR PUP</div>
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarMain" />
        <Navbar.Collapse
          id="navbarMain"
          className="justify-content-end d-none d-lg-flex gap-4 align-items-center"
        >
          <Nav className="gap-27 text-uppercase">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link className={pathname === '/' ? 'active' : ''}>
                首頁
              </Nav.Link>
            </Link>
            <Link href="/product" passHref legacyBehavior>
              <Nav.Link
                className={pathname.startsWith('/product') ? 'active' : ''}
              >
                商品
              </Nav.Link>
            </Link>
            <Link href="/article" passHref legacyBehavior>
              <Nav.Link
                className={pathname.startsWith('/article') ? 'active' : ''}
              >
                文章
              </Nav.Link>
            </Link>
            <Link href="/sitter" passHref legacyBehavior>
              <Nav.Link
                className={pathname.startsWith('/sitter') ? 'active' : ''}
              >
                寵物保母
              </Nav.Link>
            </Link>
            <Link href="/coupon" passHref legacyBehavior>
              <Nav.Link
                className={
                  pathname.startsWith('/member/coupons') ? 'active' : ''
                }
              >
                優惠卷
              </Nav.Link>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <Nav.Link
                className={pathname.startsWith('/about') ? 'active' : ''}
              >
                關於我們
              </Nav.Link>
            </Link>
          </Nav>

          <Button
            variant="light"
            className="burger-btn p-0 border-0 bg-transparent d-flex align-items-center"
          >
            <i className="bi bi-list nav-icon" />
          </Button>

          <Form className="me-3 mb-0 d-flex search-group" role="search">
            <Form.Control type="search" placeholder="搜尋" />
            <Button
              className="search-btn"
              type="submit"
              onClick={(e) => setTimeout(() => e.currentTarget.blur(), 100)}
            >
              <BiSearch style={{ color: '#cc543a' }} />
            </Button>
          </Form>

          <div className="d-flex align-items-center gap-4">
            <div className="member-dropdown">
              <Link href="/member" className="icon-link">
                <i className="bi bi-person nav-icon" />
              </Link>
              <div className="dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <Link href="/member" className="dropdown-item text-center">
                      會員中心
                    </Link>
                    <Link
                      href="/member/orders"
                      className="dropdown-item text-center"
                    >
                      我的訂單
                    </Link>
                    <Link
                      href="/member/favorite"
                      className="dropdown-item text-center"
                    >
                      我的收藏
                    </Link>
                    <Link
                      href="/member/coupons"
                      className="dropdown-item text-center"
                    >
                      我的優惠券
                    </Link>
                    <button
                      className="logout-btn mx-4"
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            'http://localhost:3005/api/member/logout',
                            {
                              method: 'POST',
                              credentials: 'include',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            }
                          )
                          if (res.ok) {
                            console.log('登出成功')
                            window.location.href = '/'
                          } else {
                            console.error('登出失敗')
                          }
                        } catch (error) {
                          console.error('登出錯誤', error)
                        }
                      }}
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <Link
                    href="/member/login"
                    className="logout-btn d-flex mx-4 text-decoration-none"
                  >
                    登入
                  </Link>
                )}
              </div>
            </div>

            <Link href="/shopcart" passHref legacyBehavior>
              <i className="bi bi-cart nav-icon" />
            </Link>
            <NotificationBell />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
