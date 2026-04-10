import { useState, useEffect } from "react"
import type { Product } from "@/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (!cancelled) setProducts(data)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const updateProduct = (sku: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => p.sku === sku ? { ...p, ...updates } : p)
    )
  }

  const refreshProducts = () => {
    setLoading(true)
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .finally(() => setLoading(false))
  }

  return { products, loading, updateProduct, refreshProducts }
}
