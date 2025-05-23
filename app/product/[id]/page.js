'use client'

import Breadcrumb from './_components/Breadcrumb/Breadcrumb'
import OrderNotice from './_components/OrderNotice/OrderNotice'
import ProductDescription from './_components/ProductDescription/ProductDescription'
import ProductDetailPanel from './_components/ProductDetailPanel/ProductDetailPanel'
import ProductImages from './_components/ProductImages/ProductImages'
import ProductSidebar from './_components/ProductSidebar/ProductSidebar'
import ProductSpecs from './_components/ProductSpecs/ProductSpecs'
import RelatedProductList from './_components/RelatedProductList/RelatedProductList'
import UserVoiceList from './_components/UserVoiceList/UserVoiceList'
import styles from './_styles/Page.module.scss'

const userVoices = [
  {
    date: '2024/05/19 12:34:00',
    rate: 5,
    title: '超級棒的項圈',
    content: `第一次買給狗狗的項圈就挑到這款真的很幸運！\n戴起來不會卡卡，設計也很好看。`
  },
  {
    date: '2024/05/15 08:45:10',
    rate: 4,
    title: '設計有巧思',
    content: `發光功能真的方便，晚上找狗不用再打燈。\n我家狗狗也適應得很快，推薦給大家～`
  },
  {
    date: '2024/05/10 14:05:00',
    rate: 3,
    title: '還可以',
    content: `質感不錯，不過尺寸偏小一點，建議買大一號。`
  }
]

const products = [
  {
    image: '/product-img/related-products1.png',
    name: '好食·金屬寵器台｜冷冽黑 & 云白 M',
    price: 'NT$3,500'
  },
  {
    image: '/product-img/related-products1.png',
    name: '好食·金屬寵器台｜冷冽黑 & 云白 M',
    price: 'NT$3,500'
  },
  {
    image: '/product-img/related-products2.png',
    name: '法式陶瓷餐碗｜象牙白 S',
    price: 'NT$2,680'
  },
  {
    image: '/product-img/related-products3.png',
    name: '森林感防水墊｜M 號',
    price: 'NT$1,290'
  }
]

export default function ProductDetailPage() {
  return (
    <div className={styles.mainWrapper}>
      <main className={styles.main}>
        <section className={styles.productDetailSection1}>
          <Breadcrumb />
          <div className={styles.productContainer}>
            <ProductImages />
            <ProductDetailPanel
              productId="BB-1234"
              productName="透氣撥水加工附防水膠條有簷帽深綠"
              productNote="超取滿NT$1,000免運"
              price="NT$1,290"
              colorOptions={[
                { name: 'White', color: '#d9d9d9' },
                { name: 'Dark Gray', color: '#505050' },
                { name: 'Orange', color: '#ed784a' },
              ]}
              sizeOptions={['S', 'M', 'L']}
            />

          </div>
        </section>

        <section className={styles.productDetailSection2}>
          <div className={styles.section2Container}>
            <ProductSidebar />
            <div className={styles.descriptionContainer}>
              <div className={styles.productInfo}>
                <ProductSpecs
                  specs={[
                    { title: '顏色', items: ['黑色', '咖啡色', '橄欖綠'] },
                    { title: '尺寸', items: ['頸圍：12cm～22cm', '寬度：10mm'] },
                    { title: '材質', items: ['100% 聚酯纖維'] },
                    { title: '製造國', items: ['日本'] },
                  ]}
                />
                <ProductDescription
                  title="反光幼犬項圈"
                  content={[
                    '無論您即將迎接一隻幼犬，還是已經有了可愛的毛小孩，恭喜您！從現在開始，您將迎來既充滿樂趣又（可能）有些挑戰的日子。',
                    '在愛犬成長的過程中，您一定也會獲得許多寶貴的經驗，令人期待不已。為了慶祝這個美好的時刻，freestitch 特別準備了一款幼犬訓練用項圈作為禮物，並提供免費贈送！',
                    '您可以從「Sunny Stripe（陽光條紋）」或「Reflective（反光款）」這兩種設計中擇一選擇。對於初次佩戴項圈的幼犬來說，選擇舒適、減少壓力的款式非常重要。',
                    '這款項圈為幼犬設計，適合用來幫助牠們逐步適應。歡迎大家踴躍申請！',
                    '如果您正在為迎接幼犬準備各種用品，請參考我們的推薦清單！',
                  ]}
                />
                <OrderNotice
                  content={[
                    '確認訂單後，我們將透過電子郵件邀請您協助填寫問卷。\n問卷內容如下，訂單確認後，我們會寄送回覆表單，請您填寫後提交，我們將依照完成順序安排發貨。\n\n・請準備幼犬證明文件的圖片\n・請準備幼犬的照片\n・請提供幼犬的品種與尺寸（可提供已知範圍內的資訊即可）\n・請分享您迎接幼犬後的困擾、發現或心得\n\n※ 關於幼犬證明文件\n只要能確認幼犬的出生日期，即可作為證明文件，例如：\n例）疫苗接種證明、狂犬病預防證明、寵物銷售契約書、血統證明書等\n\n※ 本活動僅限每位飼主申請一次，每隻幼犬限領取一份。\n※ 此項圈僅適用於室內訓練，外出或初次散步時，請務必佩戴正式項圈。\n※ 若僅訂購本活動商品，將以 DM（郵寄信件）方式寄送。\n\n★即使您的幼犬尚未到家，只要符合上述申請條件，也可參加！歡迎隨時與我們聯繫。',
                  ]}
                />
              </div>
              <UserVoiceList data={userVoices} />
              <RelatedProductList title="推薦商品" products={products} />

            </div>
          </div>
        </section>

      </main>
    </div>
  )
}