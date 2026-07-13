import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext, type CartContextValue, type CartItem } from './cartContext'

const STORAGE_KEY = 'rockstar-cart'
const MAX_QTY = 20

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.price === 'number' &&
        typeof item.qty === 'number' &&
        item.qty > 0,
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // armazenamento indisponivel (modo privado) — carrinho segue em memoria
    }
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue['add'] = (product) =>
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: Math.min(item.qty + 1, MAX_QTY) }
              : item,
          )
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            src: product.src,
            qty: 1,
          },
        ]
      })

    const setQty = (id: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) =>
              item.id === id ? { ...item, qty: Math.min(qty, MAX_QTY) } : item,
            ),
      )

    const remove = (id: string) =>
      setItems((prev) => prev.filter((item) => item.id !== id))

    const clear = () => setItems([])

    return {
      items,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      add,
      setQty,
      remove,
      clear,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
