/**
 * Script: Tạo bảng products trên Neon PostgreSQL và import dữ liệu từ products.json
 *
 * Chạy: node scripts/migrate-to-neon.mjs
 */
import postgres from "postgres"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Đọc DATABASE_URL từ .env.local
const envPath = path.resolve(__dirname, "../.env.local")
const envContent = fs.readFileSync(envPath, "utf8")
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/)
if (!dbUrlMatch) {
  console.error("Không tìm thấy DATABASE_URL trong .env.local")
  process.exit(1)
}
const DATABASE_URL = dbUrlMatch[1].trim()

const sql = postgres(DATABASE_URL, { ssl: "require" })

async function migrate() {
  try {
    console.log("Dang tao bang products...")

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        variant TEXT,
        sku TEXT,
        type TEXT,
        attr1 TEXT,
        image TEXT,
        retail_price NUMERIC DEFAULT 0,
        stock_cn1 NUMERIC DEFAULT 0,
        stock_cn3 NUMERIC DEFAULT 0,
        cost_cn1 NUMERIC DEFAULT 0,
        cost_cn3 NUMERIC DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_name ON products (name)`

    console.log("Da tao bang products")

    // Đọc dữ liệu từ products.json
    const productsPath = path.resolve(__dirname, "../public/products.json")
    if (!fs.existsSync(productsPath)) {
      console.log("Khong tim thay products.json, bo qua import")
      return
    }

    const products = JSON.parse(fs.readFileSync(productsPath, "utf8"))
    console.log(`Tim thay ${products.length} san pham, dang import...`)

    // Xóa dữ liệu cũ
    await sql`TRUNCATE products RESTART IDENTITY`

    // Insert từng batch
    for (const p of products) {
      await sql`
        INSERT INTO products (name, variant, sku, type, attr1, image, retail_price, stock_cn1, stock_cn3, cost_cn1, cost_cn3)
        VALUES (${p.name}, ${p.variant}, ${p.sku}, ${p.type || null}, ${p.attr1}, ${p.image}, ${p.retail_price || 0}, ${p.stock_cn1 || 0}, ${p.stock_cn3 || 0}, ${p.cost_cn1 || 0}, ${p.cost_cn3 || 0})
      `
    }

    console.log(`Da import ${products.length} san pham`)

    const count = await sql`SELECT COUNT(*) as count FROM products`
    console.log(`Tong so ban ghi trong DB: ${count[0].count}`)
  } catch (error) {
    console.error("Loi migration:", error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

migrate()
