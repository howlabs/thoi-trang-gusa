import { useState, useEffect } from "react"
import type { Product } from "@/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/products.json")
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (!cancelled) setProducts(data)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { products, loading }
}
