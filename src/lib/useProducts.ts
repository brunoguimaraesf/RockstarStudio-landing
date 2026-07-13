import { useEffect, useState } from 'react'
import { fetchProducts, type Product } from './sanity'

// undefined = carregando | null = CMS indisponivel/nao configurado | [] = CMS sem produtos
export function useProducts() {
  const [products, setProducts] = useState<Product[] | null | undefined>(
    undefined,
  )

  useEffect(() => {
    let cancelled = false

    fetchProducts().then((result) => {
      if (!cancelled) setProducts(result)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return products
}
