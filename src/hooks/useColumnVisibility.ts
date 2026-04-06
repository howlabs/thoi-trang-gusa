import { useState } from "react"
import type { ColKey } from "@/types"
import { ALL_COLS, DEFAULT_COLS } from "@/constants"

export function useColumnVisibility() {
  const [columns, setColumns] = useState<ColKey[]>(DEFAULT_COLS)

  const toggleCol = (key: ColKey) => {
    setColumns((prev) => {
      if (prev.includes(key)) return prev.length <= 2 ? prev : prev.filter((c) => c !== key)
      return [...prev, key]
    })
  }

  return { columns, toggleCol, allCols: ALL_COLS }
}
