import { useState, useMemo, useDeferredValue } from "react"
import { ScreenCat } from "@/components/ScreenCat"
import { FilterBar } from "@/components/FilterBar"
import { ProductTable } from "@/components/ProductTable"
import { ProductDialog } from "@/components/ProductDialog"
import { Pagination } from "@/components/Pagination"
import { PrintLabels } from "@/components/PrintLabels"
import { useProducts } from "@/hooks/useProducts"
import { useURLSync, parseURL } from "@/hooks/useURLSync"
import { useTableFilters } from "@/hooks/useTableFilters"
import { usePagination } from "@/hooks/usePagination"
import { useColumnVisibility } from "@/hooks/useColumnVisibility"
import type { Product, SortOrder } from "@/types"
import { rowKey } from "@/utils/product"

export function App() {
  const init = useMemo(() => parseURL(), [])
  const { products, loading } = useProducts()

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

  const { groups, filtered, totalStock, uniqueProducts } = useTableFilters({
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

  const toggleRow = (key: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleAllPage = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (allPageSelected) pageKeys.forEach((k) => next.delete(k))
      else pageKeys.forEach((k) => next.add(k))
      return next
    })
  }

  const clearSelection = () => {
    setSelectedRows(new Set())
    setShowSelectedOnly(false)
  }

  const handlePrintLabels = () => {
    const selected = products.filter((p) => selectedRows.has(rowKey(p)))
    if (selected.length === 0) return
    setPrintProducts(selected)
  }

  const resetPage = () => setPage(1)

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Cửu Âm Chân Kinh</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length.toLocaleString("vi-VN")} phiên bản &middot;{" "}
            {uniqueProducts} sản phẩm &middot; Tổng tồn kho:{" "}
            {totalStock.toLocaleString("vi-VN")}
          </p>
        </div>

        <FilterBar
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            resetPage()
          }}
          groupFilter={groupFilter}
          onGroupChange={(v) => {
            setGroupFilter(v)
            resetPage()
          }}
          categoryFilter={categoryFilter}
          onCategoryChange={(v) => {
            setCategoryFilter(v)
            resetPage()
          }}
          sortOrder={sortOrder}
          onSortChange={(v) => {
            setSortOrder(v)
            resetPage()
          }}
          pageSize={pageSize}
          onPageSizeChange={(v) => {
            setPageSize(v)
            resetPage()
          }}
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
          onToggleShowSelected={() => {
            setShowSelectedOnly((v) => !v)
            resetPage()
          }}
          onSelectProduct={setSelected}
          onPrintLabels={handlePrintLabels}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <ProductDialog product={selected} onClose={() => setSelected(null)} />

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
