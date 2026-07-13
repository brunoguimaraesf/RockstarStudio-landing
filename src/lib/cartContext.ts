import { createContext, useContext } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  src: string
  qty: number
}

export type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  add: (product: {
    id: string
    name: string
    price: number
    src: string
  }) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>')
  return ctx
}
