export interface Product {
  name: string | null
  variant: string | null
  sku: string | null
  type: string | null
  attr1: string | null
  image: string | null
  retail_price: number | null
}

export type ColKey = "image" | "product" | "sku" | "price"

export type SortOrder = "none" | "az" | "za"
