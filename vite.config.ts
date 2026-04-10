import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import fs from "fs"
import postgres from "postgres"
import { defineConfig } from "vite"

// Đọc .env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, "./.env.local")
  const env: Record<string, string> = {}
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const match = line.match(/^(\w+)=(.*)/)
      if (match) env[match[1]] = match[2].trim()
    }
  }
  return env
}

// Parse JSON body từ request
function parseBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk: any) => { body += chunk.toString() })
    req.on("end", () => {
      try { resolve(JSON.parse(body)) }
      catch (e) { reject(e) }
    })
    req.on("error", reject)
  })
}

function jsonResponse(res: any, data: any, status = 200) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(data))
}

// Vite plugin: API routes với PostgreSQL
function productsApi() {
  let sql: ReturnType<typeof postgres> | null = null

  function getDb(): ReturnType<typeof postgres> {
    if (!sql) {
      const env = loadEnv()
      if (!env.DATABASE_URL) throw new Error("DATABASE_URL chưa cấu hình")
      sql = postgres(env.DATABASE_URL, {
        ssl: "require",
        max: 5,
        idle_timeout: 20,
        connect_timeout: 10,
      })
    }
    return sql
  }

  return {
    name: "products-api",
    configureServer(server: any) {
      // GET /api/products - Lấy danh sách sản phẩm
      server.middlewares.use("/api/products", async (req: any, res: any, next: any) => {
        if (req.method !== "GET" || req.originalUrl !== "/api/products") return next()

        try {
          const db = getDb()
          const rows = await db`
            SELECT name, variant, sku, type, attr1, image,
                   retail_price, stock_cn1, cost_cn1
            FROM products
            ORDER BY id ASC
          `
          jsonResponse(res, rows.map((r: any) => ({
            ...r,
            retail_price: Number(r.retail_price),
            stock_cn1: Number(r.stock_cn1),
            cost_cn1: Number(r.cost_cn1),
          })))
        } catch (e) {
          jsonResponse(res, { error: String(e) }, 500)
        }
      })

      // POST /api/products - Thêm sản phẩm mới
      server.middlewares.use("/api/products", async (req: any, res: any, next: any) => {
        if (req.method !== "POST") return next()

        try {
          const db = getDb()
          const body = await parseBody(req)
          const result = await db`
            INSERT INTO products (name, variant, sku, type, attr1, image, retail_price, stock_cn1, cost_cn1)
            VALUES (${body.name}, ${body.variant}, ${body.sku}, ${body.type}, ${body.attr1}, ${body.image},
                    ${body.retail_price || 0}, ${body.stock_cn1 || 0}, ${body.cost_cn1 || 0})
            RETURNING *
          `
          jsonResponse(res, result[0], 201)
        } catch (e) {
          jsonResponse(res, { error: String(e) }, 500)
        }
      })

      // PUT /api/products/:sku - Cập nhật sản phẩm
      server.middlewares.use("/api/products", async (req: any, res: any, next: any) => {
        if (req.method !== "PUT") return next()

        try {
          const url = new URL(req.originalUrl, "http://localhost")
          const sku = url.searchParams.get("sku")
          if (!sku) {
            return jsonResponse(res, { error: "Thiếu sku" }, 400)
          }

          const db = getDb()
          const body = await parseBody(req)

          const fields: string[] = []
          const values: any[] = []

          for (const [key, value] of Object.entries(body)) {
            if (["name", "variant", "sku", "type", "attr1", "image", "retail_price", "stock_cn1", "cost_cn1"].includes(key)) {
              fields.push(key)
              values.push(value)
            }
          }

          if (fields.length === 0) {
            return jsonResponse(res, { error: "Không có field để cập nhật" }, 400)
          }

          // Build SET clause dynamically
          const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ")
          values.push(new Date().toISOString())

          const result = await db.unsafe(
            `UPDATE products SET ${setClause}, updated_at = $${values.length} WHERE sku = $${values.length - 0 + 0} RETURNING *`,
            [...values, sku]
          )

          if (result.length === 0) {
            return jsonResponse(res, { error: "Không tìm thấy sản phẩm" }, 404)
          }
          jsonResponse(res, result[0])
        } catch (e) {
          jsonResponse(res, { error: String(e) }, 500)
        }
      })

      // GET /api/cloudinary-usage
      server.middlewares.use("/api/cloudinary-usage", async (req: any, res: any, next: any) => {
        if (req.method === "GET" && req.originalUrl === "/api/cloudinary-usage") {
          try {
            const env = loadEnv()
            const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env

            if (!cloudName || !apiKey || !apiSecret) {
              return jsonResponse(res, { error: "Missing Cloudinary credentials" }, 400)
            }

            const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
            const clRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
              headers: { Authorization: "Basic " + auth }
            })
            const data = await clRes.json()
            jsonResponse(res, data)
          } catch (e) {
            jsonResponse(res, { error: String(e) }, 500)
          }
        } else {
          next()
        }
      })

      // POST /api/update-product-image
      server.middlewares.use("/api/update-product-image", async (req: any, res: any, next: any) => {
        if (req.method !== "POST") return next()

        try {
          const { sku, imageUrl, oldImageUrl } = await parseBody(req)
          const db = getDb()

          // Cập nhật ảnh trong database
          await db`
            UPDATE products SET image = ${imageUrl}, updated_at = NOW()
            WHERE sku = ${sku}
          `

          // Xóa ảnh cũ trên Cloudinary
          if (oldImageUrl && oldImageUrl.includes("cloudinary.com")) {
            const parts = oldImageUrl.split("/upload/")
            if (parts.length === 2) {
              let pathStr = parts[1]
              if (pathStr.match(/^v\d+\//)) pathStr = pathStr.replace(/^v\d+\//, "")
              const lastDotIdx = pathStr.lastIndexOf(".")
              if (lastDotIdx !== -1) pathStr = pathStr.substring(0, lastDotIdx)

              const env = loadEnv()
              const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env
              if (cloudName && apiKey && apiSecret) {
                const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
                fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${pathStr}`, {
                  method: "DELETE",
                  headers: { Authorization: "Basic " + auth }
                }).catch(e => console.error("Cloudinary delete failed:", e))
              }
            }
          }

          jsonResponse(res, { success: true })
        } catch (e) {
          jsonResponse(res, { success: false, error: String(e) }, 500)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), productsApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
