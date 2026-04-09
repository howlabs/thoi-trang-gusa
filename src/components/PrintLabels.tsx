import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import JsBarcode from "jsbarcode"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/types"
import {
  chunkLabels,
  expandPrintLabels,
  getProductKey,
  type PrintableLabel,
} from "@/utils/print-labels"

interface PrintLabelsProps {
  products: Product[]
  onClose: () => void
}

type LabelPreset = "72x22" | "74x22"

const LABEL_PRESETS: Record<
  LabelPreset,
  {
    label: string
    width: string
    height: string
    padding: string
    gapX: string
    gapY: string
    contentWidth: string
    barcodeWidth: string
    barcodeHeight: string
    nameFontSize: string
    skuFontSize: string
    priceFontSize: string
  }
> = {
  "72x22": {
    label: "72 x 22 mm",
    width: "72mm",
    height: "22mm",
    padding: "1.2mm 2mm",
    gapX: "2mm",
    gapY: "1.5mm",
    contentWidth: "68mm",
    barcodeWidth: "62mm",
    barcodeHeight: "8mm",
    nameFontSize: "6.25pt",
    skuFontSize: "7pt",
    priceFontSize: "6.5pt",
  },
  "74x22": {
    label: "74 x 22 mm",
    width: "74mm",
    height: "22mm",
    padding: "1.2mm 2mm",
    gapX: "2mm",
    gapY: "1.5mm",
    contentWidth: "70mm",
    barcodeWidth: "64mm",
    barcodeHeight: "8mm",
    nameFontSize: "6.25pt",
    skuFontSize: "7pt",
    priceFontSize: "6.5pt",
  },
}

function BarcodeItem({ label }: { label: PrintableLabel }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const canRenderBarcode = /^[\x20-\x7E]+$/.test(label.sku)

  useEffect(() => {
    if (svgRef.current && label.sku && canRenderBarcode) {
      try {
        JsBarcode(svgRef.current, label.sku, {
          format: "CODE128",
          width: 1.5,
          height: 40,
          displayValue: false,
          margin: 0,
          fontSize: 10,
        })
      } catch {
        if (svgRef.current) {
          while (svgRef.current.firstChild) {
            svgRef.current.removeChild(svgRef.current.firstChild)
          }
        }
      }
    }
  }, [canRenderBarcode, label.sku])

  return (
    <div className="label-item">
      <div className="label-copy">
        <div className="label-name">{label.title}</div>
        {label.subtitle ? (
          <div className="label-variant">{label.subtitle}</div>
        ) : null}
      </div>
      {label.hasBarcode && canRenderBarcode ? (
        <svg ref={svgRef} className="label-barcode" />
      ) : (
        <div className="label-barcode label-barcode-fallback">
          {label.hasBarcode ? "SKU không hợp lệ" : "Chưa có mã vạch"}
        </div>
      )}
      <div className="label-meta">
        <div className="label-sku">{label.sku || "SKU chưa khai báo"}</div>
        {label.hasPrice ? (
          <div className="label-price">{label.price}</div>
        ) : null}
      </div>
    </div>
  )
}

function LabelGrid({
  activePreset,
  rows,
  className,
  offsetX,
  offsetY,
}: {
  activePreset: (typeof LABEL_PRESETS)[LabelPreset]
  rows: Array<Array<PrintableLabel & { instanceKey: string }>>
  className?: string
  offsetX: number
  offsetY: number
}) {
  return (
    <div
      className={className ?? "label-grid"}
      style={
        {
          "--label-width": activePreset.width,
          "--label-height": activePreset.height,
          "--label-padding": activePreset.padding,
          "--label-gap-x": activePreset.gapX,
          "--label-gap-y": activePreset.gapY,
          "--label-content-width": activePreset.contentWidth,
          "--label-barcode-width": activePreset.barcodeWidth,
          "--label-barcode-height": activePreset.barcodeHeight,
          "--label-name-font-size": activePreset.nameFontSize,
          "--label-sku-font-size": activePreset.skuFontSize,
          "--label-price-font-size": activePreset.priceFontSize,
          "--label-offset-x": `${offsetX}mm`,
          "--label-offset-y": `${offsetY}mm`,
        } as CSSProperties
      }
    >
      {rows.map((row, i) => (
        <div key={i} className="label-row">
          {row.map((label) => (
            <BarcodeItem key={label.instanceKey} label={label} />
          ))}
          {row.length < 2 && <div className="label-item label-item-empty" />}
        </div>
      ))}
    </div>
  )
}

