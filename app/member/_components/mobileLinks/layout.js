import Link from 'next/link'
import styles from './layout.module.css'

const mobileLinks = [
  { label: '會員基本資料', href: '/member/profile/info' },
  { label: '會員狗狗資料', href: '/member/profile/dogs' },
  // { label: '常用收件人', href: '/member/profile/recipient' },
  { label: '修改密碼', href: '/member/profile/changepassword' },
  { label: '我的訂單', href: '/member/orders?type=products' },
  { label: '我的收藏', href: '/member/favorite?type=products' },
  { label: '我的文章', href: '/article/list' },
  { label: '優惠券與會員等級', href: '/member/coupons' },
]

export default function MobileMemberMenu() {
  return (
    <div className={`${styles.block} mt-4 h-100 d-lg-none text-center`}>
      {mobileLinks.map((item) => (
        <div key={item.href} className={`${styles.box}`}>
          <Link
            href={item.href}
            className="text-decoration-none text-dark py-2"
          >
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  )
}
