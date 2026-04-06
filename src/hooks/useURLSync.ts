import { useMemo, useEffect } from "react"
import {
  PAGE_SIZE_OPTIONS,
  CATEGORY_ALL,
  DEFAULT_PAGE_SIZE,
  VALID_SORT_ORDERS,
} from "@/constants"
import type { SortOrder } from "@/types"

export interface URLState {
  search: string
  group: string
  category: string
  page: number
  pageSize: number
  sort: SortOrder
}

export function parseURL(): URLState {
  const sp = new URLSearchParams(window.location.search)
  const ps = Number(sp.get("ps"))
  const sort = sp.get("sort")
  return {
    search: sp.get("q") || "",
    group: sp.get("group") || "all",
    category: sp.get("cat") || CATEGORY_ALL,
    page: Math.max(1, Number(sp.get("p")) || 1),
    pageSize: PAGE_SIZE_OPTIONS.includes(ps as typeof PAGE_SIZE_OPTIONS[number]) ? ps : DEFAULT_PAGE_SIZE,
    sort: VALID_SORT_ORDERS.includes(sort as SortOrder) ? (sort as SortOrder) : "none",
  }
}

function syncURL(s: URLState) {
  const sp = new URLSearchParams()
  if (s.search) sp.set("q", s.search)
  if (s.group !== "all") sp.set("group", s.group)
  if (s.category !== CATEGORY_ALL) sp.set("cat", s.category)
  if (s.page > 1) sp.set("p", String(s.page))
  if (s.pageSize !== DEFAULT_PAGE_SIZE) sp.set("ps", String(s.pageSize))
  if (s.sort !== "none") sp.set("sort", s.sort)
  const qs = sp.toString()
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
}

export function useURLSync(state: URLState) {
  const init = useMemo(() => parseURL(), [])
  useEffect(() => {
    syncURL(state)
  }, [state])
  return init
}
