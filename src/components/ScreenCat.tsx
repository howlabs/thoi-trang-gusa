import { useState, useEffect, useRef } from "react"

const CAT_QUOTES = [
  // --- Cà khịa nhân viên lười ---
  "Ê, ngồi lướt điện thoại à? Khách kìa! 📱",
  "Làm việc đi bạn ơi, KPI không tự chạy đâu 📊",
  "Ngáp hoài vậy? Khách thấy tưởng tiệm sắp đóng 🥱",
  "Mày ngồi đây bao lâu rồi mà chưa chốt đơn nào? 💀",
  "Nhìn mặt là biết chưa bán được gì hôm nay 😏",
  "Lương tháng này mua cá cho tao nha~ 🐟",
  "Xinh gái mà lười quá ha 😼",

  // --- Cà khịa tồn kho ---
  "Tồn kho chất đống thế, bán hay để trưng? 📦",
  "Hàng sale đi, để lâu thành đồ cổ rồi kìa 💸",
  "Tồn kho nhiều hơn khách hàng luôn á nha 😂",
  "Hàng này bụi phủ mấy lớp rồi, lau đi~ 🧹",
  "Nhập thì nhanh, bán thì chậm như rùa 🐢",

  // --- Cà khịa chốt đơn ---
  "Khách hỏi giá mà trả lời 'để em check' là mất khách nha 🙄",
  "Khách đang đợi kìa, reply đi đừng seen! 💬",
  "Chốt đơn chưa hay đang 'tư vấn' cả buổi? 🤡",
  "Bán hàng gì mà khách chạy nhanh hơn tao 🏃",
  "1 tiếng rồi chưa có đơn nào, tao bán còn giỏi hơn 🐱",
  "Khách inbox mà 30 phút sau mới rep, khách đi mất rồi~ 👻",

  // --- Cà khịa thái độ ---
  "Mặt lạnh quá, khách tưởng vào nhầm bệnh viện 🏥",
  "Cười lên đi, bán hàng mà mặt như đòi nợ 😤",
  "Nhiệt tình lên chút, khách không cắn đâu 😸",
  "Ơ, khách vào mà không chào hả? Meow~ 🐾",
  "Nói 'dạ', 'vâng' đi, đừng 'ừ' với khách 😑",

  // --- Cà khịa doanh số ---
  "Target tháng này bao nhiêu? Chắc xa lắm nhỉ 📉",
  "Tháng này thưởng chắc mua được gói mì 🍜",
  "Đồng nghiệp bán 50 đơn, mày bán được 5... meow 💅",
  "Doanh số thấp hơn nhiệt độ phòng luôn á 🥶",
  "Sếp mà thấy doanh số này chắc khóc 😹",

  // --- Cà khịa ship hàng ---
  "Ship hàng chưa mà ngồi đây? 📦",
  "Đóng gói kiểu gì mà khách complaint hoài vậy? 🤔",
  "Ghi sai địa chỉ nữa là tao cào mày nha 🐱",
  "Hàng gửi 3 ngày chưa tới, khách réo kìa 📞",

  // --- Mèo cà khịa random ---
  "Tao là mèo, tao biết hết 🧠",
  "Đừng nhìn tao, nhìn hàng kìa 👀",
  "Cửu Âm Chân Kinh... meow~ 🥷",
  "Tao ngồi đây coi mày làm việc cho vui 🍿",
  "Mày thua tao rồi, tao nằm không mà vẫn có ăn 😎",
  "Meow~ tao đánh giá hiệu suất mày: 2/10 ⭐",
  "Wifi chậm hay mày chậm? 🤨",
  "Khách đi rồi kìa... à mà kệ, lúc nào chả vậy 🫠",
  "Mày có biết 'upsell' là gì không? Google đi 🔍",
  "Nghỉ việc đi, để tao bán cho 😼",
]

type CatState = "idle" | "running" | "jumping" | "sleeping"

const CAT_SIZE = 120

