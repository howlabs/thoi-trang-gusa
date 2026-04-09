import { useState, useEffect, useRef, useCallback } from "react"

const CAT_QUOTES = [
  "Ê, ngồi lướt điện thoại à? Khách kìa! 📱",
  "Làm việc đi bạn ơi, KPI không tự chạy đâu 📊",
  "Ngáp hoài vậy? Khách thấy tưởng tiệm sắp đóng 🥱",
  "Mày ngồi đây bao lâu rồi mà chưa chốt đơn nào? 💀",
  "Nhìn mặt là biết chưa bán được gì hôm nay 😏",
  "Lương tháng này mua cá cho tao nha~ 🐟",
  "Xinh gái mà lười quá ha 😼",
  "Tồn kho chất đống thế, bán hay để trưng? 📦",
  "Hàng sale đi, để lâu thành đồ cổ rồi kìa 💸",
  "Tồn kho nhiều hơn khách hàng luôn á nha 😂",
  "Hàng này bụi phủ mấy lớp rồi, lau đi~ 🧹",
  "Nhập thì nhanh, bán thì chậm như rùa 🐢",
  "Khách hỏi giá mà trả lời 'để em check' là mất khách nha 🙄",
  "Khách đang đợi kìa, reply đi đừng seen! 💬",
  "Chốt đơn chưa hay đang 'tư vấn' cả buổi? 🤡",
  "Bán hàng gì mà khách chạy nhanh hơn tao 🏃",
  "1 tiếng rồi chưa có đơn nào, tao bán còn giỏi hơn 🐱",
  "Khách inbox mà 30 phút sau mới rep, khách đi mất rồi~ 👻",
  "Mặt lạnh quá, khách tưởng vào nhầm bệnh viện 🏥",
  "Cười lên đi, bán hàng mà mặt như đòi nợ 😤",
  "Nhiệt tình lên chút, khách không cắn đâu 😸",
  "Ơ, khách vào mà không chào hả? Meow~ 🐾",
  "Nói 'dạ', 'vâng' đi, đừng 'ừ' với khách 😑",
  "Target tháng này bao nhiêu? Chắc xa lắm nhỉ 📉",
  "Tháng này thưởng chắc mua được gói mì 🍜",
  "Đồng nghiệp bán 50 đơn, mày bán được 5... meow 💅",
  "Doanh số thấp hơn nhiệt độ phòng luôn á 🥶",
  "Sếp mà thấy doanh số này chắc khóc 😹",
  "Ship hàng chưa mà ngồi đây? 📦",
  "Đóng gói kiểu gì mà khách complaint hoài vậy? 🤔",
  "Ghi sai địa chỉ nữa là tao cào mày nha 🐱",
  "Hàng gửi 3 ngày chưa tới, khách réo kìa 📞",
  "Tao là mèo, tao biết hết 🧠",
  "Đừng nhìn tao, nhìn hàng kìa 👀",
  "Tao ngồi đây coi mày làm việc cho vui 🍿",
  "Mày thua tao rồi, tao nằm không mà vẫn có ăn 😎",
  "Meow~ tao đánh giá hiệu suất mày: 2/10 ⭐",
  "Wifi chậm hay mày chậm? 🤨",
  "Khách đi rồi kìa... à mà kệ, lúc nào chả vậy 🫠",
  "Mày có biết 'upsell' là gì không? Google đi 🔍",
  "Nghỉ việc đi, để tao bán cho 😼",
]

/*
 * ── Sprite sheet: cat2.png ──────────────────────
 * 896 × 4608 px  →  14 cols × 72 rows  →  64×64 per frame
 *
 * Verified row map (0-indexed):
 *   0  idle (sit, front-left)      4 frames
 *   1  idle (sit, front)           4 frames
 *   2  walk up                     6 frames
 *   3  walk down                   6 frames
 *   4  walk left                   6 frames    ← horizontal movement
 *   5  stretch / lie down         13 frames    ← one-shot
 *   6  run down                    4 frames
 *   7  run up                      4 frames
 *   8  run right                   5 frames    ← horizontal fast
 *   9  run left                    5 frames
 *  10  lick paw (sit, front)       8 frames
 *  11  lick paw (lie, front)       8 frames
 *  12  meow (sit)                  3 frames
 *  13  meow (lie)                  3 frames
 *  14  meow (stand)                3 frames
 *  15  scratch ear (sit, left)     8 frames
 *  17  groom face                  8 frames
 *  19  idle sit (front)            5 frames    ← look around
 *  22  idle sit (right)            5 frames
 *  43  sleep curled (right)        2 frames
 *  48  sleep flat (right)          2 frames
 *  51+ scared run (high tail)      ~9 frames
 *  67  pounce/leap (right)         5 frames
 */

const SPRITE_URL = "/sprites/cat/cat2.png"
const FRAME = 64
const SIZE = 128
const COLS = 14

type CatState =
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "sleep"
  | "groom"
  | "stretch"
  | "look"
  | "scratch"
  | "pounce"

interface Anim { row: number; frames: number; ms: number; once?: boolean }

