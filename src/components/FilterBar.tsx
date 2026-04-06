import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAGE_SIZE_OPTIONS, CATEGORY_ALL, CATEGORY_CP, CATEGORY_STOCK } from "@/constants"
import type { ColKey, SortOrder } from "@/types"

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  groupFilter: string
  onGroupChange: (v: string) => void
  categoryFilter: string
  onCategoryChange: (v: string) => void
  sortOrder: SortOrder
  onSortChange: (v: SortOrder) => void
  pageSize: number
  onPageSizeChange: (v: number) => void
  groups: string[]
  columns: ColKey[]
  allCols: { key: ColKey; label: string }[]
  onToggleCol: (key: ColKey) => void
}

export function FilterBar({
  search, onSearchChange,
  groupFilter, onGroupChange,
  categoryFilter, onCategoryChange,
  sortOrder, onSortChange,
  pageSize, onPageSizeChange,
  groups,
  columns, allCols, onToggleCol,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input
        placeholder="Tìm tên sản phẩm, phiên bản, SKU..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-sm"
      />
      <Select value={groupFilter} onValueChange={onGroupChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <span className="text-muted-foreground">SP:</span> <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {groups.map((g) => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <span className="text-muted-foreground">SKU:</span> <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CATEGORY_ALL}>Tất cả</SelectItem>
          <SelectItem value={CATEGORY_CP}>Chính phẩm (C)</SelectItem>
          <SelectItem value={CATEGORY_STOCK}>Stock (S)</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={(v) => onSortChange(v as SortOrder)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <span className="text-muted-foreground">Sắp xếp:</span> <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Mặc định</SelectItem>
          <SelectItem value="az">Tên A → Z</SelectItem>
          <SelectItem value="za">Tên Z → A</SelectItem>
        </SelectContent>
      </Select>
      <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
        <SelectTrigger className="w-full sm:w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((s) => (
            <SelectItem key={s} value={String(s)}>{s} / trang</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger className="inline-flex h-8 items-center justify-center gap-1 rounded-md border bg-background px-3 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground cursor-pointer w-full sm:w-auto">
          Cột ({columns.length}/{allCols.length})
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="end">
          <p className="mb-2 text-sm font-medium">Hiển thị cột</p>
          <div className="space-y-2">
            {allCols.map((col) => (
              <label key={col.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={columns.includes(col.key)}
                  disabled={columns.includes(col.key) && columns.length <= 2}
                  onCheckedChange={() => onToggleCol(col.key)}
                />
                {col.label}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
