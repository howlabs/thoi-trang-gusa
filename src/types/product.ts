export interface Product {
  name: string | null
  variant: string | null
  sku: string | null
  attr1: string | null
  image: string | null
  retail_price: number | null
  stock_cn1: number | null
  stock_cn3: number | null
  cost_cn1: number | null
  cost_cn3: number | null
}

export type ColKey = "image" | "product" | "sku" | "price" | "stock_cn1" | "stock_cn3"

export type SortOrder = "none" | "az" | "za"
