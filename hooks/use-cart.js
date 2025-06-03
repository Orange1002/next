import { createContext, useContext, useState, useEffect } from 'react'

// context套用第1步: 建立context
// createContext的傳入參數defaultValue也有備援值(context套用失敗或錯誤出現的值)
// 以下為jsdoc的註解，這個註解是用來描述這個context的值的結構
/**
 * 購物車上下文，用於提供購物車相關的狀態和操作函式。
 *
 * 此上下文包含購物車的商品列表、操作函式（如增加、減少、移除商品）以及購物車的總數量和總金額。
 *
 * @typedef {Object} CartContextValue
 * @property {Array<{
 *   type: 'product' | 'sitter',
 *   product_id?: number,
 *   sitter_id?: number,
 *   name: string,
 *   price: number,
 *   count: number,
 *   color?: string,
 *   size?: string
 * }>} items - 購物車中的商品列表
 * @property {(itemType: 'product' | 'sitter', itemId: number) => void} onIncrease - 用於增加購物車中某商品數量的函式。
 * @property {(itemType: 'product' | 'sitter', itemId: number) => void} onDecrease - 用於減少購物車中某商品數量的函式。
 * @property {(itemType: 'product' | 'sitter', itemId: number) => void} onRemove - 用於移除購物車中某商品的函式。
 * @property {(itemType: 'product' | 'sitter', item: object) => void} onAdd - 用於將新商品加入購物車的函式。
 * @property {number} totalQty - 購物車中所有商品的總數量。
 * @property {number} totalAmount - 購物車中所有商品的總金額。
 */
/**
 * 購物車上下文，用於提供購物車相關的狀態和操作函式。
 *
 * @type {React.Context<CartContextValue | null>}
 */
const CartContext = createContext(null)
// 設定displayName屬性(react devtools除錯用)
CartContext.displayName = 'CartContext'

