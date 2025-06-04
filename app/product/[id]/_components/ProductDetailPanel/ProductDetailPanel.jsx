'use client'

import { useCart } from '@/hooks/use-cart'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaMinus,
  FaPlus,
} from 'react-icons/fa6'
import styles from './ProductDetailPanel.module.scss'
import HeartIcon from '@/app/product/_components/card/HeartIcon'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Swal from 'sweetalert2'

export default function ProductDetailPanel({
  productId = '',
  productSN = 'FS-XXXXX',
  productName = '預設商品名稱',
  productNote = '超取滿NT$1,000免運',
  price = 'NT$0',
  categoryId = '',
  colorOptions = [],
  sizeOptions = [],
  packOptions = [],
  contentOptions = [],
  variantCombinations = [],
  optionMap = {},
  basePrice = 0,
  isFavorite = false,
  productImage = '',
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedPack, setSelectedPack] = useState('')
  const [selectedContent, setSelectedContent] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const router = useRouter()
  const { onAdd } = useCart()

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href) // 這裡要確保不是空字串
    }
  }, [])

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

  const handleAddToCart = async () => {
    const result = await Swal.fire({
      title: '加入購物車',
      text: `確定要將「${productName}」加入購物車嗎？`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '加入',
      cancelButtonText: '取消',
    })

    if (!result.isConfirmed) return

    const mainImage =
      Array.isArray(productImage) && productImage.length > 0
        ? productImage.find((img) => img.is_primary)?.image ||
          productImage[0].image
        : ''

    const fullImageUrl = mainImage?.startsWith('/uploads/')
      ? `http://localhost:3005${mainImage}`
      : mainImage || '/uploads/default.jpg'

    const productData = {
      product_id: productId,
      category_id: categoryId,
      name: productName,
      price: finalPrice,
      color: selectedColor,
      size: selectedSize,
      packing: selectedPack,
      items_group: selectedContent,
      count: quantity,
      image: fullImageUrl,
      type: 'product',
    }

    onAdd('product', productData)
    toast.success(`"${productName}" 已加入購物車！`)
  }

  return (
    <div className={styles.productDetail}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {/* 商品 ID 與分享 */}
      <div className={styles.detailContainer1}>
        <div className={styles.idShareContainer}>
          <div className={styles.productId}>{productSN}</div>
          <div className={styles.share}>
            Share :
            {shareUrl && (
              <>
                <a
                  className={styles.shareIcon}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook style={{ color: '#929292' }} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(productName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaXTwitter style={{ color: '#929292' }} />
                </a>
              </>
            )}
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
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>

        <button
          className={styles.checkoutBtn}
          onClick={() => router.push('/shopcart')}
        >
          立即結帳
        </button>

        <div className={styles.productLinks}>
          <div className={styles.linksContainer}>
            <a href="#guide" className={styles.active}>
              尺寸指南
            </a>
            <a href="#notice">注意事項</a>
            <a href="#comments">商品評論</a>
          </div>
        </div>
      </div>
    </div>
  )
}
