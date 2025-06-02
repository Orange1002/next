'use client'

import Link from 'next/link'
import styles from './layout.module.css'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../../hooks/use-auth'

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  const { member, isReady } = useAuth()
  const baseUrl = 'http://localhost:3005'

  if (!isReady) return null
  if (!member) return null

  const timestamp = new Date().getTime()

  const defaultImg = '/member/member_images/user-img.svg'
  const imageSrc =
    member.image_url && member.image_url !== ''
      ? member.image_url.startsWith('http')
        ? `${member.image_url}?t=${timestamp}`
        : `${baseUrl}${member.image_url}?t=${timestamp}`
      : `${baseUrl}${defaultImg}?t=${timestamp}`

  return (
    <aside
      className={`col-2 d-none d-lg-flex flex-column p-3 mt-5 ${styles.aside}`}
    >
      {/* 頭貼 */}
      <div className="d-flex justify-content-center align-items-center flex-column mb-4">
        <div
          className={`rounded-circle border-3 overflow-hidden d-flex justify-content-center align-items-center ${styles.memberImg}`}
        >
          <Image
            key={imageSrc}
            src={imageSrc}
            alt="使用者頭貼"
            width={100}
            height={100}
            className="object-fit-cover w-100 h-100"
            priority
          />
        </div>
        <p className="fs-5 fw-light mb-0 mt-3 d-flex flex-wrap text-break">
          hi, {member.username}
        </p>
      </div>

      {/* 選單列表 */}
      <div className="list-group w-100">
        <div className="px-3 py-2 fw-bold">會員資料</div>
        <Link
          href="/member/profile/info"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname.startsWith('/member/profile/info') ? styles.active : ''
          }`}
        >
          會員基本資料
        </Link>
        <Link
          href="/member/profile/dogs"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname.startsWith('/member/profile/dogs') ? styles.active : ''
          }`}
        >
          會員狗狗資料
        </Link>
        <Link
          href="/member/profile/recipient"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname.startsWith('/member/profile/recipient')
              ? styles.active
              : ''
          }`}
        >
          常用收件人
        </Link>
        <Link
          href="/member/profile/changepassword"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname.startsWith('/member/profile/changepassword')
              ? styles.active
              : ''
          }`}
        >
          修改密碼
        </Link>

        <div className="px-3 py-2 fw-bold">我的訂單</div>
        <Link
          href="/member/orders?type=products"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname === '/member/orders' && type === 'products'
              ? styles.active
              : ''
          }`}
        >
          狗狗用品訂單
        </Link>
        <Link
          href="/member/orders?type=sitters"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname === '/member/orders' && type === 'sitters'
              ? styles.active
              : ''
          }`}
        >
          寵物保母訂單
        </Link>

        <div className="px-3 py-2 fw-bold">我的收藏</div>
        <Link
          href="/member/favorite?type=products"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname === '/member/favorite' && type === 'products'
              ? styles.active
              : ''
          }`}
        >
          狗狗用品收藏
        </Link>
        <Link
          href="/member/favorite?type=sitters"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname === '/member/favorite' && type === 'sitters'
              ? styles.active
              : ''
          }`}
        >
          狗狗保母收藏
        </Link>
        <Link
          href="/member/favorite?type=article"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname === '/member/favorite' && type === 'article'
              ? styles.active
              : ''
          }`}
        >
          文章收藏
        </Link>
        <Link
          href="/member/favorite?type=event"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname === '/member/favorite' && type === 'event'
              ? styles.active
              : ''
          }`}
        >
          活動收藏
        </Link>

        <div className="px-3 py-2 fw-bold">其他</div>
        <Link
          href="/article"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem}`}
        >
          我的文章
        </Link>
        <Link
          href="/member/coupons"
          className={`border-bottom py-2 ps-4 pe-0 ${styles.listGroupItem} ${
            pathname.startsWith('/member/coupons') ? styles.active : ''
          }`}
        >
          我的優惠券
        </Link>
      </div>
    </aside>
  )
}
