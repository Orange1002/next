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
  const onIncrease = (itemType, itemId) => {
    const nextItems = items.map((v) => {
      if (
        (itemType === 'product' && v.product_id == itemId) ||
        (itemType === 'sitter' && v.sitter_id == itemId)
      ) {
        // 如果比對出id=itemId的成員，則進行再拷貝物件，並且作修改`count: v.count+1`
        return { ...v, count: v.count + 1 }
      } else {
        // 否則回傳原本物件
        return v
      }
    })

    // 3 設定到狀態
    setItems(nextItems)
  }

  // 處理刪除
  const onRemove = (itemType, itemId) => {
    const nextItems = items.filter((v, i) => {
      // 過濾出id不為itemId的物件資料
      if (itemType === 'product') return v.product_id !== itemId
      if (itemType === 'sitter') return v.sitter_id !== itemId
      return true
    })
    // 3
    setItems(nextItems)
  }

  // 處理遞減
  const onDecrease = (itemType, itemId) => {
    const nextItems = items.map((v) => {
      if (
        (itemType === 'product' && v.product_id == itemId) ||
        (itemType === 'sitter' && v.sitter_id == itemId)
      ) {
        // 如果比對出id=itemId的成員，則進行再拷貝物件，並且作修改`count: v.count-1`
        return { ...v, count: v.count - 1 }
      } else {
        // 否則回傳原本物件
        return v
      }
    })

    // 3 設定到狀態
    setItems(nextItems)
  }

  // 處理全部刪除
  const onBatchRemove = (productIds = [], sitterIds = []) => {
    const nextItems = items.filter((item) => {
      if (item.type === 'product') {
        return !productIds.includes(item.product_id)
      }
      if (item.type === 'sitter') {
        return !sitterIds.includes(item.sitter_id)
      }
      return true
    })
    setItems(nextItems)
  }

  // 處理勾選商品
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [selectedSitterIds, setSelectedSitterIds] = useState([])

  // 商品是否被勾選
  const toggleSelectProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  // 保姆是否被勾選
  const toggleSelectSitter = (sitterId) => {
    setSelectedSitterIds((prev) =>
      prev.includes(sitterId)
        ? prev.filter((id) => id !== sitterId)
        : [...prev, sitterId]
    )
  }

  // 勾選所有商品ID
  const setAllSelectedProductIds = (ids) => {
    setSelectedProductIds(ids)
  }

  // 勾選所有保姆ID
  const setAllSelectedSitterIds = (ids) => {
    setSelectedSitterIds(ids)
  }

  // 是否全部選取（商品與保姆）
  const isAllSelected =
    selectedProductIds.length ===
      items.filter((item) => item.type === 'product').length &&
    selectedSitterIds.length ===
      items.filter((item) => item.type === 'sitter').length &&
    items.length > 0

  // 切換全部選取 / 取消選取
  const handleSelectAllChange = (selectAll) => {
    if (selectAll) {
      const allProductIds = items
        .filter((item) => item.type === 'product')
        .map((item) => item.product_id)

      const allSitterIds = items
        .filter((item) => item.type === 'sitter')
        .map((item) => item.sitter_id)

      setAllSelectedProductIds(allProductIds)
      setAllSelectedSitterIds(allSitterIds)
    } else {
      setAllSelectedProductIds([])
      setAllSelectedSitterIds([])
    }
  }

  // 使用陣列的迭代方法reduce(歸納, 累加)
  // 稱為"衍生,派生"狀態(derived state)，意即是狀態的一部份，或是由狀態計算得來的值
  const totalQty = items.reduce((acc, v) => acc + v.count, 0)
  const totalAmount = items.reduce((acc, item) => {
    if (
      (item.type === 'product' &&
        selectedProductIds.includes(item.product_id)) ||
      (item.type === 'sitter' && selectedSitterIds.includes(item.sitter_id))
    ) {
      return acc + item.count * item.price
    }
    return acc
  }, 0)

  // 第一次渲染完成後，從localStorage取出儲存購物車資料進行同步化
  useEffect(() => {
    // 讀取localStorage資料(key為cart)，如果不存在會使用空陣列([])
    const storedItems = JSON.parse(localStorage.getItem('cart')) || []
    const storedSelectedProductIds =
      JSON.parse(localStorage.getItem('selectedProductIds')) || []
    const storedSelectedSitterIds =
      JSON.parse(localStorage.getItem('selectedSitterIds')) || []
    // 設定到購物車狀態中 localStroage (key=cart) ===> items
    setItems(storedItems)
    setSelectedProductIds(storedSelectedProductIds)
    setSelectedSitterIds(storedSelectedSitterIds)
    // 第一次渲染已完成
    setDidMount(true)
  }, [])

  // 當狀態items有更動時，要進行和loalStorage寫入的同步化
  useEffect(() => {
    // 排除第一次的渲染同步化工作
    if (didMount) {
      // items ===>  localStroage (key=cart)
      localStorage.setItem('cart', JSON.stringify(items))
      localStorage.setItem(
        'selectedProductIds',
        JSON.stringify(selectedProductIds)
      )
      // console.log(items)
      localStorage.setItem(
        'selectedSitterIds',
        JSON.stringify(selectedSitterIds)
      )
    }
    // eslint-disable-next-line
  }, [items, selectedProductIds, selectedSitterIds])

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
          onBatchRemove,
          selectedProductIds,
          selectedSitterIds,
          setSelectedProductIds,
          setSelectedSitterIds,
          toggleSelectProduct,
          toggleSelectSitter,
          setAllSelectedProductIds,
          setAllSelectedSitterIds,
          isAllSelected,
          handleSelectAllChange,
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
