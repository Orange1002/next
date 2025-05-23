'use client'

import { useState } from 'react'
import {
  FaFacebook, FaXTwitter, FaInstagram,
  FaMinus, FaPlus
} from 'react-icons/fa6'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import styles from './ProductDetailPanel.module.scss'

export default function ProductDetailPanel({
  productId = 'FS-XXXXX',
  productName = '預設商品名稱',
  productNote = '超取滿NT$1,000免運',
  price = 'NT$0',
  colorOptions = [
    { name: 'White', color: '#d9d9d9' },
    { name: 'Dark Gray', color: '#505050' },
    { name: 'Orange', color: '#ed784a' },
  ],
  sizeOptions = ['S', 'M', 'L'],
}) {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.name || '')
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className={styles.productDetail}>
      {/* 商品 ID 與分享 */}
      <div className={styles.detailContainer1}>
        <div className={styles.idShareContainer}>
          <div className={styles.productId}>{productId}</div>
          <div className={styles.share}>
            Share :
            <a className={styles.shareIcon} href="#"><FaFacebook className="fa-brands fa-facebook" /></a>
            <a className={styles.shareIcon} href="#"><FaXTwitter className="fa-brands fa-x-twitter" /></a>
            <a className={styles.shareIcon} href="#"><FaInstagram className="fa-brands fa-instagram" /></a>
          </div>
        </div>

        <div className={styles.titleContainer}>
          <div className={styles.productTitle}>{productName}</div>
          <div className={styles.productNote}>
            <span>{productNote}</span>
          </div>
        </div>

        <div className={styles.priceLikeContainer}>
          <div className={styles.productPrice}>{price}</div>
          <div
            className={styles.heartIcon}
            onClick={() => setIsLiked(!isLiked)}
            style={{ cursor: 'pointer' }}
            title={isLiked ? '取消收藏' : '加入收藏'}
          >
            {isLiked ? (
              <BsHeartFill className="fa-solid fa-heart" style={{ color: '#ed784a', transition: 'color 0.2s ease' }} />
            ) : (
              <BsHeart className="fa-solid fa-heart" />
            )}
          </div>
        </div>
      </div>

      {/* 顏色與尺寸選擇 */}
      <div className={styles.detailContainer2}>
        <div className={styles.colorPicker}>
          <p className={styles.colorText}>
            Color : <span className={styles.selectedColorName}>{selectedColor}</span>
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
            <a href="#" className={styles.active}>尺寸指南</a>
            <a href="#">注意事項</a>
            <a href="#">關於產品</a>
          </div>
        </div>
      </div>
    </div>
  )
}
