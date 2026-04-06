import { useMemo } from "react"
import type { Product, SortOrder } from "@/types"
import { CATEGORY_ALL } from "@/constants"
import { getProductGroup, getCategory } from "@/utils/product"

interface FilterParams {
  products: Product[]
  search: string
  groupFilter: string
  categoryFilter: string
  sortOrder: SortOrder
  showSelectedOnly: boolean
  selectedRows: Set<string>
}

export function useTableFilters({
  products,
  search,
  groupFilter,
  categoryFilter,
  sortOrder,
  showSelectedOnly,
  selectedRows,
}: FilterParams) {
  const groups = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (p.name) {
        const g = getProductGroup(p.name)
        map.set(g, (map.get(g) || 0) + 1)
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
  }, [products])

  const filtered = useMemo(() => {
    let result = products
    if (groupFilter !== "all") {
      result = result.filter((p) => p.name && getProductGroup(p.name) === groupFilter)
    }
    if (categoryFilter !== CATEGORY_ALL) {
      result = result.filter((p) => getCategory(p.sku) === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.variant && p.variant.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      )
    }
    if (showSelectedOnly && selectedRows.size > 0) {
      result = result.filter((p) => selectedRows.has(p.sku || `${p.name}|${p.variant}`))
    }
    if (sortOrder === "az") {
      result = [...result].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "vi")
      )
    } else if (sortOrder === "za") {
      result = [...result].sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", "vi")
      )
    }
    return result
  }, [products, search, groupFilter, categoryFilter, sortOrder, showSelectedOnly, selectedRows])

  const totalStock = useMemo(
    () => filtered.reduce((sum, p) => sum + (p.stock_cn1 || 0) + (p.stock_cn3 || 0), 0),
    [filtered]
  )

  const uniqueProducts = useMemo(() => {
    const names = new Set(filtered.map((p) => p.name).filter(Boolean))
    return names.size
  }, [filtered])

  return { groups, filtered, totalStock, uniqueProducts }
}
