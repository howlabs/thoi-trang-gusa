import { createHash } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { put } from "@vercel/blob"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")
const productsPath = path.join(repoRoot, "public", "products.json")
const backupPath = path.join(repoRoot, "public", "products.sapo-backup.json")
const envPath = path.join(repoRoot, ".env.local")
const sapoHost = "sapo.dktcdn.net"
const concurrency = Number(process.env.BLOB_MIGRATION_CONCURRENCY ?? 6)

if (existsSync(envPath)) {
  const envLines = readFileSync(envPath, "utf8").split(/\r?\n/)
  for (const line of envLines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "")
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

const token = process.env.BLOB_READ_WRITE_TOKEN

if (!token) {
  console.error("Missing BLOB_READ_WRITE_TOKEN.")
  process.exit(1)
}

const raw = readFileSync(productsPath, "utf8")
const products = JSON.parse(raw)

if (!Array.isArray(products)) {
  console.error("public/products.json must be a JSON array.")
  process.exit(1)
}

if (!existsSync(backupPath)) {
  writeFileSync(backupPath, raw, "utf8")
}

const sapoUrls = [
  ...new Set(
    products
      .map((product) => product?.image)
      .filter((image) => typeof image === "string" && image.includes(sapoHost)),
  ),
]

const total = sapoUrls.length

if (total === 0) {
  console.log("No Sapo image URLs found. Nothing to migrate.")
  process.exit(0)
}

console.log(`Found ${total} unique Sapo image URLs.`)

const mimeToExtension = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
  ["image/avif", ".avif"],
  ["image/bmp", ".bmp"],
  ["image/tiff", ".tiff"],
])

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sha1(value) {
  return createHash("sha1").update(value).digest("hex")
}

function getFileExtension(url, contentType) {
  try {
    const parsed = new URL(url)
    const ext = path.extname(parsed.pathname)
    if (ext) {
      return ext.toLowerCase()
    }
  } catch {
    // Ignore parse issues and fall back to the content type.
  }

  if (contentType) {
    const normalized = contentType.split(";")[0].trim().toLowerCase()
    return mimeToExtension.get(normalized) ?? ".bin"
  }

  return ".bin"
}

async function withRetry(label, fn, retries = 3) {
  let lastError

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        console.warn(`${label} failed on attempt ${attempt}/${retries}. Retrying...`)
        await sleep(attempt * 1000)
      }
    }
  }

  throw lastError
}

async function migrateUrl(url, index) {
  const response = await withRetry(`download ${url}`, () => fetch(url))
  if (!response.ok) {
    throw new Error(`Download failed with ${response.status} ${response.statusText} for ${url}`)
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] ?? undefined
  const extension = getFileExtension(url, contentType)
  const pathname = `products/sapo/${sha1(url)}${extension}`
  const body = Buffer.from(await response.arrayBuffer())

  const blob = await withRetry(`upload ${pathname}`, () =>
    put(pathname, body, {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType,
      token,
    }),
  )

  console.log(`[${index + 1}/${total}] ${pathname}`)
  return blob.url
}

async function runPool(items, worker, limit) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function runWorker() {
    while (true) {
      const current = nextIndex
      nextIndex += 1
      if (current >= items.length) {
        return
      }

      results[current] = await worker(items[current], current)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => runWorker()),
  )

  return results
}

const migratedUrls = await runPool(sapoUrls, migrateUrl, concurrency)
const urlMap = new Map(sapoUrls.map((url, index) => [url, migratedUrls[index]]))

for (const product of products) {
  if (typeof product?.image === "string" && urlMap.has(product.image)) {
    product.image = urlMap.get(product.image)
  }
}

writeFileSync(productsPath, `${JSON.stringify(products)}\n`, "utf8")

console.log(`Migration complete. Updated ${productsPath}.`)
console.log(`Backup saved at ${backupPath}.`)
