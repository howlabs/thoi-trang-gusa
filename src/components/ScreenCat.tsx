import { useState, useEffect, useRef, useCallback } from "react"
import type { CatState } from "./cat/types"
import { ACTION_CONFIG } from "./cat/types"
import { CatAura, CatTail, CatPaws, CatOutfitLayer, CatBody, CatHead } from "./cat/CatParts"

const CAT_QUOTES = [
  "Khách VIP đến kìa, pha trà hoa cúc vạn thọ nhanh! 🍵",
  "Hôm nay doanh thu chưa đạt 9 chữ số à? Kém. 💅",
  "Đơn này hơi bé, nhưng thôi tạm chấp nhận. 👑",
  "Mèo chủ tịch không thích nhân viên lười biếng. 🥂",
  "Hãy chốt sale bằng phong thái của một CEO. 💎",
  "Khách quẹt thẻ đen thì cứ mạnh tay nâng chuẩn dịch vụ lên. 💳",
  "Làm việc đi, chiếc Rolls-Royce không tự nhiên mà có đâu. 🏎️",
  "Đẳng cấp không nằm ở bộ vest, mà ở cách chốt deal nghìn đô. 🏆",
  "Bán hàng cốt ở cái tâm, nhưng tài khoản phải ở mức tỷ phú. 💵",
  "Meow~ Từ nay hãy gọi Cát Tổng là Sếp Mèo. 🎩",
  "Trông cách làm việc chưa toát lên vẻ thượng lưu ngạo nghễ lắm. 🕴️",
  "Hàng limited cả đấy, tư vấn cho khách bằng sự kiêu hãnh vào. ✨",
  "Thị trường đỏ rực cả rồi, đi chốt vài đơn an ủi ta xem. 📈",
  "Đừng giảm giá, hãy làm tăng giá trị cốt lõi của chúng ta lên. 🕍",
  "Sáng nay dùng bữa ở Landmark 81 hơi mệt, bạn tự lo doanh số nhé. 🍾",
  "Chốt lẹ đi, lát mua cho Cát Tổng hộp Pate cá hồi Na Uy thượng hạng. 🥩",
  "Kéo áo cho thẳng thớm, có khách sộp chuẩn bị vào kìa. 💰",
  "Doanh số bèo bọt thế này mà đòi tiền thưởng đi Maldives sao? 🏖️",
  "Ta vừa ký xong lô biệt thự ven biển, bạn lại vừa trượt cái đơn 300 cành? 🏢",
  "Nỗ lực lên người trẻ, rồi bạn sẽ mua được cái đồng hồ Hublot như ta. ⌚"
]

const SIZE = 120

function CatSvg({ state }: { state: CatState }) {
  const isJump = state === "jump"
  const { emotion, outfit, hat } = ACTION_CONFIG[state] || ACTION_CONFIG.idle;

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 128 128" className={`ceo-cat ceo-cat-${state}`}>
      <CatAura />
      <g className={`ceo-cat-body-wrapper ${isJump ? 'anime-jump' : ''}`}>
        <CatTail isJump={isJump} />
        <CatPaws />
        <CatOutfitLayer outfit={outfit} />
        <CatBody outfit={outfit} />
        <CatHead emotion={emotion} hat={hat} />
      </g>
    </svg>
  )
}

