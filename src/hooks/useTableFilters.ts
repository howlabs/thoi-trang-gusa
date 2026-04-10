import { useMemo } from "react"
import type { Product, SortOrder } from "@/types"
import { CATEGORY_ALL } from "@/constants"
import { getProductGroup, getCategory, rowKey } from "@/utils/product"

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
  const indexedProducts = useMemo(
    () =>
      products.map((product) => ({
        product,
        key: rowKey(product),
        group: product.name ? getProductGroup(product.name) : "",
        category: getCategory(product.sku),
        searchText: [product.name, product.variant, product.sku]
          .filter(Boolean)
          .join("\n")
          .toLowerCase(),
      })),
    [products]
  )

  const groups = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of indexedProducts) {
      if (entry.group) {
        map.set(entry.group, (map.get(entry.group) || 0) + 1)
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
  }, [indexedProducts])

  const filtered = useMemo(() => {
    let result = indexedProducts
    if (groupFilter !== "all") {
      result = result.filter((entry) => entry.group === groupFilter)
    }
    if (categoryFilter !== CATEGORY_ALL) {
      result = result.filter((entry) => entry.category === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((entry) => entry.searchText.includes(q))
    }
    if (showSelectedOnly && selectedRows.size > 0) {
      result = result.filter((entry) => selectedRows.has(entry.key))
    }
    if (sortOrder === "az") {
      result = [...result].sort((a, b) =>
        (a.product.name || "").localeCompare(b.product.name || "", "vi")
      )
    } else if (sortOrder === "za") {
      result = [...result].sort((a, b) =>
        (b.product.name || "").localeCompare(a.product.name || "", "vi")
      )
    }
    return result.map((entry) => entry.product)
  }, [
    indexedProducts,
    search,
    groupFilter,
    categoryFilter,
    sortOrder,
    showSelectedOnly,
    selectedRows,
  ])

  const uniqueProducts = useMemo(() => {
    const names = new Set(filtered.map((p) => p.name).filter(Boolean))
    return names.size
  }, [filtered])

  return { groups, filtered, uniqueProducts }
}
