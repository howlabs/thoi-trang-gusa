/**
 * Restore images from old products.json (git) into current Neon DB
 */
import postgres from "postgres"
import fs from "fs"
import { execFileSync } from "child_process"

const envContent = fs.readFileSync("./.env.local", "utf8")
const dbUrl = envContent.match(/DATABASE_URL=(.+)/)[1].trim()
const sql = postgres(dbUrl, { ssl: "require" })

async function main() {
  // Lấy old products.json từ git, ghi ra file tạm
  const tmpFile = "./.tmp-old-products.json"
  const buf = execFileSync("git", ["show", "HEAD:public/products.json"], { maxBuffer: 50 * 1024 * 1024 })
  fs.writeFileSync(tmpFile, buf)

  const oldProducts = JSON.parse(fs.readFileSync(tmpFile, "utf8"))
  fs.unlinkSync(tmpFile)

  const imageMap = new Map()
  for (const p of oldProducts) {
    if (p.sku && p.image) imageMap.set(p.sku, p.image)
  }
  console.log(`Anh cu: ${imageMap.size} SKU co anh`)

  let updated = 0
  for (const [sku, image] of imageMap) {
    const result = await sql`UPDATE products SET image = ${image} WHERE sku = ${sku}`
    if (result.count > 0) updated++
  }

  const stats = await sql`SELECT COUNT(image) as with_img, COUNT(*) as total FROM products`
  console.log(`Cap nhat: ${updated} | Co anh: ${stats[0].with_img} / Tong: ${stats[0].total}`)

  await sql.end()
}

main().catch(e => { console.error(e); process.exit(1) })