// 有共享狀態的CartProvider元件，用來包裹套嵌的元件
export function CartProvider({ children }) {
  // 購物車中的項目 與商品的物件屬性會相差一個count屬性(數字類型，代表購買數量)
  const [items, setItems] = useState([])

  // 代表是否完成第一次渲染呈現的布林狀態值(信號值)
  const [didMount, setDidMount] = useState(false)

  // 處理新增
  const onAdd = (itemType, newItem) => {
    let foundIndex = -1

    if (itemType === 'product') {
      foundIndex = items.findIndex((v) => {
        return (
          v.type === 'product' &&
          v.product_id === newItem.product_id &&
          v.color === newItem.color &&
          v.size === newItem.size &&
          v.packing === newItem.packing &&
          v.items_group === newItem.items_group
        )
      })
    }

    if (itemType === 'sitter') {
      foundIndex = items.findIndex((v) => {
        return v.type === 'sitter' && v.sitter_id === newItem.sitter_id
      })
    }

    if (foundIndex !== -1) {
      const nextItems = [...items]
      nextItems[foundIndex].count += newItem.count || 1 // 預設加 1
      setItems(nextItems)
    } else {
      const itemWithCount = { ...newItem, count: newItem.count || 1 }
      const nextItems = [itemWithCount, ...items]
      setItems(nextItems)
    }
  }

  // 處理遞增
  const onIncrease = (itemType, targetItem) => {
    const nextItems = items.map((v) => {
      if (
        itemType === 'product' &&
        v.type === 'product' &&
        v.product_id === targetItem.product_id &&
        v.color === targetItem.color &&
        v.size === targetItem.size &&
        v.packing === targetItem.packing &&
        v.items_group === targetItem.items_group
      ) {
        return { ...v, count: v.count + 1 }
      }

      if (
        itemType === 'sitter' &&
        v.type === 'sitter' &&
        v.sitter_id === targetItem.sitter_id
      ) {
        return { ...v, count: v.count + 1 }
      }

      return v
    })

    setItems(nextItems)
  }

  // 處理刪除
  const onRemove = (itemType, targetItem) => {
    const nextItems = items.filter((v) => {
      if (itemType === 'product') {
        return !(
          v.type === 'product' &&
          v.product_id === targetItem.product_id &&
          v.color === targetItem.color &&
          v.size === targetItem.size &&
          v.packing === targetItem.packing &&
          v.items_group === targetItem.items_group
        )
      }

      if (itemType === 'sitter') {
        return !(v.type === 'sitter' && v.sitter_id === targetItem.sitter_id)
      }

      return true
    })

    setItems(nextItems)
  }

  // 處理遞減
  const onDecrease = (itemType, targetItem) => {
    const nextItems = items.map((v) => {
      if (
        itemType === 'product' &&
        v.type === 'product' &&
        v.product_id === targetItem.product_id &&
        v.color === targetItem.color &&
        v.size === targetItem.size &&
        v.packing === targetItem.packing &&
        v.items_group === targetItem.items_group
      ) {
        return { ...v, count: v.count - 1 }
      }

      if (
        itemType === 'sitter' &&
        v.type === 'sitter' &&
        v.sitter_id === targetItem.sitter_id
      ) {
        return { ...v, count: v.count - 1 }
      }

      return v
    })

    setItems(nextItems)
  }

  // 勾選狀態
  const generateItemKey = (item) => {
    if (item.type === 'product') {
      return `${item.product_id}_${item.color}_${item.size}_${item.packing}_${item.items_group}`
    } else if (item.type === 'sitter') {
      return `sitter_${item.sitter_id}`
    }
    return ''
  }

  const [selectedProductKeys, setSelectedProductKeys] = useState([])
  const [selectedSitterKeys, setSelectedSitterKeys] = useState([])

  // 單獨勾選
  const toggleSelectProduct = (item) => {
    const key = generateItemKey(item)
    setSelectedProductKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const toggleSelectSitter = (item) => {
    const key = generateItemKey(item)
    setSelectedSitterKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // 判斷是否全選
  const productItems = items.filter((i) => i.type === 'product')
  const sitterItems = items.filter((i) => i.type === 'sitter')

  const allProductKeys = productItems.map(generateItemKey)
  const allSitterKeys = sitterItems.map(generateItemKey)

  const isAllProductSelected =
    selectedProductKeys.length === allProductKeys.length &&
    allProductKeys.length > 0

  const isAllSitterSelected =
    selectedSitterKeys.length === allSitterKeys.length &&
    allSitterKeys.length > 0

  // 商品 & 保母是否全部全選
  const isAllSelected =
    (allProductKeys.length === 0 || isAllProductSelected) &&
    (allSitterKeys.length === 0 || isAllSitterSelected) &&
    items.length > 0

  // 商品全選切換
  const handleSelectAllProducts = (selectAll) => {
    if (selectAll) {
      setSelectedProductKeys(allProductKeys)
    } else {
      setSelectedProductKeys([])
    }
  }

  // 保母全選切換
  const handleSelectAllSitters = (selectAll) => {
    if (selectAll) {
      setSelectedSitterKeys(allSitterKeys)
    } else {
      setSelectedSitterKeys([])
    }
  }

  // 全部全選切換（商品 + 保母一起）
  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedProductKeys(allProductKeys)
      setSelectedSitterKeys(allSitterKeys)
    } else {
      setSelectedProductKeys([])
      setSelectedSitterKeys([])
    }
  }

  // 批次刪除（刪除勾選的商品和保母）
  const onBatchRemove = () => {
    const nextItems = items.filter((item) => {
      const key = generateItemKey(item)
      if (item.type === 'product') {
        return !selectedProductKeys.includes(key)
      }
      if (item.type === 'sitter') {
        return !selectedSitterKeys.includes(key)
      }
      return true
    })

    setItems(nextItems)
    setSelectedProductKeys([])
    setSelectedSitterKeys([])
  }

  // 使用陣列的迭代方法reduce(歸納, 累加)
  // 稱為"衍生,派生"狀態(derived state)，意即是狀態的一部份，或是由狀態計算得來的值
  const totalQty = items.reduce((acc, v) => acc + v.count, 0)

  const totalAmount = items.reduce((acc, item) => {
    const key = generateItemKey(item)
    if (
      (item.type === 'product' && selectedProductKeys.includes(key)) ||
      (item.type === 'sitter' && selectedSitterKeys.includes(key))
    ) {
      return acc + item.count * item.price
    }
    return acc
  }, 0)

  // 第一次渲染完成後，從localStorage取出儲存購物車資料進行同步化
  useEffect(() => {
    const safeParse = (key) => {
      try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
      } catch {
        return []
      }
    }

    const storedItems = safeParse('cart')
    const storedSelectedProductKeys = safeParse('selectedProductKeys')
    const storedSelectedSitterKeys = safeParse('selectedSitterKeys')

    setItems(storedItems)
    setSelectedProductKeys(storedSelectedProductKeys)
    setSelectedSitterKeys(storedSelectedSitterKeys)

    setDidMount(true)
  }, [])

  // 當狀態 items 或勾選狀態有更動時，要進行和 localStorage 寫入的同步化
  useEffect(() => {
    // 排除第一次的渲染同步化工作
    if (didMount) {
      // items => localStorage (key=cart)
      localStorage.setItem('cart', JSON.stringify(items))
      localStorage.setItem(
        'selectedProductIds',
        JSON.stringify(selectedProductKeys)
      )
      localStorage.setItem(
        'selectedSitterIds',
        JSON.stringify(selectedSitterKeys)
      )
    }
  }, [items, selectedProductKeys, selectedSitterKeys, didMount])

  return (
    <>
      <CartContext.Provider
        // 如果傳出的值很多時，建議可以將數值/函式分組，然後依英文字母排序
        value={{
          items,
          totalAmount,
          totalQty,
          onAdd,
          onDecrease,
          onIncrease,
          onRemove,
          generateItemKey,
          selectedProductKeys,
          selectedSitterKeys,
          setSelectedProductKeys,
          setSelectedSitterKeys,
          toggleSelectProduct,
          toggleSelectSitter,
          handleSelectAllProducts,
          handleSelectAllSitters,
          handleSelectAll,
          onBatchRemove,
          isAllProductSelected,
          isAllSitterSelected,
          isAllSelected,
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  )
}

// 搭配上面的CartProvider專門客製化名稱的勾子，目的是提供更好的閱讀性
/**
 * 自訂 Hook，用於存取購物車的context(上下文)。
 *
 * 此 Hook 提供購物車context(上下文)的存取功能，包括購物車中的商品列表、
 * 增加、減少、移除商品數量的函式，以及計算購物車總數量與總金額的功能。
 * 使用此 Hook 時，必須在 CartProvider 的子元件中使用。
 *
 * @returns {CartContextValue} 購物車context(上下文)的值。
 *
 * @example
 * const { items, onAdd, onRemove, totalQty, totalAmount } = useCart();
 */
export const useCart = () => useContext(CartContext)
