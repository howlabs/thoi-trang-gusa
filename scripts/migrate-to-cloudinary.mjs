/**
 * migrate-to-cloudinary.mjs
 *
 * Downloads all Sapo images, converts to WebP (aggressive compression),
 * uploads to Cloudinary, and saves progress so it can RESUME if interrupted.
 *
 * Usage:  node scripts/migrate-to-cloudinary.mjs
 *
 * Requires in .env.local:
 *   CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */

import { createHash } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot    = path.resolve(__dirname, "..")
const productsPath = path.join(repoRoot, "public", "products.json")
const backupPath   = path.join(repoRoot, "public", "products.cloudinary-backup.json")
const cachePath    = path.join(repoRoot, "public", "products.cloudinary-cache.json")
const envPath      = path.join(repoRoot, ".env.local")
const sapoHost     = "sapo.dktcdn.net"

// ─── Compression settings ────────────────────────────────────────────────────
const WEBP_QUALITY = 65   // 0-100 — thấp hơn = nhỏ hơn (65 là mức nén sâu)
const MAX_DIM      = 1000 // resize ảnh xuống còn tối đa 1000px mỗi chiều
const EFFORT       = 5    // 0-6 — cao hơn = nhanh hơn nhưng file nhỏ hơn ít
const CONCURRENCY  = 5    // số luồng upload song song

// ─── Load .env.local ──────────────────────────────────────────────────────────
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const sep = t.indexOf("=")
    if (sep === -1) continue
    const k = t.slice(0, sep).trim()
    const v = t.slice(sep + 1).trim().replace(/^['"]|['"]$/g, "")
    if (!(k in process.env)) process.env[k] = v
  }
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY    = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error("❌ Missing Cloudinary credentials in .env.local")
  process.exit(1)
}

// ─── Check Sharp ──────────────────────────────────────────────────────────────
let sharp
try {
  sharp = (await import("sharp")).default
  console.log("✅ sharp ready")
} catch {
  console.error("❌ Run: npm install --save-dev sharp")
  process.exit(1)
}

// ─── Load products & cache ────────────────────────────────────────────────────
const raw      = readFileSync(productsPath, "utf8")
const products = JSON.parse(raw)

if (!Array.isArray(products)) {
  console.error("❌ products.json phải là JSON array")
  process.exit(1)
}

if (!existsSync(backupPath)) {
  writeFileSync(backupPath, raw, "utf8")
  console.log(`📦 Backup → ${path.relative(repoRoot, backupPath)}`)
}

// Cache lưu { sapoUrl → cloudinaryUrl } để resume
const cache = existsSync(cachePath)
  ? JSON.parse(readFileSync(cachePath, "utf8"))
  : {}

function saveCache() {
  writeFileSync(cachePath, JSON.stringify(cache, null, 0), "utf8")
}

// ─── Collect unique Sapo URLs ─────────────────────────────────────────────────
const allSapoUrls = [
  ...new Set(
    products
      .map((p) => p?.image)
      .filter((img) => typeof img === "string" && img.includes(sapoHost))
  ),
]

const pendingUrls = allSapoUrls.filter((url) => !cache[url])
const total       = allSapoUrls.length
const skipped     = total - pendingUrls.length

console.log(`\n🔍 Tổng: ${total} | Đã upload: ${skipped} | Còn lại: ${pendingUrls.length}\n`)

if (pendingUrls.length === 0) {
  console.log("✅ Tất cả đã được upload. Ghi products.json...")
} else {
  console.log(
    `🗜️  Cài đặt nén: WebP quality=${WEBP_QUALITY}, max ${MAX_DIM}px, effort=${EFFORT}`
  )
  console.log(`🚀 Chạy với ${CONCURRENCY} workers song song...\n`)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }
function sha1(s)   { return createHash("sha1").update(s).digest("hex") }

function generateSignature(params) {
  const str = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&")
  return createHash("sha1").update(str + API_SECRET).digest("hex")
}

async function withRetry(label, fn, retries = 3) {
  let last
  for (let i = 1; i <= retries; i++) {
    try { return await fn() } catch (e) {
      last = e
      if (i < retries) {
        console.warn(`  ⚠️  ${label} (thử ${i}/${retries}): ${e.message}`)
        await sleep(i * 2000)
      }
    }
  }
  throw last
}

