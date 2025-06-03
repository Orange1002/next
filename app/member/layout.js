'use client'
import { useAuth } from '../../hooks/use-auth'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Breadcrumb from './_components/BreadCrumb/layout'
import Sidebar from './_components/Sidebar/layout'
import { useEffect } from 'react'

const breadcrumbMap = {
  '/member': '會員中心',
  '/member/coupons': '我的優惠券',
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
  '/member/forgot-password',
  '/member/reset-password',
  '/member/register',
]

export default function MemberLayout({ children }) {
  const { isAuth, isReady } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.toString()
  const fullPath = query ? `${pathname}?${query}` : pathname

  // 檢查是否為公開頁
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    if (!isReady) return
    if (!isAuth && !isPublicPage) {
      router.replace('/member/login?type=signin')
    }
  }, [isAuth, isReady, isPublicPage, router])

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

  // 若是公開頁面（例如登入、忘記密碼等）直接渲染，不顯示 sidebar 與麵包屑
  if (isPublicPage) return children

  // 不是公開頁又沒登入，不渲染（避免閃一下再導轉）
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
