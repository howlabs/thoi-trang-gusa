import postgres from "postgres"

let sql: ReturnType<typeof postgres> | null = null

export function getDb() {
  if (!sql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL chưa được cấu hình")
    sql = postgres(url, {
      ssl: "require",
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return sql
}
