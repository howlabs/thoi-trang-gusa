/**
 * Import danh sách sản phẩm từ Excel vào Neon PostgreSQL
 * Chỉ lấy: name, variant, sku, type, attr1, retail_price, stock_cn1, cost_cn1
 * Giữ lại ảnh cũ nếu có mapping sku → image
 *
 * Chạy: node scripts/import-excel-to-neon.mjs
 */
import postgres from "postgres"
import XLSX from "xlsx"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const envPath = path.resolve(__dirname, "../.env.local")
const dbUrlMatch = fs.readFileSync(envPath, "utf8").match(/DATABASE_URL=(.+)/)
if (!dbUrlMatch) { console.error("Khong tim thay DATABASE_URL"); process.exit(1) }
const sql = postgres(dbUrlMatch[1].trim(), { ssl: "require" })

async function main() {
  try {
    // Lưu ảnh cũ trước khi xóa
    const oldImages = await sql`SELECT sku, image FROM products WHERE image IS NOT NULL`
    const imageMap = new Map(oldImages.map(r => [r.sku, r.image]))
    console.log(`Anh cu: ${imageMap.size} san pham`)

    // Đọc Excel
    const dlPath = path.resolve(process.env.USERPROFILE || "C:/Users/kisde", "Downloads")
    const files = fs.readdirSync(dlPath).filter(f => f.startsWith("danh_sach_san_pham") && f.endsWith(".xlsx"))
    if (files.length === 0) { console.error("Khong tim thay file Excel trong Downloads"); process.exit(1) }
    const filePath = path.resolve(dlPath, files.sort().pop())
    console.log(`Doc: ${filePath}`)

    const wb = XLSX.readFile(filePath)
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    console.log(`${rows.length} san pham trong Excel`)

    // Xóa cũ + import mới
    await sql`TRUNCATE products RESTART IDENTITY`
    console.log("Da xoa du lieu cu, dang import...")

    for (const r of rows) {
      const sku = r["Mã SKU*"] || null
      await sql`
        INSERT INTO products (name, variant, sku, type, attr1, image, retail_price, stock_cn1, cost_cn1)
        VALUES (
          ${r["Tên sản phẩm*"] || null},
          ${r["Tên phiên bản sản phẩm"] || null},
          ${sku},
          ${r["Loại sản phẩm"] || null},
          ${r["Giá trị thuộc tính 1"] || null},
          ${imageMap.get(sku) || null},
          ${Number(r["PL_Giá bán lẻ"]) || 0},
          ${Number(r["LC_CN1_Tồn kho ban đầu*"]) || 0},
          ${Number(r["LC_CN1_Giá vốn khởi tạo*"]) || 0}
        )
      `
    }

    const stats = await sql`SELECT COUNT(*) as total, COUNT(image) as with_img FROM products`
    console.log(`\nHoan tat! Tong: ${stats[0].total} | Co anh: ${stats[0].with_img}`)
  } catch (e) {
    console.error("Loi:", e)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()
