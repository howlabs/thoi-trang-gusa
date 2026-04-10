import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Product } from "@/types"
import { CATEGORY_CP, CATEGORY_STOCK } from "@/constants"
import { formatPrice, formatStock, getCategory } from "@/utils/product"
import { useImageUpload } from "@/hooks/useImageUpload"
import { Upload, Loader2, CheckCircle2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"

interface ProductDialogProps {
  product: Product | null
  onClose: () => void
  onUpdateProduct: (sku: string, img: string) => void
}

export function ProductDialog({ product, onClose, onUpdateProduct }: ProductDialogProps) {
  const { uploadImage, uploading, error } = useImageUpload()
  const [localImage, setLocalImage] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  // Reset local state when product changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalImage(product?.image ?? null)
    setUploadSuccess(false)
    setPendingFile(null)
  }, [product])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !product) return

    if (product.image) {
      setPendingFile(file)
    } else {
      executeUpload(file)
    }
  }

  const executeUpload = async (file: File) => {
    if (!product) return

    setPendingFile(null)
    const oldImageUrl = product.image

    const webpUrl = await uploadImage(file)
    if (webpUrl) {
      setLocalImage(webpUrl)
      setUploadSuccess(true)
      onUpdateProduct(product.sku || "", webpUrl)

      // Save to server local JSON (dev only backup) + Delete old image
      try {
        await fetch('/api/update-product-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku: product.sku, imageUrl: webpUrl, oldImageUrl })
        })
      } catch (err) {
        console.error("Failed to sync json locally", err)
      }

      setTimeout(() => setUploadSuccess(false), 3000)
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product?.name}</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            <div 
              className={`group relative h-48 w-full rounded-lg overflow-hidden flex items-center justify-center transition-all ${
                !localImage ? 'bg-muted/50 border-2 border-dashed hover:border-primary/50 hover:bg-muted cursor-pointer' : 'bg-muted'
              }`}
              onClick={() => {
                if (!localImage && !uploading) fileInputRef.current?.click()
              }}
            >
              {localImage ? (
                <>
                  <img
                    src={localImage}
                    alt={product.variant || ""}
                    className="h-full w-full object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setIsZoomed(true)}
                  />
                  {/* Floating Update Button - Nằm ở góc trên bên phải thay vì che khuất ảnh */}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shadow-md bg-white/90 hover:bg-white text-black backdrop-blur-sm transition-all shadow-black/10"
                      disabled={uploading}
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                      ) : uploadSuccess ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploading ? "Đang xử lý..." : uploadSuccess ? "Thành công!" : "Đổi ảnh"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                      <span className="text-sm font-medium">Đang tải lên...</span>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Đã lưu ảnh!</span>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-muted rounded-full">
                        <Upload className="h-6 w-6 text-muted-foreground/70" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground/80">Nhấn để tải ảnh lên</p>
                        <p className="text-xs mt-1">Hỗ trợ tự động nén WebP</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            
            {error && (
              <p className="mt-2 text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded border border-red-100">
                Lỗi: {error.message}
              </p>
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
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <p className="text-xs text-muted-foreground">CN3</p>
                  <p className="text-lg font-bold">{formatStock(product.stock_cn3)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    <AlertDialog open={!!pendingFile} onOpenChange={(open) => {
      if (!open) {
        setPendingFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cảnh báo ghi đè hình ảnh</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ thay thế hình ảnh hiện tại và <b>xóa vĩnh viễn ảnh cũ</b> khỏi hệ thống lưu trữ Cloudinary của bạn. Bạn có chắc chắn muốn tiếp tục không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (pendingFile) executeUpload(pendingFile)
          }}>
            Tiếp tục upload
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Phóng to ảnh (Lightbox) */}
    <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
      <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 flex items-center justify-center">
        <DialogHeader className="sr-only">
          <DialogTitle>Phóng to cận cảnh</DialogTitle>
        </DialogHeader>
        {localImage && (
          <img 
            src={localImage} 
            alt="Phóng to" 
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
          />
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