function RunningCatSVG({ flip }: { flip: boolean }) {
  return (
    <svg width={CAT_SIZE} height={CAT_SIZE} viewBox="0 0 120 100" fill="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      {/* tail – goofy springy */}
      <path className="scat-tail" d="M8 55 C-5 40, 5 25, 0 15 C-3 8, 5 2, 12 8"
        stroke="#f5a623" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* thicc body */}
      <ellipse cx="48" cy="54" rx="30" ry="18" fill="#f5a623" />
      <ellipse cx="50" cy="58" rx="18" ry="11" fill="#ffecd2" />
      {/* tabby stripes */}
      <path d="M30 48 Q48 42, 66 48" stroke="#e08e10" strokeWidth="2.5" fill="none" opacity="0.3" />
      <path d="M32 55 Q48 50, 64 55" stroke="#e08e10" strokeWidth="2" fill="none" opacity="0.2" />

      {/* HUGE head */}
      <circle cx="84" cy="36" r="22" fill="#f5a623" />
      <ellipse cx="84" cy="42" rx="14" ry="8" fill="#ffecd2" />

      {/* ears */}
      <path d="M66 22 L62 4 L74 18 Z" fill="#f5a623" stroke="#e08e10" strokeWidth="1" />
      <path d="M94 16 L100 -2 L106 16 Z" fill="#f5a623" stroke="#e08e10" strokeWidth="1" />
      <path d="M67 20 L64 8 L73 18 Z" fill="#ff8fa3" opacity="0.6" />
      <path d="M95 15 L100 2 L104 15 Z" fill="#ff8fa3" opacity="0.6" />

      {/* HUGE googly eyes – derpy, one bigger */}
      <g className="scat-eyes">
        <circle cx="76" cy="30" r="8" fill="white" />
        <circle cx="76" cy="30" r="7" stroke="#222" strokeWidth="1" fill="white" />
        <circle cx="78" cy="29" r="4.5" fill="#222" />
        <circle cx="76" cy="27" r="2" fill="white" />

        <circle cx="96" cy="28" r="9" fill="white" />
        <circle cx="96" cy="28" r="8" stroke="#222" strokeWidth="1" fill="white" />
        <circle cx="98" cy="27" r="5" fill="#222" />
        <circle cx="96" cy="25" r="2.2" fill="white" />
      </g>

      {/* eyebrows – judgy */}
      <path d="M69 22 Q73 18, 78 21" stroke="#c47a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M93 18 Q97 16, 103 20" stroke="#c47a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* pink nose */}
      <ellipse cx="86" cy="38" rx="3" ry="2.2" fill="#ff6b8a" />

      {/* goofy open mouth – running tongue out */}
      <path d="M80 42 Q86 48, 92 42" stroke="#222" strokeWidth="1.2" fill="#ff8fa3" />
      <ellipse cx="86" cy="46" rx="4" ry="3" fill="#ff6b8a" opacity="0.8" />

      {/* whiskers */}
      <g className="scat-whiskers" opacity="0.6">
        <line x1="73" y1="38" x2="52" y2="33" stroke="#c47a10" strokeWidth="1" />
        <line x1="73" y1="40" x2="52" y2="40" stroke="#c47a10" strokeWidth="1" />
        <line x1="100" y1="36" x2="118" y2="31" stroke="#c47a10" strokeWidth="1" />
        <line x1="100" y1="38" x2="118" y2="38" stroke="#c47a10" strokeWidth="1" />
      </g>

      {/* blush */}
      <circle cx="72" cy="40" r="4" fill="#ff8fa3" opacity="0.3" />
      <circle cx="100" cy="38" r="4" fill="#ff8fa3" opacity="0.3" />

      {/* tiny stubby legs */}
      <g className="scat-leg-fl">
        <rect x="64" y="68" width="8" height="16" rx="4" fill="#f5a623" />
        <ellipse cx="68" cy="85" rx="5" ry="3" fill="#ffecd2" />
      </g>
      <g className="scat-leg-fr">
        <rect x="74" y="68" width="8" height="16" rx="4" fill="#f5a623" />
        <ellipse cx="78" cy="85" rx="5" ry="3" fill="#ffecd2" />
      </g>
      <g className="scat-leg-bl">
        <rect x="24" y="68" width="8" height="16" rx="4" fill="#f5a623" />
        <ellipse cx="28" cy="85" rx="5" ry="3" fill="#ffecd2" />
      </g>
      <g className="scat-leg-br">
        <rect x="34" y="68" width="8" height="16" rx="4" fill="#f5a623" />
        <ellipse cx="38" cy="85" rx="5" ry="3" fill="#ffecd2" />
      </g>

      {/* speed lines */}
      <line x1="2" y1="50" x2="14" y2="50" stroke="#f5a623" strokeWidth="1.5" opacity="0.4" />
      <line x1="0" y1="56" x2="10" y2="56" stroke="#f5a623" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="62" x2="12" y2="62" stroke="#f5a623" strokeWidth="1" opacity="0.2" />
    </svg>
  )
}

