'use client'

import { usePathname } from 'next/navigation'
import { Navbar, Nav, Container, Button, Form } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'

import { useCart } from '@/hooks/use-cart'

import MemberAvatarDropdown from './navbar-avatar'

export default function MyNavbar() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef(null) // ✅ 加入 ref

  const { totalQty = 0 } = useCart() || {}

  // ✅ 點空白處收起 dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  if (pathname.includes('/member/login')) return null

  console.log('aaa')

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

          {/* <Button
            variant="light"
            className="burger-btn p-0 border-0 bg-transparent d-flex align-items-center"
          >
            <i className="bi bi-list nav-icon" />
          </Button> */}

          {/* <Form className="me-3 mb-0 d-flex search-group" role="search">
            <Form.Control type="search" name="search" placeholder="搜尋" />
            <Button
              className="search-btn"
              type="submit"
              onClick={(e) => setTimeout(() => e.currentTarget.blur(), 100)}
            >
              <BiSearch style={{ color: '#cc543a' }} />
            </Button>
          </Form> */}

          <div className="d-flex align-items-center gap-4">
            {/*  */}
            <MemberAvatarDropdown isAuthenticated={isAuthenticated} />
            {/*  */}
            <Link href="/shopcart" passHref legacyBehavior>
              <div className="position-relative">
                <i className="bi bi-cart nav-icon" />
                <div className="position-absolute circleSize">
                  {totalQty > 9 ? (
                    <>
                      <span>9</span>
                      <span style={{ fontSize: '9px' }}>+</span>
                    </>
                  ) : (
                    <span>{totalQty}</span>
                  )}
                </div>
              </div>
            </Link>
            {/*  */}
            <NotificationBell />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
