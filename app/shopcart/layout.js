'use client'
import { CartProvider } from '@/hooks/use-cart'

export default function RootLayout({ children }) {
  return <CartProvider>{children}</CartProvider>
}