function IdleCatSVG() {
  return (
    <svg width={CAT_SIZE} height={CAT_SIZE} viewBox="0 0 100 100" fill="none">
      {/* tail */}
      <path className="scat-tail-idle" d="M8 76 C-6 66, -2 46, 8 38 C14 34, 8 22, 2 18"
        stroke="#f5a623" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* thicc sitting body */}
      <ellipse cx="44" cy="62" rx="24" ry="30" fill="#f5a623" />
      <ellipse cx="46" cy="70" rx="15" ry="18" fill="#ffecd2" />
      {/* tabby stripes */}
      <path d="M28 50 Q44 44, 60 50" stroke="#e08e10" strokeWidth="2.5" fill="none" opacity="0.25" />
      <path d="M26 58 Q44 52, 62 58" stroke="#e08e10" strokeWidth="2" fill="none" opacity="0.18" />

      {/* HUGE head */}
      <circle cx="46" cy="22" r="24" fill="#f5a623" />
      <ellipse cx="46" cy="30" rx="15" ry="9" fill="#ffecd2" />

      {/* ears */}
      <path d="M26 10 L18 -8 L34 6 Z" fill="#f5a623" stroke="#e08e10" strokeWidth="1" />
      <path d="M58 6 L66 -12 L74 4 Z" fill="#f5a623" stroke="#e08e10" strokeWidth="1" />
      <path d="M27 8 L22 -4 L33 6 Z" fill="#ff8fa3" opacity="0.6" />
      <path d="M59 5 L66 -8 L72 4 Z" fill="#ff8fa3" opacity="0.6" />

      {/* HUGE googly eyes – slightly cross-eyed for derp */}
      <g className="scat-eyes-idle">
        <circle cx="36" cy="18" r="9" fill="white" />
        <circle cx="36" cy="18" r="8" stroke="#222" strokeWidth="1" fill="white" />
        <circle cx="39" cy="17" r="5" fill="#222" />
        <circle cx="37" cy="15" r="2.2" fill="white" />

        <circle cx="58" cy="18" r="10" fill="white" />
        <circle cx="58" cy="18" r="9" stroke="#222" strokeWidth="1" fill="white" />
        <circle cx="55" cy="17" r="5.5" fill="#222" />
        <circle cx="57" cy="15" r="2.5" fill="white" />
      </g>

      {/* raised eyebrow – smug look */}
      <path d="M28 8 Q33 4, 40 7" stroke="#c47a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M54 4 Q60 2, 66 6" stroke="#c47a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* big pink nose */}
      <ellipse cx="47" cy="27" rx="3.5" ry="2.5" fill="#ff6b8a" />

      {/* smug grin :3 */}
      <path d="M40 32 Q44 36, 47 32" stroke="#222" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M47 32 Q50 36, 54 32" stroke="#222" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* whiskers */}
      <g className="scat-whiskers-idle" opacity="0.6">
        <line x1="34" y1="28" x2="10" y2="23" stroke="#c47a10" strokeWidth="1" />
        <line x1="34" y1="30" x2="10" y2="30" stroke="#c47a10" strokeWidth="1" />
        <line x1="60" y1="28" x2="84" y2="23" stroke="#c47a10" strokeWidth="1" />
        <line x1="60" y1="30" x2="84" y2="30" stroke="#c47a10" strokeWidth="1" />
      </g>

      {/* blush */}
      <circle cx="30" cy="28" r="5" fill="#ff8fa3" opacity="0.25" />
      <circle cx="64" cy="28" r="5" fill="#ff8fa3" opacity="0.25" />

      {/* chunky paws */}
      <ellipse cx="32" cy="92" rx="8" ry="5" fill="#f5a623" />
      <ellipse cx="58" cy="92" rx="8" ry="5" fill="#f5a623" />
      <ellipse cx="32" cy="93" rx="5" ry="3" fill="#ffecd2" />
      <ellipse cx="58" cy="93" rx="5" ry="3" fill="#ffecd2" />
      {/* toe beans */}
      <circle cx="29" cy="92" r="1.5" fill="#ff8fa3" opacity="0.5" />
      <circle cx="32" cy="91" r="1.5" fill="#ff8fa3" opacity="0.5" />
      <circle cx="35" cy="92" r="1.5" fill="#ff8fa3" opacity="0.5" />
      <circle cx="55" cy="92" r="1.5" fill="#ff8fa3" opacity="0.5" />
      <circle cx="58" cy="91" r="1.5" fill="#ff8fa3" opacity="0.5" />
      <circle cx="61" cy="92" r="1.5" fill="#ff8fa3" opacity="0.5" />
    </svg>
  )
}

