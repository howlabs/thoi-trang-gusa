import { useMemo } from "react"
import type { Product } from "@/types"

export function usePagination(filtered: Product[], page: number, pageSize: number) {
  const totalPages = Math.ceil(filtered.length / pageSize)
  const pageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  )
  return { totalPages, pageData }
}