async function downloadAndConvert(url) {
  const res = await withRetry(`download`, () => fetch(url))
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())

  const webpBuf = await sharp(buf)
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: EFFORT, smartSubsample: true })
    .toBuffer()

  return {
    webpBuf,
    inKB:  Math.round(buf.length / 1024),
    outKB: Math.round(webpBuf.length / 1024),
    pct:   Math.round((1 - webpBuf.length / buf.length) * 100),
  }
}

async function uploadToCloudinary(webpBuf, publicId) {
  const timestamp = Math.floor(Date.now() / 1000)
  const params    = {
    folder:     "vi-products",
    overwrite:  "true",
    public_id:  publicId,
    timestamp:  String(timestamp),
  }
  const signature = generateSignature(params)

  const fd = new FormData()
  fd.append("file",      new Blob([webpBuf], { type: "image/webp" }), `${publicId}.webp`)
  fd.append("api_key",   API_KEY)
  fd.append("timestamp", String(timestamp))
  fd.append("signature", signature)
  fd.append("folder",    params.folder)
  fd.append("overwrite", params.overwrite)
  fd.append("public_id", publicId)

  const res  = await withRetry(`upload`, () =>
    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })
  )
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${res.status}`)
  return json.secure_url
}

// ─── Migration pipeline for one URL ──────────────────────────────────────────
let doneCount = skipped

async function migrateUrl(url) {
  try {
    const publicId = sha1(url)
    const { webpBuf, inKB, outKB, pct } = await downloadAndConvert(url)
    const cloudUrl = await uploadToCloudinary(webpBuf, publicId)

    cache[url] = cloudUrl
    doneCount++

    const bar  = "█".repeat(Math.floor((doneCount / total) * 20))
    const rest = "░".repeat(20 - Math.floor((doneCount / total) * 20))
    const sign = pct < 0 ? "+" : "-"
    console.log(
      `  ✅ [${doneCount}/${total}] [${bar}${rest}] ${inKB}KB → ${outKB}KB (${sign}${Math.abs(pct)}%)`
    )

    // Save cache every 10 uploads
    if (doneCount % 10 === 0) saveCache()

    return cloudUrl
  } catch (err) {
    doneCount++
    console.error(`  ❌ [${doneCount}/${total}] FAILED: ${url.split("/").pop()} — ${err.message}`)
    return null
  }
}

// ─── Concurrency pool ─────────────────────────────────────────────────────────
async function runPool(items, worker, limit) {
  let idx = 0
  async function run() {
    while (idx < items.length) {
      const i = idx++
      await worker(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
}

// ─── Grace shutdown ───────────────────────────────────────────────────────────
process.on("SIGINT", () => {
  console.log("\n\n⚡ Đang dừng... lưu cache lại để resume sau.")
  saveCache()
  process.exit(0)
})

// ─── Run ──────────────────────────────────────────────────────────────────────
const startTime = Date.now()

await runPool(pendingUrls, migrateUrl, CONCURRENCY)
saveCache()

// Update products.json with cached URLs
let updated = 0
for (const p of products) {
  if (typeof p?.image === "string" && cache[p.image] && cache[p.image] !== p.image) {
    p.image = cache[p.image]
    updated++
  }
}

writeFileSync(productsPath, `${JSON.stringify(products)}\n`, "utf8")

const elapsed   = Math.round((Date.now() - startTime) / 1000)
const succeeded = Object.keys(cache).length
const failed    = total - succeeded

console.log(`
╔══════════════════════════════════════════╗
║         Migration Complete! 🎉           ║
╠══════════════════════════════════════════╣
║  Tổng URLs        : ${String(total).padEnd(20)}║
║  Thành công       : ${String(succeeded).padEnd(20)}║
║  Thất bại         : ${String(failed).padEnd(20)}║
║  Products đã cập nhật: ${String(updated).padEnd(17)}║
║  Thời gian        : ${String(elapsed + "s").padEnd(20)}║
╚══════════════════════════════════════════╝

📁 Đã ghi: public/products.json
📦 Backup: public/products.cloudinary-backup.json
💾 Cache : public/products.cloudinary-cache.json
   (Giữ file cache lại để resume nếu cần)
`)