const ANIMS: Record<CatState, Anim> = {
  idle:    { row: 0,  frames: 4,  ms: 320 },       // sit idle
  walk:    { row: 4,  frames: 6,  ms: 130 },       // walk left (flip for right)
  run:     { row: 8,  frames: 5,  ms: 90 },        // run right (flip for left)
  jump:    { row: 8,  frames: 5,  ms: 120 },       // reuse run for jump visual
  sleep:   { row: 43, frames: 2,  ms: 800 },       // curled sleep breathing
  groom:   { row: 10, frames: 8,  ms: 200 },       // lick paw
  stretch: { row: 5,  frames: 13, ms: 250, once: true }, // yawn → lie down
  look:    { row: 19, frames: 5,  ms: 400 },       // sit & blink/look
  scratch: { row: 15, frames: 8,  ms: 150 },       // scratch ear
  pounce:  { row: 67, frames: 5,  ms: 100 },       // leap forward
}

export function ScreenCat() {
  const [state, setState] = useState<CatState>("idle")
  const [quote, setQuote] = useState<string | null>(null)
  const [showPurr, setShowPurr] = useState(false)
  const [jumpY, setJumpY] = useState(0)
  const [frame, setFrame] = useState(0)

  const frameRaf = useRef(0)
  const sr = useRef(state)
  const animStartedAt = useRef(0)
  const onceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setCatState = useCallback((next: CatState) => {
    sr.current = next
    if (next !== "idle") setShowPurr(false)
    setState(next)
  }, [])

  // ── Frame timing ──
  useEffect(() => {
    const a = ANIMS[state]
    animStartedAt.current = performance.now()
    if (onceTimer.current) {
      clearTimeout(onceTimer.current)
      onceTimer.current = null
    }
    if (a.once) {
      onceTimer.current = setTimeout(() => {
        if (sr.current === state) setCatState("idle")
      }, a.frames * a.ms)
    }
    return () => {
      if (onceTimer.current) {
        clearTimeout(onceTimer.current)
        onceTimer.current = null
      }
    }
  }, [setCatState, state])

  useEffect(() => {
    let off = false

    const tick = (now: number) => {
      if (off) return
      const a = ANIMS[sr.current]
      const elapsed = now - animStartedAt.current
      const nextFrame = a.once
        ? Math.min(a.frames - 1, Math.floor(elapsed / a.ms))
        : Math.floor(elapsed / a.ms) % a.frames

      setFrame((prev) => (prev === nextFrame ? prev : nextFrame))
      frameRaf.current = requestAnimationFrame(tick)
    }

    frameRaf.current = requestAnimationFrame(tick)

    return () => {
      off = true
      cancelAnimationFrame(frameRaf.current)
    }
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
    let sleepTm: ReturnType<typeof setTimeout> | null = null
    let actTm: ReturnType<typeof setTimeout> | null = null
    const LOCKED = new Set<CatState>(["sleep", "groom", "stretch", "look", "scratch"])

    const sched = (): ReturnType<typeof setTimeout> => {
      return setTimeout(() => {
        if (LOCKED.has(sr.current)) { timer = sched(); return }

        const r = Math.random()
        if (r < 0.18) {
          setJumpY(-50 - Math.random() * 20)                   // jump
          setCatState("jump")
          setTimeout(() => { if (sr.current === "jump") setCatState("idle") }, 600)
        } else if (r < 0.36) {
          setCatState("groom")                                    // lick paw
          actTm = setTimeout(() => { if (sr.current === "groom") setCatState("idle") }, 3500 + Math.random() * 2000)
        } else if (r < 0.52) {
          setCatState("scratch")                                  // scratch ear
          actTm = setTimeout(() => { if (sr.current === "scratch") setCatState("idle") }, 2500 + Math.random() * 1500)
        } else if (r < 0.7) {
          setCatState("look")                                     // sit & look around
          actTm = setTimeout(() => { if (sr.current === "look") setCatState("idle") }, 2500 + Math.random() * 2000)
        } else if (r < 0.84) {
          setCatState("stretch")                                  // stretch (one-shot, auto→idle)
        } else {
          setCatState("sleep")                                    // sleep
          sleepTm = setTimeout(() => setCatState("idle"), 8000 + Math.random() * 10000)
        }
        timer = sched()
      }, 2000 + Math.random() * 3000)
    }

    let timer = sched()

    return () => {
      clearTimeout(timer)
      if (sleepTm) clearTimeout(sleepTm)
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

  // ── Sprite math ──
  const a = ANIMS[state]
  const col = frame % COLS
  const row = a.row + Math.floor(frame / COLS)
  const s = SIZE / FRAME

  const isJump = state === "jump"
  const isSleep = state === "sleep"
  const fixedX = 24
  const fixedY = window.innerHeight - SIZE - 20
  const translateY = Math.round(fixedY + (isJump ? jumpY : 0))

  return (
    <div
      className="screen-cat-container"
      style={{
        transform: `translate3d(${fixedX}px, ${translateY}px, 0)`,
        transition: isJump
          ? "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)"
          : undefined,
      }}
    >
      {quote && !isSleep && <div className="screen-cat-bubble">{quote}</div>}
      {isSleep && <div className="screen-cat-bubble">💤 Zzz...</div>}

      <div className="screen-cat-body" onClick={handleClick}>
        {showPurr && <span className="scat-purr">purr~</span>}
        <div
          style={{
            width: SIZE,
            height: SIZE,
            backgroundImage: `url("${SPRITE_URL}")`,
            backgroundPosition: `${-col * FRAME * s}px ${-row * FRAME * s}px`,
            backgroundSize: `${COLS * SIZE}px auto`,
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  )
}
