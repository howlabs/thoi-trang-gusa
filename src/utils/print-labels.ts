import type { Product } from "@/types"
import { formatPrice } from "@/utils/product"

export interface PrintableLabel {
  key: string
  title: string
  subtitle: string
  sku: string
  price: string
  hasPrice: boolean
  hasBarcode: boolean
  product: Product
}

export function getProductKey(product: Product) {
  return product.sku || `${product.name}|${product.variant}`
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function trimKnownSeparators(value: string) {
  return value.replace(/^[\s\-|/:]+|[\s\-|/:]+$/g, "").trim()
}

function shortenText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

export function splitVariantSuffix(
  name: string | null,
  variant: string | null
) {
  const normalizedName = normalizeWhitespace(name || "")
  const normalizedVariant = normalizeWhitespace(variant || "")

  if (!normalizedVariant) {
    return ""
  }

  const lowerName = normalizedName.toLowerCase()
  const lowerVariant = normalizedVariant.toLowerCase()

  if (lowerName && lowerVariant.startsWith(lowerName)) {
    return trimKnownSeparators(normalizedVariant.slice(normalizedName.length))
  }

  return normalizedVariant
}

export function buildPrintableLabel(product: Product): PrintableLabel {
  const rawTitle = normalizeWhitespace(product.name || "Sản phẩm chưa đặt tên")
  const variantSuffix = splitVariantSuffix(product.name, product.variant)
  const title = shortenText(rawTitle, 34)
  const subtitle = variantSuffix
    ? shortenText(variantSuffix === "Mặc định" ? "" : variantSuffix, 24)
    : ""
  const sku = normalizeWhitespace(product.sku || "")
  const hasPrice =
    typeof product.retail_price === "number" && product.retail_price > 0

  return {
    key: getProductKey(product),
    title,
    subtitle,
    sku,
    price: hasPrice ? formatPrice(product.retail_price) : "",
    hasPrice,
    hasBarcode: sku.length > 0,
    product,
  }
}

export function expandPrintLabels(
  products: Product[],
  quantities: Record<string, number>
) {
  return products.flatMap((product) => {
    const quantity = Math.max(0, quantities[getProductKey(product)] ?? 1)

    if (quantity === 0) {
      return []
    }

    const label = buildPrintableLabel(product)
    return Array.from({ length: quantity }, (_, index) => ({
      ...label,
      instanceKey: `${label.key}-${index}`,
    }))
  })
}

export function chunkLabels<T>(items: T[], size: number) {
  const rows: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size))
  }

  return rows
}
