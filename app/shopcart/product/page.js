'use client'

import Link from 'next/link'

// 購物車勾子
import { useCart } from '@/hooks/use-cart'

// 導入土司訊息用元件與方法
import { ToastContainer, toast } from 'react-toastify'

const initialProducts = [
  {
    product_id: 1,
    type: 'product',
    image: '',
    name: '棒球帽',
    color: '黑色',
    size: 'M',
    packing: '',
    items_group: '1頂',
    price: 300,
  },
  {
    product_id: 1,
    type: 'product',
    image: '',
    name: '棒球帽',
    color: '紅色',
    size: 'M',
    packing: '',
    items_group: '1頂',
    price: 300,
  },
  {
    product_id: 129,
    type: 'product',
    image: '',
    name: '小老板海苔',
    color: '白色',
    size: '',
    packing: '大包裝',
    items_group: '4入',
    price: 150,
  },
  {
    sitter_id: 2,
    type: 'sitter',
    image: '',
    name: '陳小美',
    pet_id: 2,
    petname: '小白',
    start_time: '04/10',
    end_time: '04/11',
    price: 150,
  },
  {
    sitter_id: 6,
    type: 'sitter',
    image: '',
    name: '王大明',
    pet_id: 1,
    petname: '小黑',
    start_time: '05/11',
    end_time: '05/16',
    price: 300,
  },
]

export default function ProductPage() {
  const { onAdd } = useCart()

  return (
    <>
      <div style={{ margin: 300 }}>
        <h2>商品列表</h2>
        <hr />
        <ul>
          {initialProducts
            .filter((item) => item.type === 'product')
            .map((product) => {
              return (
                <li key={product.product_id}>
                  {product.product_id}
                  {product.name} ({product.color})(
                  {product.size})({product.packing})({product.items_group})(NT$
                  {product.price})
                  <button
                    onClick={() => {
                      // 加入購物車狀態(context)
                      onAdd('product', product)
                      // 跳出成功訊息
                      toast.success(`"${product.name}"已成功加入購物車!`)
                    }}
                  >
                    加入購物車
                  </button>
                </li>
              )
            })}
        </ul>
        <hr />
        <h2>保姆列表</h2>
        <hr />
        <ul>
          {initialProducts
            .filter((item) => item.type === 'sitter')
            .map((sitter) => {
              return (
                <li key={sitter.sitter_id}>
                  {sitter.sitter_id}
                  {sitter.name} ({sitter.pet_id}
                  {sitter.petname})(
                  {sitter.start_time})({sitter.end_time})(NT${sitter.price})
                  <button
                    onClick={() => {
                      // 加入購物車狀態(context)
                      onAdd('sitter', sitter)
                      // 跳出成功訊息
                      toast.success(`"${sitter.name}"已成功加入購物車!`)
                    }}
                  >
                    加入購物車
                  </button>
                </li>
              )
            })}
        </ul>
        {/* 土司訊息用元件 */}
        <ToastContainer />
      </div>
    </>
  )
}
