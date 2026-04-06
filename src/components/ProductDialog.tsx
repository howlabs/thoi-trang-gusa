import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Product } from "@/types"
import { CATEGORY_CP, CATEGORY_STOCK } from "@/constants"
import { formatPrice, formatStock, getCategory } from "@/utils/product"

interface ProductDialogProps {
  product: Product | null
  onClose: () => void
}

export function ProductDialog({ product, onClose }: ProductDialogProps) {
  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product?.name}</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            {product.image && (
              <img
                src={product.image}
                alt={product.variant || ""}
                className="h-48 w-full rounded-lg object-contain bg-muted"
              />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Phiên bản:</span>
                <p className="font-medium">{product.variant || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <p className="font-mono font-medium">{product.sku || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phân loại:</span>
                <p className="font-medium">
                  {getCategory(product.sku) === CATEGORY_CP ? "Chính phẩm" :
                   getCategory(product.sku) === CATEGORY_STOCK ? "Stock" : "—"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Thuộc tính:</span>
                <p className="font-medium">{product.attr1 || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Giá bán lẻ:</span>
                <p className="font-medium text-green-600">{formatPrice(product.retail_price)}</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="mb-2 text-sm font-medium">Tồn kho</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted p-2 text-center">
                  <p className="text-xs text-muted-foreground">CN1</p>
                  <p className="text-lg font-bold">{formatStock(product.stock_cn1)}</p>
                  <p className="text-xs text-muted-foreground">Giá vốn: {formatPrice(product.cost_cn1)}</p>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <p className="text-xs text-muted-foreground">CN3</p>
                  <p className="text-lg font-bold">{formatStock(product.stock_cn3)}</p>
                  <p className="text-xs text-muted-foreground">Giá vốn: {formatPrice(product.cost_cn3)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
