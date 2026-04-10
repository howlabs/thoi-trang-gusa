import type { ColKey, SortOrder } from "@/types"

export const PAGE_SIZE_OPTIONS = [20, 50, 100, 200] as const

export const CATEGORY_ALL = "all"
export const CATEGORY_CP = "cp"
export const CATEGORY_STOCK = "stock"

export const ALL_COLS: { key: ColKey; label: string }[] = [
  { key: "image", label: "Ảnh" },
  { key: "product", label: "Sản phẩm" },
  { key: "sku", label: "SKU" },
  { key: "price", label: "Giá bán lẻ" },
]

export const DEFAULT_COLS: ColKey[] = ALL_COLS.map((c) => c.key)

export const DEFAULT_PAGE_SIZE = 50

export const VALID_SORT_ORDERS: SortOrder[] = ["none", "az", "za"]
