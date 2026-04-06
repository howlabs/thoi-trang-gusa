import { CATEGORY_ALL, CATEGORY_CP, CATEGORY_STOCK } from "@/constants"
import type { Product } from "@/types"

export function formatPrice(v: number | null): string {
  if (v == null || v === 0) return "—"
  return v.toLocaleString("vi-VN") + " đ"
}

export function formatStock(v: number | null): string {
  if (v == null || v === 0) return "0"
  return v.toLocaleString("vi-VN")
}

export function getProductGroup(name: string): string {
  const n = name.toLowerCase().trim()
  if (n.startsWith("linen tơ")) return "Linen tơ"
  if (n.startsWith("linen tưng")) return "Linen tưng"
  if (n.startsWith("linen bột") || n.startsWith("linen bôt") || n.startsWith("linen bố")) return "Linen bột/bố"
  if (n.startsWith("linen")) return "Linen khác"
  if (n.startsWith("cotton")) return "Cotton"
  if (n.startsWith("vải")) return "Vải"
  if (n.startsWith("kaki")) return "Kaki"
  if (n.startsWith("tơ")) return "Tơ"
  if (n.startsWith("phi")) return "Phi"
  return "Khác"
}

export function getCategory(sku: string | null): string {
  if (!sku) return CATEGORY_ALL
  const prefix = sku.split("-")[0]
  const last = prefix[prefix.length - 1].toUpperCase()
  if (last === "S") return CATEGORY_STOCK
  if (last === "C") return CATEGORY_CP
  return CATEGORY_ALL
}

export function rowKey(p: Product): string {
  return p.sku || `${p.name}|${p.variant}`
}
