'use client'

import { useAuth } from '../../hooks/use-auth'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Breadcrumb from './_components/BreadCrumb/layout'
import Sidebar from './_components/Sidebar/layout'
import { useMemo, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const breadcrumbMap = {
  '/member': '會員中心',
  '/member/coupons': '優惠券與會員等級',
  '/member/coupons/points-history': 'vip點數歷史',
  '/member/favorite': '我的收藏',
  '/member/favorite?type=products': '狗狗用品收藏',
  '/member/favorite?type=articles': '文章收藏',
  '/member/orders': '我的訂單',
  '/member/orders?type=products': '狗狗用品訂單',
  '/member/orders?type=sitters': '寵物保母訂單',
  '/member/profile': '會員資料',
  '/member/profile/info': '會員基本資料',
  '/member/profile/info/edit': '會員基本資料編輯',
  '/member/profile/dogs': '會員狗狗資料',
  '/member/profile/dogs/add': '新增狗狗',
  '/member/profile/dogs/edit': '編輯狗狗資料',
  '/member/profile/recipient': '常用收件人',
  '/member/profile/recipient/add': '新增常用收件人',
  '/member/profile/recipient/edit': '編輯常用收件人',
  '/member/profile/changepassword': '修改密碼',
}

// 公開頁面白名單
const publicPages = [
  '/member/login',
  '/member/forgotpassword',
  '/member/forgotpassword/resetpassword',
]

export default function MemberLayout({ children }) {
  const { isAuth, isReady } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false) // 控制跳轉中狀態

  const query = searchParams.toString()
  const fullPath = query ? `${pathname}?${query}` : pathname

  // /member 自動跳到 /member/profile/info
  useEffect(() => {
    if (!isReady) return
    if (pathname === '/member') {
      router.replace('/member/profile/info')
    }
  }, [pathname, isReady, router])

  const isPublicPage = useMemo(() => {
    return publicPages.includes(pathname)
  }, [pathname])

  useEffect(() => {
    if (!isReady) return
    if (!isAuth && !isPublicPage && !redirecting) {
      setRedirecting(true)
      Swal.fire({
        icon: 'warning',
        title: '請先登入',
        showConfirmButton: false,
        timer: 1500,
        background: '#e3f2fd',
        color: '#ed784a',
      }).then(() => {
        router.replace('/')
      })
    }
  }, [isAuth, isReady, isPublicPage, router, redirecting])

  const generateBreadcrumbItems = () => {
    const items = [{ label: '首頁', href: '/' }]
    const segments = pathname.split('/').filter(Boolean)
    let path = ''
    for (let i = 0; i < segments.length; i++) {
      path += '/' + segments[i]
      const label = breadcrumbMap[path]
      if (label) {
        items.push({ label, href: path })
      }
    }
    if (fullPath !== pathname && breadcrumbMap[fullPath]) {
      const fullLabel = breadcrumbMap[fullPath]
      if (!items.some((item) => item.label === fullLabel)) {
        items.push({ label: fullLabel, href: fullPath })
      }
    }
    return items
  }

  // 尚未準備好資料時不渲染
  if (!isReady) return null

  // 如果是公開頁面，直接渲染 children，不顯示 sidebar、breadcrumb
  if (isPublicPage) return children

  // 非公開頁且未登入，跳轉中不渲染任何內容，避免閃爍
  if (!isAuth) return null

  return (
    <main>
      <Breadcrumb items={generateBreadcrumbItems()} />
      <div className="container mt-4">
        <div className="row g-0 mb-5 justify-content-end">
          <Sidebar />
          <section className="col-12 col-lg-10 ps-lg-4 mt-lg-5 d-flex flex-column justify-content-start">
            {children}
          </section>
        </div>
      </div>
    </main>
  )
}