function SleepingCatSVG() {
  return (
    <svg width={CAT_SIZE} height={80} viewBox="0 0 120 70" fill="none">
      {/* tail – curled around like a croissant */}
      <path className="scat-tail-sleep" d="M98 50 C112 44, 114 30, 104 24 C96 20, 88 28, 94 36"
        stroke="#f5a623" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* big round loaf body */}
      <ellipse cx="58" cy="46" rx="38" ry="18" fill="#f5a623" />
      <ellipse cx="56" cy="52" rx="22" ry="10" fill="#ffecd2" opacity="0.5" />
      {/* stripes */}
      <path d="M30 40 Q58 34, 86 40" stroke="#e08e10" strokeWidth="2" fill="none" opacity="0.2" />
      <path d="M28 48 Q58 42, 88 48" stroke="#e08e10" strokeWidth="1.5" fill="none" opacity="0.15" />

      {/* big squishy head resting */}
      <circle cx="28" cy="36" r="20" fill="#f5a623" />
      <ellipse cx="28" cy="42" rx="12" ry="7" fill="#ffecd2" />

      {/* floppy ears */}
      <path d="M12 24 L6 8 L20 20 Z" fill="#f5a623" stroke="#e08e10" strokeWidth="1" />
      <path d="M36 20 L44 4 L48 20 Z" fill="#f5a623" stroke="#e08e10" strokeWidth="1" />
      <path d="M13 22 L8 12 L19 20 Z" fill="#ff8fa3" opacity="0.5" />
      <path d="M37 19 L44 8 L46 19 Z" fill="#ff8fa3" opacity="0.5" />

      {/* happy closed eyes ᴗ ᴗ */}
      <path d="M18 34 Q22 29, 26 34" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 33 Q34 28, 38 33" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* nose */}
      <ellipse cx="28" cy="38" rx="2.5" ry="1.8" fill="#ff6b8a" />

      {/* tiny smile */}
      <path d="M24 41 Q28 44, 32 41" stroke="#222" strokeWidth="0.8" fill="none" />

      {/* squishy paws sticking out */}
      <ellipse cx="14" cy="54" rx="7" ry="4" fill="#f5a623" />
      <ellipse cx="36" cy="54" rx="7" ry="4" fill="#f5a623" />
      <ellipse cx="14" cy="55" rx="4.5" ry="2.5" fill="#ffecd2" />
      <ellipse cx="36" cy="55" rx="4.5" ry="2.5" fill="#ffecd2" />

      {/* blush */}
      <circle cx="18" cy="39" r="4" fill="#ff8fa3" opacity="0.3" />
      <circle cx="38" cy="38" r="4" fill="#ff8fa3" opacity="0.3" />

      {/* Zzz – bigger, funnier */}
      <g className="scat-zzz">
        <text x="46" y="20" fontSize="16" fill="#f5a623" fontWeight="900" opacity="0.8">Z</text>
        <text x="56" y="12" fontSize="12" fill="#f5a623" fontWeight="900" opacity="0.5">Z</text>
        <text x="63" y="6" fontSize="9" fill="#f5a623" fontWeight="900" opacity="0.3">z</text>
      </g>

      {/* drool bubble lol */}
      <circle cx="32" cy="44" r="2.5" fill="white" opacity="0.6" />
      <circle cx="33" cy="45" r="1.5" fill="white" opacity="0.4" />
    </svg>
  )
}