export function ScreenCat() {
  const [state, setState] = useState<CatState>("idle")
  const [quote, setQuote] = useState<string | null>(null)
  const [showPurr, setShowPurr] = useState(false)
  const [jumpY, setJumpY] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  
  const sr = useRef(state)

  const setCatState = useCallback((next: CatState) => {
    sr.current = next
    if (next !== "idle") setShowPurr(false)
    setState(next)
  }, [])

  // ── Purr after 5s idle ──
  useEffect(() => {
    if (state !== "idle") return
    const id = setTimeout(() => {
      if (sr.current === "idle") setShowPurr(true)
    }, 5000)
    return () => clearTimeout(id)
  }, [state])

  // ── Click → jump + quote ──
  const handleClick = useCallback(() => {
    setQuote(CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)])
    setTimeout(() => setQuote(null), 4000)
    setJumpY(-50 - Math.random() * 20)
    setCatState("jump")
    setTimeout(() => { if (sr.current === "jump") setCatState("idle") }, 600)
  }, [setCatState])

  // ── Idle AI ──
  useEffect(() => {
    let actTm: ReturnType<typeof setTimeout> | null = null
    const LOCKED = new Set<CatState>([
      "sleep", "groom", "stretch", "look", "scratch", "lay", "whine", "fly", "walk", "run",
      "dance", "eat", "hide", "attack", "celebrate", "work", "laugh"
    ])

    const sched = (): ReturnType<typeof setTimeout> => {
      return setTimeout(() => {
        if (LOCKED.has(sr.current)) { timer = sched(); return }

        const r = Math.random()
        const acts: { p: number, s: CatState }[] = [
          { p: 0.05, s: "jump" },
          { p: 0.10, s: "lay" },
          { p: 0.15, s: "whine" },
          { p: 0.20, s: "fly" },
          { p: 0.25, s: "walk" },
          { p: 0.30, s: "run" },
          { p: 0.35, s: "groom" },
          { p: 0.40, s: "scratch" },
          { p: 0.45, s: "dance" },
          { p: 0.50, s: "eat" },
          { p: 0.55, s: "hide" },
          { p: 0.60, s: "attack" },
          { p: 0.65, s: "celebrate" },
          { p: 0.70, s: "work" },
          { p: 0.75, s: "laugh" },
          { p: 0.80, s: "stretch" },
          { p: 0.85, s: "look" },
          { p: 1.00, s: "sleep" }
        ];

        const type = acts.find(a => r < a.p)?.s || "sleep";
        
        let dur = 3000;
        
        if (type === "jump") {
          setJumpY(-80 - Math.random() * 60)
          setCatState("jump")
          setTimeout(() => { if (sr.current === "jump") setCatState("idle") }, 800)
          dur = 0
        } else if (type === "fly") {
          setCatState("fly")
          setPos(p => ({ ...p, y: Math.min(-100, Math.max(p.y - 100 - Math.random() * 200, -500)) }))
          actTm = setTimeout(() => {
            setPos(p => ({ ...p, y: 0 }))
            setTimeout(() => { if (sr.current === "fly") setCatState("idle") }, 600)
          }, 3500 + Math.random() * 3000)
          dur = 0
        } else if (type === "walk" || type === "run") {
          setCatState(type)
          const maxW = typeof window !== 'undefined' ? window.innerWidth - 180 : 800
          const dist = type === "run" ? 300 + Math.random() * 400 : 100 + Math.random() * 200
          setPos(p => ({ x: Math.max(0, Math.min(maxW, p.x + (Math.random() > 0.5 ? 1 : -1) * dist)), y: 0 }))
          dur = type === "run" ? 1500 : 2500
        } else if (type === "sleep") {
          dur = 8000 + Math.random() * 10000
        } else if (type === "attack" || type === "hide") {
          dur = 1500 + Math.random() * 1500
        } else if (type === "lay" || type === "eat") {
          dur = 4000 + Math.random() * 4000
        } else {
          dur = 2500 + Math.random() * 2500
        }

        if (dur > 0 && type !== "jump" && type !== "fly") {
          setCatState(type)
          actTm = setTimeout(() => { if (sr.current === type) setCatState("idle") }, dur)
        }
        
        timer = sched()
      }, 2000 + Math.random() * 3000)
    }

    let timer = sched()

    return () => {
      clearTimeout(timer)
      if (actTm) clearTimeout(actTm)
    }
  }, [setCatState])

  // ── Quote timer ──
  useEffect(() => {
    const go = (): ReturnType<typeof setTimeout> =>
      setTimeout(() => {
        setQuote(CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)])
        setTimeout(() => setQuote(null), 4000)
        tm = go()
      }, 6000 + Math.random() * 8000)
    let tm = go()
    return () => clearTimeout(tm)
  }, [])

  const isJump = state === "jump"
  const isSleep = state === "sleep"

  return (
    <div
      className="screen-cat-container"
      style={{
        transform: `translate(${pos.x}px, ${pos.y + (isJump ? jumpY : 0)}px)`,
        transition: state === "run" || state === "walk"
          ? `transform ${state === "run" ? "1.5s" : "3s"} ease-in-out`
          : state === "fly"
          ? "transform 2s cubic-bezier(0.2, 0.8, 0.4, 1)"
          : isJump
          ? "transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)" /* slow at top */
          : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",  /* gravity accelerate / normal return */
      }}
    >
      {quote && !isSleep && <div className="screen-cat-bubble">{quote}</div>}
      {isSleep && <div className="screen-cat-bubble">💤 Zzz...</div>}

      <div className="screen-cat-body" onClick={handleClick}>
        {showPurr && <span className="scat-purr">purr~</span>}
        <CatSvg state={state} />
      </div>
    </div>
  )
}
