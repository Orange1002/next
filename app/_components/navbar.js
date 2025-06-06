'use client'

import { usePathname } from 'next/navigation'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { useCart } from '@/hooks/use-cart'
import MemberAvatarDropdown from './navbar-avatar'
import MobileMenu from './MobileMenu'

export default function MyNavbar() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { totalQty = 0 } = useCart() || {}

  const getActiveKey = () => {
    if (pathname === '/') return '/'
    if (pathname.startsWith('/product')) return '/product'
    if (pathname.startsWith('/article')) return '/article'
    if (pathname.startsWith('/sitter')) return '/sitter'
    if (pathname.startsWith('/member/coupons')) return '/member/coupons'
    if (pathname.startsWith('/about')) return '/about'
    return ''
  }

  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

  // ✅ 檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/member/profile', {
          method: 'GET',
          credentials: 'include',
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

  // ✅ 若為登入頁，Navbar 不渲染
  if (pathname.includes('/member/login')) return null

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

        <Navbar.Toggle
          aria-controls="navbarMain"
          onClick={() => {
            if (window.innerWidth < 992) {
              setShowMobileMenu(true)
            }
          }}
        />

        {showMobileMenu && (
          <MobileMenu onClose={() => setShowMobileMenu(false)} />
        )}

        <Navbar.Collapse
          id="navbarMain"
          className="justify-content-end d-none d-lg-flex gap-4 align-items-center"
        >
          <Nav className="gap-27 text-uppercase" activeKey={getActiveKey()}>
            <Link href="/" passHref legacyBehavior>
              <Nav.Link eventKey="/">首頁</Nav.Link>
            </Link>
            <Link href="/product" passHref legacyBehavior>
              <Nav.Link eventKey="/product">商品</Nav.Link>
            </Link>
            <Link href="/article" passHref legacyBehavior>
              <Nav.Link eventKey="/article">文章</Nav.Link>
            </Link>
            <Link href="/sitter" passHref legacyBehavior>
              <Nav.Link eventKey="/sitter">寵物保母</Nav.Link>
            </Link>
            <Link href="/member/coupons" passHref legacyBehavior>
              <Nav.Link eventKey="/member/coupons">優惠卷</Nav.Link>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <Nav.Link eventKey="/about">關於我們</Nav.Link>
            </Link>
          </Nav>

          <div className="d-flex align-items-center gap-4">
            <MemberAvatarDropdown isAuthenticated={isAuthenticated} />
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
            <NotificationBell />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
