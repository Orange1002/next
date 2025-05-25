'use client'

import Breadcrumb from './_components/Breadcrumb/Breadcrumb'
import ProductDescription from './_components/ProductDescription/ProductDescription'
import ProductSpecs from './_components/ProductSpecs/ProductSpecs'
import RelatedProductList from './_components/RelatedProductList/RelatedProductList'
import styles from './_styles/Page.module.scss'
import CouponCard from './_components/couponCard/CouponCard'

const products = [
  {
    image: '/product-img/related-products1.png',
    name: '好食·金屬寵器台｜冷冽黑 & 云白 M',
    price: 'NT$3,500',
  },
  {
    image: '/product-img/related-products1.png',
    name: '好食·金屬寵器台｜冷冽黑 & 云白 M',
    price: 'NT$3,500',
  },
  {
    image: '/product-img/related-products2.png',
    name: '法式陶瓷餐碗｜象牙白 S',
    price: 'NT$2,680',
  },
  {
    image: '/product-img/related-products3.png',
    name: '森林感防水墊｜M 號',
    price: 'NT$1,290',
  },
]

export default function ProductDetailPage() {
  return (
    <div className={styles.mainWrapper}>
      <main className={styles.main}>
        <section className={styles.productDetailSection1}>
          <Breadcrumb />

          <div className={`${styles.couponList} container`}>
            {/* 在這裡放你的 coupon 元件 */}
            <CouponCard
              title="6/01 限時 7-ELEVEN 免運券"
              date="2025.06.01 起生效"
              minSpend={399}
            />
          </div>
          <section className={styles.productDetailSection11}></section>
        </section>

        <section className={styles.productDetailSection2}>
          <div className={styles.section2Container}>
            <div className={styles.descriptionContainer}>
              <div className={styles.productInfo}>
                <ProductSpecs
                  specs={[
                    {
                      title: '有效期限',
                      items: ['2025年6月1日 00:00 - 2025年6月15日 23:59'],
                    },
                    {
                      title: '優惠內容',
                      items: [
                        '數量有限，先用先贏！5% 螞幣回饋，低消 $2,000，最高回饋 400 螞幣',
                      ],
                    },
                    {
                      title: '商品',
                      items: [
                        '1按照您所在國家／地區的法規；或此商品有參加品牌會員專享購，因此無法參加促銷活動。',
                      ],
                    },
                    { title: '付款', items: ['適用於所有付款方式'] },
                    { title: '物流', items: ['適用於所有物流方式'] },
                  ]}
                />
                <ProductDescription
                  title="使用規則"
                  content={[
                    '優惠代碼【ABCD1234】\n結帳滿 $2000 元即可享有 5% 螞幣回饋，單筆最高回饋 400 螞幣，數量有限，兌完為止。（此優惠代碼為螞皮購物提供，請在購物車／結帳頁面全站優惠券入口輸入或選用。同一帳號／同一人限使用三次。）\n\n優惠代碼不適用於服務票券類商品（例如：儲值金、兌換券等）、特定電話／儲值卡／點數貼紙／遊戲虛擬點數等類別、部分娛樂收藏／電玩遊戲等類別、特定店家與特定 Dyson/Apple/Android/小米系列商品，若有任何使用上的問題請洽詢客服，我們將協助為你服務。\n\n2023/5/1起優惠券限螞皮 APP 使用，如欲使用請開啟 APP 結帳（賣場優惠券及運費抵用券不在此限）；詳其他[條款]',
                  ]}
                />
              </div>
              <RelatedProductList
                title="此優惠卷可用的商品"
                products={products}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
