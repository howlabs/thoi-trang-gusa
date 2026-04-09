import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Product, ColKey } from "@/types"
import { formatPrice, formatStock } from "@/utils/product"
import { Printer } from "lucide-react"

interface ProductTableProps {
  pageData: Product[]
  columns: ColKey[]
  selectedRows: Set<string>
  allPageSelected: boolean
  somePageSelected: boolean
  showSelectedOnly: boolean
  rowKey: (p: Product) => string
  toggleRow: (key: string) => void
  toggleAllPage: () => void
  clearSelection: () => void
  onToggleShowSelected: () => void
  onSelectProduct: (p: Product) => void
  onPrintLabels: () => void
}

export function ProductTable({
  pageData,
  columns,
  selectedRows,
  allPageSelected,
  somePageSelected,
  showSelectedOnly,
  rowKey,
  toggleRow,
  toggleAllPage,
  clearSelection,
  onToggleShowSelected,
  onSelectProduct,
  onPrintLabels,
}: ProductTableProps) {
  const colCount = columns.length + 1

  return (
    <>
      {selectedRows.size > 0 && (
        <div className="mb-2 flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">
            Đã chọn {selectedRows.size} hàng
          </span>
          <Button
            variant={showSelectedOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleShowSelected}
          >
            {showSelectedOnly ? "Xem tất cả" : "Xem đã chọn"}
          </Button>
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Bỏ chọn tất cả
          </Button>
          <Button variant="outline" size="sm" onClick={onPrintLabels}>
            <Printer className="mr-1 h-3.5 w-3.5" />
            In tem
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={allPageSelected}
                      indeterminate={!allPageSelected && somePageSelected}
                      onCheckedChange={toggleAllPage}
                    />
                  </TableHead>
                  {columns.includes("image") && (
                    <TableHead className="w-[50px]">Ảnh</TableHead>
                  )}
                  {columns.includes("product") && (
                    <TableHead>Sản phẩm</TableHead>
                  )}
                  {columns.includes("sku") && <TableHead>SKU</TableHead>}
                  {columns.includes("price") && (
                    <TableHead className="text-right">Giá bán lẻ</TableHead>
                  )}
                  {columns.includes("stock_cn1") && (
                    <TableHead className="text-right">Tồn CN1</TableHead>
                  )}
                  {columns.includes("stock_cn3") && (
                    <TableHead className="text-right">Tồn CN3</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((p) => {
                  const key = rowKey(p)
                  const isChecked = selectedRows.has(key)
                  return (
                    <TableRow
                      key={key}
                      className={`cursor-pointer hover:bg-muted/50 ${isChecked ? "bg-muted/30" : ""}`}
                      onClick={() => onSelectProduct(p)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleRow(key)}
                        />
                      </TableCell>
                      {columns.includes("image") && (
                        <TableCell>
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.variant || ""}
                              className="h-10 w-10 rounded object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </TableCell>
                      )}
                      {columns.includes("product") && (
                        <TableCell>
                          <div className="max-w-[300px]">
                            <div className="truncate text-sm font-medium">
                              {p.name}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {p.variant}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {columns.includes("sku") && (
                        <TableCell className="font-mono text-xs">
                          {p.sku}
                        </TableCell>
                      )}
                      {columns.includes("price") && (
                        <TableCell className="text-right text-sm">
                          {formatPrice(p.retail_price)}
                        </TableCell>
                      )}
                      {columns.includes("stock_cn1") && (
                        <TableCell className="text-right text-sm">
                          {formatStock(p.stock_cn1)}
                        </TableCell>
                      )}
                      {columns.includes("stock_cn3") && (
                        <TableCell className="text-right text-sm">
                          {formatStock(p.stock_cn3)}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
                {pageData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={colCount}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy sản phẩm nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
