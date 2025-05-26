'use client'

import { useEffect, useState } from 'react'
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaMinus,
  FaPlus,
} from 'react-icons/fa6'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import styles from './ProductDetailPanel.module.scss'
import HeartIcon from '@/app/product/_components/card/HeartIcon'

export default function ProductDetailPanel({
  productId = 'FS-XXXXX',
  productName = '預設商品名稱',
  productNote = '超取滿NT$1,000免運',
  price = 'NT$0',
  colorOptions = [],
  sizeOptions = [],
  packOptions = [],
  contentOptions = [],
  variantCombinations = [],
  optionMap = {},
  basePrice = 0,
  isFavorite = false,
}) {
  const [quantity, setQuantity] = useState(1)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedPack, setSelectedPack] = useState('')
  const [selectedContent, setSelectedContent] = useState('')

  const selectedOptionIds = [
    optionMap[selectedColor],
    optionMap[selectedSize],
    optionMap[selectedPack],
    optionMap[selectedContent],
  ].filter(Boolean)

  const matchedCombination = variantCombinations.find(
    (combo) =>
      selectedOptionIds.length === combo.optionIds.length &&
      selectedOptionIds.every((id) => combo.optionIds.includes(id))
  )

  const [isLiked, setIsLiked] = useState(isFavorite)

  useEffect(() => {
    if (sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0])
    }
  }, [sizeOptions])

  useEffect(() => {
    if (colorOptions.length > 0) {
      setSelectedColor(colorOptions[0].name)
    }
  }, [colorOptions])

  useEffect(() => {
    if (packOptions.length > 0) {
      setSelectedPack(packOptions[0])
    }
  }, [packOptions])

  useEffect(() => {
    if (contentOptions.length > 0) {
      setSelectedContent(contentOptions[0])
    }
  }, [contentOptions])

  const finalPrice = basePrice + Number(matchedCombination?.price || 0)

  const toggleFavorite = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/product/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 如果你有用 cookie 驗證會員登入
        body: JSON.stringify({ productId }),
      })
      const result = await res.json()
      setIsLiked(result.favorite)
    } catch (err) {
      console.error('收藏操作失敗：', err)
    }
  }

  return (
    <div className={styles.productDetail}>
      {/* 商品 ID 與分享 */}
      <div className={styles.detailContainer1}>
        <div className={styles.idShareContainer}>
          <div className={styles.productId}>{productId}</div>
          <div className={styles.share}>
            Share :
            <a
              className={styles.shareIcon}
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook
                className="fa-brands fa-facebook"
                style={{ color: '#929292' }}
              />
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
              <FaXTwitter
                className="fa-brands fa-x-twitter"
                style={{ color: '#929292' }}
              />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="fa-brands fa-instagram"
                style={{ color: '#929292' }}
              />
            </a>
          </div>
        </div>

        <div className={styles.titleContainer}>
          <div className={styles.productTitle}>{productName}</div>
          <div className={styles.productNote}>
            <span>{productNote}</span>
          </div>
        </div>

        <div className={styles.priceLikeContainer}>
          <div className={styles.productPrice}>
            NT${finalPrice.toLocaleString()}
          </div>

          <div className={styles.heartIcon}>
            <HeartIcon productId={productId} isActive={isFavorite} />
          </div>
        </div>
      </div>

      {/* 變體選擇 */}
      <div className={styles.detailContainer2}>
        {colorOptions.length > 0 && (
          <div className={styles.colorPicker}>
            <p className={styles.colorText}>
              Color :{' '}
              <span className={styles.selectedColorName}>{selectedColor}</span>
            </p>
            <div className={styles.colorOptions}>
              {colorOptions.map(({ name, color }) => (
                <div
                  key={name}
                  className={`${styles.colorCircle} ${selectedColor === name ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(name)}
                />
              ))}
            </div>
          </div>
        )}

        {sizeOptions.length > 0 && (
          <div className={styles.sizePicker}>
            <p className={styles.sizeText}>
              Size : <span className={styles.selectedSize}>{selectedSize}</span>
            </p>
            <div className={styles.sizeOptions}>
              {sizeOptions.map((size) => (
                <div
                  key={size}
                  className={`${styles.sizeBox} ${selectedSize === size ? styles.selected : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 包裝選擇 */}
        {packOptions?.length > 0 && (
          <div className={styles.packPicker}>
            <p className={styles.packText}>
              Pack : <span className={styles.selectedPack}>{selectedPack}</span>
            </p>
            <div className={styles.packOptions}>
              {packOptions.map((pack) => (
                <div
                  key={pack}
                  className={`${styles.packBox} ${selectedPack === pack ? styles.selected : ''}`}
                  onClick={() => setSelectedPack(pack)}
                >
                  {pack}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 內容物選擇 */}
        {contentOptions?.length > 0 && (
          <div className={styles.contentPicker}>
            <p className={styles.contentText}>
              Content :{' '}
              <span className={styles.selectedContent}>{selectedContent}</span>
            </p>
            <div className={styles.contentOptions}>
              {contentOptions.map((item) => (
                <div
                  key={item}
                  className={`${styles.contentBox} ${selectedContent === item ? styles.selected : ''}`}
                  onClick={() => setSelectedContent(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 數量與按鈕區 */}
      <div className={styles.detailContainer3}>
        <div className={styles.productQuantity}>Quantity :</div>
        <div className={styles.quantityAddCart}>
          <div className={styles.quantityControls}>
            <button
              className={`${styles.qtyBtn} ${styles.minus}`}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <FaMinus className="fa-solid fa-minus" />
            </button>
            <span className={styles.qtyNumber}>{quantity}</span>
            <button
              className={`${styles.qtyBtn} ${styles.plus}`}
              onClick={() => setQuantity(quantity + 1)}
            >
              <FaPlus className="fa-solid fa-plus" />
            </button>
          </div>
          <button className={styles.addToCartBtn}>ADD TO CART</button>
        </div>

        <button className={styles.checkoutBtn}>立即結帳</button>

        <div className={styles.productLinks}>
          <div className={styles.linksContainer}>
            <a href="#" className={styles.active}>
              尺寸指南
            </a>
            <a href="#">注意事項</a>
            <a href="#">關於產品</a>
          </div>
        </div>
      </div>
    </div>
  )
}
