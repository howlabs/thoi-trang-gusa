import {
  useState,
  useMemo,
  useDeferredValue,
  useCallback,
  startTransition,
} from "react"
import { ScreenCat } from "@/components/ScreenCat"
import { FilterBar } from "@/components/FilterBar"
import { ProductTable } from "@/components/ProductTable"
import { ProductDialog } from "@/components/ProductDialog"
import { Pagination } from "@/components/Pagination"
import { PrintLabels } from "@/components/PrintLabels"
import { CloudinaryStats } from "@/components/CloudinaryStats"
import { useProducts } from "@/hooks/useProducts"
import { useURLSync, parseURL } from "@/hooks/useURLSync"
import { useTableFilters } from "@/hooks/useTableFilters"
import { usePagination } from "@/hooks/usePagination"
import { useColumnVisibility } from "@/hooks/useColumnVisibility"
import type { Product, SortOrder } from "@/types"
import { rowKey } from "@/utils/product"

export function App() {
  const init = useMemo(() => parseURL(), [])
  const { products, loading, updateProduct } = useProducts()

  const [search, setSearch] = useState(init.search)
  const [groupFilter, setGroupFilter] = useState(init.group)
  const [categoryFilter, setCategoryFilter] = useState(init.category)
  const [page, setPage] = useState(init.page)
  const [pageSize, setPageSize] = useState(init.pageSize)
  const [sortOrder, setSortOrder] = useState<SortOrder>(init.sort)
  const [selected, setSelected] = useState<Product | null>(null)
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [printProducts, setPrintProducts] = useState<Product[] | null>(null)

  const deferredSearch = useDeferredValue(search)

  useURLSync({
    search,
    group: groupFilter,
    category: categoryFilter,
    page,
    pageSize,
    sort: sortOrder,
  })

  const { columns, toggleCol, allCols } = useColumnVisibility()

  const { groups, filtered, uniqueProducts } = useTableFilters({
    products,
    search: deferredSearch,
    groupFilter,
    categoryFilter,
    sortOrder,
    showSelectedOnly,
    selectedRows,
  })

  const { totalPages, pageData } = usePagination(filtered, page, pageSize)

  // Row selection (depends on pageData)
  const pageKeys = useMemo(() => pageData.map(rowKey), [pageData])
  const allPageSelected =
    pageKeys.length > 0 && pageKeys.every((k) => selectedRows.has(k))
  const somePageSelected = pageKeys.some((k) => selectedRows.has(k))

  const toggleRow = useCallback((key: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const toggleAllPage = useCallback(() => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (allPageSelected) pageKeys.forEach((k) => next.delete(k))
      else pageKeys.forEach((k) => next.add(k))
      return next
    })
  }, [allPageSelected, pageKeys])

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
    setShowSelectedOnly(false)
  }, [])

  const handlePrintLabels = useCallback(() => {
    const selected = products.filter((p) => selectedRows.has(rowKey(p)))
    if (selected.length === 0) return
    setPrintProducts(selected)
  }, [products, selectedRows])

  const resetPage = useCallback(() => {
    startTransition(() => {
      setPage(1)
    })
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    resetPage()
  }, [resetPage])

  const handleGroupChange = useCallback((value: string) => {
    setGroupFilter(value)
    resetPage()
  }, [resetPage])

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value)
    resetPage()
  }, [resetPage])

  const handleSortChange = useCallback((value: SortOrder) => {
    setSortOrder(value)
    resetPage()
  }, [resetPage])

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value)
    resetPage()
  }, [resetPage])

  const handleToggleShowSelected = useCallback(() => {
    setShowSelectedOnly((value) => !value)
    resetPage()
  }, [resetPage])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-muted-foreground">
        Đang tải danh sách sản phẩm...
      </div>
    )
  }

  return (
    <>
      <div className="no-print mx-auto min-h-svh w-full max-w-[1600px] p-4 md:p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cửu Âm Chân Kinh</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length.toLocaleString("vi-VN")} phiên bản &middot;{" "}
              {uniqueProducts} sản phẩm
            </p>
          </div>
          <CloudinaryStats />
        </div>

        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          groupFilter={groupFilter}
          onGroupChange={handleGroupChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          groups={groups}
          columns={columns}
          allCols={allCols}
          onToggleCol={toggleCol}
        />

        <ProductTable
          pageData={pageData}
          columns={columns}
          selectedRows={selectedRows}
          allPageSelected={allPageSelected}
          somePageSelected={somePageSelected}
          showSelectedOnly={showSelectedOnly}
          rowKey={rowKey}
          toggleRow={toggleRow}
          toggleAllPage={toggleAllPage}
          clearSelection={clearSelection}
          onToggleShowSelected={handleToggleShowSelected}
          onSelectProduct={setSelected}
          onPrintLabels={handlePrintLabels}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <ProductDialog 
          product={selected} 
          onClose={() => setSelected(null)} 
          onUpdateProduct={(sku, img) => {
            updateProduct(sku, { image: img })
            // Ensure selected state updates to reflect changes in dialog immediately
            if (selected && selected.sku === sku) {
              setSelected({ ...selected, image: img })
            }
          }}
        />

        <ScreenCat />
      </div>

      {printProducts && (
        <PrintLabels
          products={printProducts}
          onClose={() => setPrintProducts(null)}
        />
      )}
    </>
  )
}

export default App