export function ScreenCat() {
  const [pos, setPos] = useState({ x: 100, y: window.innerHeight - CAT_SIZE - 20 })
  const [state, setState] = useState<CatState>("idle")
  const [flip, setFlip] = useState(false)
  const [quote, setQuote] = useState<string | null>(null)
  const animRef = useRef<number>(0)
  const targetRef = useRef({ x: pos.x, y: pos.y })
  const stateRef = useRef(state)

  stateRef.current = state

  // Movement loop
  useEffect(() => {
    let cancelled = false
    const speedRef = { current: 3 }

    const pickTarget = () => {
      const maxX = window.innerWidth - CAT_SIZE - 20
      const groundY = window.innerHeight - CAT_SIZE - 20
      targetRef.current = {
        x: Math.random() * maxX,
        y: groundY,
      }
      speedRef.current = 2 + Math.random() * 4
    }

    const loop = () => {
      if (cancelled) return

      if (stateRef.current !== "running") {
        animRef.current = requestAnimationFrame(loop)
        return
      }

      setPos((prev) => {
        const target = targetRef.current
        const dx = target.x - prev.x
        const speed = speedRef.current
        const dist = Math.abs(dx)

        if (dist < speed) {
          // Sometimes chain another run immediately
          if (Math.random() < 0.35) {
            pickTarget()
            return { x: prev.x, y: target.y }
          }
          setState("idle")
          return { x: target.x, y: target.y }
        }

        setFlip(dx < 0)
        // Add slight wobble
        const wobble = Math.sin(Date.now() / 120) * 0.8
        const nx = prev.x + (dx > 0 ? speed : -speed) + wobble
        return { x: nx, y: target.y }
      })

      animRef.current = requestAnimationFrame(loop)
    }

    // Schedule actions
    let sleepTimer: ReturnType<typeof setTimeout> | null = null

    const scheduleAction = () => {
      const delay = 1500 + Math.random() * 3500
      return setTimeout(() => {
        if (stateRef.current === "sleeping") {
          actionTimer = scheduleAction()
          return
        }

        const action = Math.random()
        if (action < 0.45) {
          // run to random position
          pickTarget()
          setState("running")
        } else if (action < 0.65) {
          // quick dart – short distance, fast
          const maxX = window.innerWidth - CAT_SIZE - 20
          const currentX = targetRef.current.x
          const offset = (Math.random() - 0.5) * 300
          targetRef.current = {
            x: Math.max(0, Math.min(maxX, currentX + offset)),
            y: window.innerHeight - CAT_SIZE - 20,
          }
          speedRef.current = 5 + Math.random() * 3
          setState("running")
        } else if (action < 0.8) {
          // jump
          setState("jumping")
          setTimeout(() => {
            if (stateRef.current === "jumping") setState("idle")
          }, 600)
        } else if (action < 0.9) {
          // double jump
          setState("jumping")
          setTimeout(() => setState("idle"), 400)
          setTimeout(() => setState("jumping"), 600)
          setTimeout(() => {
            if (stateRef.current === "jumping") setState("idle")
          }, 1000)
        } else {
          // go to sleep
          setState("sleeping")
          const sleepDuration = 8000 + Math.random() * 12000
          sleepTimer = setTimeout(() => {
            setState("idle")
          }, sleepDuration)
        }
        actionTimer = scheduleAction()
      }, delay)
    }

    let actionTimer = scheduleAction()
    animRef.current = requestAnimationFrame(loop)

    return () => {
      cancelled = true
      cancelAnimationFrame(animRef.current)
      clearTimeout(actionTimer)
      if (sleepTimer) clearTimeout(sleepTimer)
    }
  }, [])

  // Quote timer
  useEffect(() => {
    const scheduleQuote = () => {
      const delay = 5000 + Math.random() * 8000
      return setTimeout(() => {
        const q = CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)]
        setQuote(q)
        setTimeout(() => setQuote(null), 4000)
        quoteTimer = scheduleQuote()
      }, delay)
    }
    let quoteTimer = scheduleQuote()
    return () => clearTimeout(quoteTimer)
  }, [])

  const isJumping = state === "jumping"
  const isSleeping = state === "sleeping"

  const bodyClass = state === "running"
    ? "is-running"
    : isSleeping
      ? "is-sleeping"
      : "is-idle"

  return (
    <div
      className="screen-cat-container"
      style={{
        left: pos.x,
        top: isSleeping
          ? window.innerHeight - 80 - 20
          : pos.y,
        transform: isJumping ? "translateY(-50px)" : undefined,
        transition: isJumping ? "transform 0.3s ease-out" : "transform 0.3s ease-in",
      }}
    >
      {quote && !isSleeping && (
        <div className="screen-cat-bubble">
          {quote}
        </div>
      )}
      {isSleeping && (
        <div className="screen-cat-bubble">
          💤 Zzz...
        </div>
      )}
      <div className={`screen-cat-body ${bodyClass}`}>
        {state === "running"
          ? <RunningCatSVG flip={flip} />
          : isSleeping
            ? <SleepingCatSVG />
            : <IdleCatSVG />}
      </div>
    </div>
  )
}