export function PrintLabels({ products, onClose }: PrintLabelsProps) {
  const [preset, setPreset] = useState<LabelPreset>("72x22")
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((product) => [getProductKey(product), 1]))
  )
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const activePreset = LABEL_PRESETS[preset]
  const expandedLabels = useMemo(
    () => expandPrintLabels(products, quantities),
    [products, quantities]
  )

  const totalLabels = expandedLabels.length
  const activeProducts = products.filter(
    (product) => (quantities[getProductKey(product)] ?? 1) > 0
  ).length
  const skippedProducts = products.length - activeProducts

  const setQuantity = (product: Product, nextValue: number) => {
    const key = getProductKey(product)
    const safeValue = Number.isFinite(nextValue)
      ? Math.min(999, Math.max(0, Math.floor(nextValue)))
      : 0

    setQuantities((current) => ({
      ...current,
      [key]: safeValue,
    }))
  }

  const setAllQuantities = (value: number) => {
    const safeValue = Math.min(999, Math.max(0, Math.floor(value)))
    setQuantities(
      Object.fromEntries(
        products.map((product) => [getProductKey(product), safeValue])
      )
    )
  }

  const rows = useMemo(() => chunkLabels(expandedLabels, 2), [expandedLabels])
  const totalRows = rows.length

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent
          className="print-dialog gap-0 overflow-hidden border-0 p-0 sm:max-w-[min(96vw,1100px)]"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Xem trước tem nhãn</DialogTitle>

          <div className="print-controls">
            <div className="print-controls-inner">
              <div className="print-controls-meta">
                <span className="text-sm font-medium">
                  Decal 2 tem: {totalLabels} tem / {totalRows} hàng in
                </span>
                <label className="print-size-picker">
                  <span>Khổ tem</span>
                  <select
                    value={preset}
                    onChange={(event) =>
                      setPreset(event.target.value as LabelPreset)
                    }
                  >
                    {Object.entries(LABEL_PRESETS).map(([value, config]) => (
                      <option key={value} value={value}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="print-size-picker">
                  <span>Lệch ngang</span>
                  <Input
                    className="print-calibration-input"
                    type="number"
                    step="0.5"
                    value={offsetX}
                    onChange={(event) =>
                      setOffsetX(Number(event.target.value || 0))
                    }
                  />
                  <span>mm</span>
                </label>
                <label className="print-size-picker">
                  <span>Lệch dọc</span>
                  <Input
                    className="print-calibration-input"
                    type="number"
                    step="0.5"
                    value={offsetY}
                    onChange={(event) =>
                      setOffsetY(Number(event.target.value || 0))
                    }
                  />
                  <span>mm</span>
                </label>
                <span className="print-sheet-note">
                  {activeProducts}/{products.length} SP in • 2 tem / hàng
                </span>
                {skippedProducts > 0 ? (
                  <span className="print-sheet-note print-sheet-note-muted">
                    Bỏ qua {skippedProducts} SP
                  </span>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button
                  className="print-btn-secondary"
                  variant="outline"
                  onClick={() => setAllQuantities(1)}
                >
                  Mỗi SP 1 tem
                </Button>
                <Button
                  className="print-btn-secondary"
                  variant="outline"
                  onClick={() => setAllQuantities(0)}
                >
                  Bỏ chọn hết
                </Button>
                <Button
                  className="print-btn-primary"
                  onClick={() => window.print()}
                >
                  In tem
                </Button>
                <Button
                  className="print-btn-secondary"
                  variant="outline"
                  onClick={onClose}
                >
                  Đóng
                </Button>
              </div>
            </div>

            <div className="print-quantity-panel">
              {products.map((product) => {
                const key = getProductKey(product)
                const quantity = quantities[key] ?? 1
                return (
                  <div key={key} className="print-quantity-item">
                    <div className="print-quantity-copy">
                      <p className="print-quantity-name">
                        {product.name || "N/A"}
                      </p>
                      <p className="print-quantity-sku">
                        {product.sku || "Khong co SKU"}
                      </p>
                    </div>
                    <div className="print-quantity-actions">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => setQuantity(product, quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        className="print-quantity-input"
                        type="number"
                        min="0"
                        max="999"
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(product, Number(event.target.value || 0))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => setQuantity(product, quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </DialogContent>
      </Dialog>

      <div className="print-paper">
        <LabelGrid
          activePreset={activePreset}
          rows={rows}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </div>
    </>
  )
}
