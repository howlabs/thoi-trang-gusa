import { useState, useEffect, useRef, useCallback } from "react"
import type { CatState } from "./cat/types"
import { ACTION_CONFIG } from "./cat/types"
import { CatAura, CatTail, CatPaws, CatOutfitLayer, CatBody, CatHead } from "./cat/CatParts"

const CAT_QUOTES = [
  // ── Sale & Chốt deal ──
  "Khách VIP đến kìa, pha trà hoa cúc vạn thọ nhanh! 🍵",
  "Hôm nay doanh thu chưa đạt 9 chữ số à? Kém. 💅",
  "Đơn này hơi bé, nhưng thôi tạm chấp nhận. 👑",
  "Khách quẹt thẻ đen thì cứ mạnh tay nâng chuẩn dịch vụ lên. 💳",
  "Đẳng cấp không nằm ở bộ vest, mà ở cách chốt deal nghìn đô. 🏆",
  "Bán hàng cốt ở cái tâm, nhưng tài khoản phải ở mức tỷ phú. 💵",
  "Hàng limited cả đấy, tư vấn cho khách bằng sự kiêu hãnh vào. ✨",
  "Thị trường đỏ rực cả rồi, đi chốt vài đơn an ủi ta xem. 📈",
  "Đừng giảm giá, hãy làm tăng giá trị cốt lõi của chúng ta lên. 🕍",
  "Kéo áo cho thẳng thớm, có khách sộp chuẩn bị vào kìa. 💰",
  "Khách hỏi giá mà lưỡi bạn đổ chuông à? Tập thuyết trình đi! 🔔",
  "Deal này chốt xong ta bao ăn Sushi Hokkaido, hết sức đi! 🍣",
  "Bán hàng mà ngại thì về nhà thêu thùa cho rồi. 🧵",
  "Khách chê giá cao? Đó là lúc bạn thể hiện bản lĩnh. 🎯",
  "Chốt xong đơn này ta đi nghỉ dưỡng ở Santorini nhé. 🇬🇷",
  "Sale giỏi không cần lời thoại, chỉ cần phong thái tự tin. 🗣️",

  // ── Sếp Mèo & Thượng lưu ──
  "Mèo chủ tịch không thích nhân viên lười biếng. 🥂",
  "Hãy chốt sale bằng phong thái của một CEO. 💎",
  "Làm việc đi, chiếc Rolls-Royce không tự nhiên mà có đâu. 🏎️",
  "Meow~ Từ nay hãy gọi Cát Tổng là Sếp Mèo. 🎩",
  "Trông cách làm việc chưa toát lên vẻ thượng lưu ngạo nghễ lắm. 🕴️",
  "Sáng nay dùng bữa ở Landmark 81 hơi mệt, bạn tự lo doanh số nhé. 🍾",
  "Chốt lẹ đi, lát mua cho Cát Tổng hộp Pate cá hồi Na Uy thượng hạng. 🥩",
  "Doanh số bèo bọt thế này mà đòi tiền thưởng đi Maldives sao? 🏖️",
  "Ta vừa ký xong lô biệt thự ven biển, bạn lại vừa trượt cái đơn 300 cành? 🏢",
  "Nỗ lực lên người trẻ, rồi bạn sẽ mua được cái đồng hồ Hublot như ta. ⌚",
  "Tổng thư ký mèo đã sẵn sàng, cần duyệt đơn nào hôm nay? 📋",
  "Cát Tổng vừa bay chuyến first-class về, cho ta 5 phút thư giãn. ✈️",
  "Người ta mua trải nghiệm, không mua sản phẩm. Nhớ nhé. 🎓",
  "Chiếc ghế CEO này ấm lắm, bạn có muốn ngồi thử không? 🪑",
  "Pate hôm nay vị hơi nhạt, bảo bếp làm lại cho Cát Tổng. 🍽️",
  "Mái vòm này có 8 phòng, mỗi phòng là một câu chuyện thành công. 🏛️",

  // ── Châm biếm & Hài hước ──
  "Bạn vừa gọi khách 'anh yêu' à? Lộ quá, thiếu chuyên nghiệp. 😏",
  "Mới 9h sáng đã ngáp rồi sao? Cát Tổng 5h đã họp board rồi đấy. 😤",
  "Lương tháng này hơi mỏng, hay là do bạn chốt không ra đơn? 🤔",
  "Nhìn bạn làm việc mà ta nhớ tới bản thân... 5 năm trước, chưa thành đạt. 📉",
  "Email này mà gửi cho đối tác thì ta nghỉ luôn, viết lại đi! 📧",
  "Pha trà mà để tràn ra ngoài là mời khách đi về đấy. 🫖",
  "Deadline tuần sau, mà bạn tuần này đã thở dài? Yếu. 💨",
  "Báo cáo tháng này đẹp thật đấy, nhưng Cát Tổng thích tiền mặt hơn. 🧾",
  "Khách chê thì bình tĩnh, đừng khóc. Khóc thì ra ngoài khóc. 😿",
  "Ai bảo nịnh sếp là dễ? Nịnh mà sếp biết thì mới là nghệ thuật. 🎭",
  "Cà phê của Cát Tổng là Blue Mountain Jamaica, bạn uống gì nhỉ? ☕",
  "Làm thêm giờ à? Không, gọi là đầu tư cho tương lai vĩ đại. 🌅",

  // ── Động viên kiểu tỷ phú ──
  "Thất bại hôm nay là bài học cho deal tỷ đô ngày mai. 💪",
  "Đừng sợ từ chối, hãy sợ bản thân không thử. 🚀",
  "Mỗi khách hàng là một cơ hội, đừng bỏ sót bất kỳ ai. 🌟",
  "Bạn giỏi hơn bạn nghĩ, chỉ cần tự tin hơn một chút. 🏅",
  "Thương trường là chiến trường, mà chiến trường thì cần chiến lược. ♟️",
  "Người thành công không chờ cơ hội, họ tạo ra nó. ⚡",
  "Kiên nhẫn là vàng, nhưng chốt nhanh là kim cương. 💎",
  "Hôm nay khó khăn, ngày mai sẽ dễ hơn... nếu bạn chốt được đơn. 😄",
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
        <CatHead emotion={emotion} hat={hat} outfit={outfit} />
      </g>
    </svg>
  )
}

export function ScreenCat() {
  const [state, setState] = useState<CatState>("idle")
  const [quote, setQuote] = useState<string | null>(null)
  const [showPurr, setShowPurr] = useState(false)
  const [jumpY, setJumpY] = useState(0)
  const [posY, setPosY] = useState(0)

  const MAX_UP = -300
  const clamp = (y: number) => Math.max(MAX_UP, Math.min(0, y))

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
    setJumpY(-40 - Math.random() * 20)
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
          setJumpY(-60 - Math.random() * 40)
          setCatState("jump")
          setTimeout(() => { if (sr.current === "jump") setCatState("idle") }, 800)
          dur = 0
        } else if (type === "fly") {
          setCatState("fly")
          setPosY(py => clamp(py - 80 - Math.random() * 120))
          actTm = setTimeout(() => {
            setPosY(0)
            setTimeout(() => { if (sr.current === "fly") setCatState("idle") }, 600)
          }, 3500 + Math.random() * 3000)
          dur = 0
        } else if (type === "walk" || type === "run") {
          setCatState(type)
          const dist = type === "run" ? 100 + Math.random() * 150 : 50 + Math.random() * 100
          setPosY(py => clamp(py + (Math.random() > 0.5 ? -1 : 1) * dist))
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
        transform: `translateY(${posY + (isJump ? jumpY : 0)}px)`,
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
