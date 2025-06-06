'use client'

import styles from '../_styles/MobileMenu.module.scss'
import { useState } from 'react'
import Link from 'next/link'
import {
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
} from 'react-icons/fa6'

export default function MobileMenu({ onClose }) {
  const [activeItem, setActiveItem] = useState(null)

  const handleItemClick = (index) => {
    setActiveItem(index)
    onClose() // 點擊後關閉選單
  }

  const getLinkHref = (sectionTitle, itemName) => {
    switch (sectionTitle) {
      case 'home page':
        switch (itemName) {
          case '首頁':
            return '/'
          case '商品':
            return '/product'
          case '文章':
            return '/article'
          case '寵物保母':
            return '/sitter'
          case '會員':
            return '/member'
          case '購物車':
            return '/shopcart'
          case '關於我們':
            return '/about'
          default:
            return '/'
        }

      case '商品':
        switch (itemName) {
          case '食品':
            return '/product/category/food'
          case '居家':
            return '/product/category/bed'
          case '外出':
            return '/product/category/travel'
          case '清潔':
            return '/product/category/cleaning'
          case '玩具與訓練':
            return '/product/category/toys'
          case '健康':
            return '/product/category/health'
          case '服飾與配件':
            return '/product/category/clothing'
          default:
            return '/'
        }

      case '會員':
        switch (itemName) {
          case '會員資料':
            return '/member/profile/info'
          case '我的訂單':
            return '/member/orders'
          case '我的收藏':
            return '/member/favorite'
          case '優惠卷 & VIP':
            return '/member/coupons'
          default:
            return '/member'
        }

      default:
        return '/'
    }
  }

  return (
    <div className={styles.mobileMenu}>
      <div className="position-relative">
        <div
          className="d-flex justify-content-between align-items-center position-fixed w-100"
          style={{
            backgroundColor: '#2b2b2b',
            paddingTop: '40px',
            paddingInline: '40px',
          }}
        >
          <div className={styles.logo}>
            BARK & BIJOU
            <br />
            <small>Luxury & Love For Your Pup</small>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {/* Menu 區塊 */}
      <div style={{ marginTop: '55px', padding: '20px' }}>
        {[
          {
            title: 'home page',
            items: [
              '首頁',
              '商品',
              '文章',
              '寵物保母',
              '會員',
              '購物車',
              '關於我們',
            ],
          },
          {
            title: '商品',
            items: [
              '食品',
              '居家',
              '外出',
              '清潔',
              '玩具與訓練',
              '健康',
              '服飾與配件',
            ],
          },
          {
            title: '會員',
            items: ['會員資料', '我的訂單', '我的收藏', '優惠卷 & VIP'],
          },
          {
            title: '關於我們',
            items: ['品牌理念', '公司簡介', '聯絡我們'],
          },
        ].map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className={styles.pageHeading}>
              <span className={styles.line}></span>
              <span className={styles.title}>{section.title}</span>
              <span className={styles.circle}></span>
            </div>
            <div className={styles.mainMenu}>
              <ul className={styles.menu}>
                {section.items.map((item, itemIndex) => {
                  const linkHref = getLinkHref(section.title, item)
                  const itemKey = `${sectionIndex}-${itemIndex}`
                  return (
                    <li
                      key={itemIndex}
                      className={activeItem === itemKey ? styles.active : ''}
                      onClick={() => handleItemClick(itemKey)}
                    >
                      <Link href={linkHref} className={styles.menuLink}>
                        {item}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}

        {/* 社群圖示 */}
        <div className={styles.socialIcons}>
          <Link href="#" title="Facebook">
            <FaFacebookF size={22} />
          </Link>
          <Link href="#" title="YouTube">
            <FaYoutube size={22} />
          </Link>
          <Link href="#" title="X (Twitter)">
            <FaXTwitter size={22} />
          </Link>
          <Link href="#" title="Instagram">
            <FaInstagram size={22} />
          </Link>
        </div>
      </div>
    </div>
  )
}
