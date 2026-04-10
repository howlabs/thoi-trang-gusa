import { useState, useEffect, useRef, useCallback } from "react"
import type { CatState, Outfit, Hat } from "./cat/types"
import { ACTION_CONFIG } from "./cat/types"
import { CatAura, CatTail, CatPaws, CatOutfitLayer, CatBody, CatHead } from "./cat/CatParts"

const MAX_UP = -300

const SCREENCAT_FX_CSS = `
@keyframes scatFloatHeart { 0% { opacity: 0; transform: translate(0, 0) scale(0.3) rotate(0deg); } 20% { opacity: 1; transform: translate(-15px, -40px) scale(1.3) rotate(-20deg); filter: hue-rotate(10deg); } 60% { opacity: 0.9; transform: translate(20px, -80px) scale(1.1) rotate(15deg); } 100% { opacity: 0; transform: translate(0, -130px) scale(0.8) rotate(0deg); filter: blur(2px); } }
@keyframes scatFloatStar { 0% { opacity: 0; transform: translate(0, 0) scale(0) rotate(0deg); } 30% { opacity: 1; transform: translate(15px, -30px) scale(1.5) rotate(45deg); filter: drop-shadow(0 0 5px gold); } 100% { opacity: 0; transform: translate(-10px, -90px) scale(0.5) rotate(180deg); } }
.scat-floating-heart { position: absolute; font-size: 28px; animation: scatFloatHeart 2.5s cubic-bezier(0.2, 0.8, 0.4, 1) forwards; pointer-events: none; z-index: 100; top: 10px; left: 45px; filter: drop-shadow(0 0 8px rgba(255,105,180,0.6)); }
.scat-h2 { animation: scatFloatStar 2.2s ease-out forwards; animation-delay: 0.2s; left: 75px; top: 25px; font-size: 22px; }
.scat-h3 { animation-delay: 0.4s; left: 30px; top: 5px; font-size: 26px; }
.scat-h4 { animation: scatFloatStar 2.4s ease-out forwards; animation-delay: 0.7s; left: 65px; top: 15px; font-size: 20px; }
.scat-h5 { animation-delay: 0.9s; left: 50px; top: -10px; font-size: 24px; filter: drop-shadow(0 0 10px rgba(255,215,0,0.8)); }

/* Custom Action Props */
.scat-prop { position: absolute; pointer-events: none; z-index: 50; }

/* Cook prop: Pan flipping */
@keyframes propPan { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(-20deg); } }
@keyframes propFood { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-30px) rotate(180deg); } }
.scat-pan { font-size: 30px; top: 60px; left: 10px; animation: propPan 0.6s cubic-bezier(0.2, 0.8, 0.4, 1) infinite; }
.scat-food { font-size: 20px; top: 60px; left: 15px; animation: propFood 0.6s cubic-bezier(0.2, 0.8, 0.4, 1) infinite; }

/* Work prop: Laptop */
@keyframes propTyping { 0% { transform: translateY(0); } 100% { transform: translateY(-2px); } }
.scat-laptop { font-size: 35px; top: 75px; left: 30px; animation: propTyping 0.15s linear infinite alternate; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.4)); }

/* Eat prop: Fish eating */
@keyframes propEat { 0% { transform: translate(-30px, 10px) rotate(-45deg); opacity: 1; } 100% { transform: translate(10px, -20px) rotate(10deg) scale(0.5); opacity: 0; } }
.scat-eat-food { font-size: 24px; top: 50px; left: 40px; animation: propEat 1s ease-in forwards infinite; }

/* Magic prop: Wand */
@keyframes propWand { 0% { transform: rotate(-20deg) scale(0.9); } 100% { transform: rotate(20deg) scale(1.1); filter: drop-shadow(0 0 15px white); } }
.scat-wand { font-size: 30px; top: 40px; left: -5px; animation: propWand 0.8s ease-in-out infinite alternate; }

/* Attack prop: Sword thrust */
@keyframes propSword { 0% { transform: translateX(20px) rotate(45deg); } 20% { transform: translateX(30px) rotate(60deg); } 50% { transform: translateX(-50px) rotate(-20deg) scale(1.2); } 100% { transform: translateX(20px) rotate(45deg); } }
.scat-sword { font-size: 40px; top: 45px; left: 0px; animation: propSword 0.4s cubic-bezier(0.2, 0.8, 0.4, 1) forwards; }

/* Heal prop: Green Plus */
@keyframes propHeal { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 50% { opacity: 1; transform: translateY(-30px) scale(1.5); } 100% { transform: translateY(-60px) scale(1); opacity: 0; } }
.scat-heal-plus { font-size: 25px; top: 30px; left: 50px; animation: propHeal 1.5s ease-out infinite; filter: drop-shadow(0 0 5px #32cd32); }

/* Celebrate prop: Confetti */
@keyframes propConfetti { 0% { transform: translateY(0) scale(0); opacity: 1; } 50% { transform: translateY(-40px) scale(1.5); opacity: 1; } 100% { transform: translateY(-20px) scale(1); opacity: 0; } }
.scat-confetti { font-size: 35px; top: 10px; left: 40px; animation: propConfetti 0.6s ease-out infinite; }

/* Rule prop: Crown/Money */
@keyframes propMoney { 0% { transform: translateY(-50px) rotate(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(50px) rotate(180deg); opacity: 0; } }
.scat-money { font-size: 20px; animation: propMoney 2s linear infinite; }
.scat-m1 { top: 0px; left: 10px; animation-delay: 0.1s; }
.scat-m2 { top: -20px; left: 90px; animation-delay: 0.5s; }
.scat-m3 { top: 10px; left: 110px; animation-delay: 1s; }

/* Dance prop: Music notes */
@keyframes propMusic { 0% { transform: translateY(0) scale(0.5) rotate(-10deg); opacity: 0; } 50% { opacity: 1; transform: translateY(-20px) scale(1.2) rotate(10deg); } 100% { transform: translateY(-40px) scale(1) rotate(-10deg); opacity: 0; } }
.scat-music { font-size: 20px; animation: propMusic 1.5s linear infinite; filter: drop-shadow(0 0 5px #ff69b4); }
.scat-mu1 { top: 30px; left: 10px; animation-delay: 0.2s; }
.scat-mu2 { top: 10px; left: 90px; animation-delay: 0.8s; }

/* Laugh prop: Haha */
@keyframes propLaugh { 0% { transform: translate(0,0) scale(0.5); opacity: 0; } 50% { transform: translate(15px,-15px) scale(1.2); opacity: 1; } 100% { transform: translate(30px,-30px) scale(1); opacity: 0; } }
.scat-laugh-text { font-size: 22px; top: 10px; left: 70px; animation: propLaugh 1s ease-out infinite; font-weight: bold; color: #FFD700; text-shadow: 1px 1px 0 #000; }
`;

let purrAudio: HTMLAudioElement | null = null;
let purrFadeInterval: ReturnType<typeof setInterval> | null = null;

function playPurrSound() {
  try {
    if (!purrAudio) {
      purrAudio = new Audio('https://upload.wikimedia.org/wikipedia/commons/c/c8/Cat_purring.ogg');
      purrAudio.loop = true;
    }
    if (purrFadeInterval) clearInterval(purrFadeInterval);
    
    purrAudio.volume = 0.8;
    
    if (purrAudio.paused) {
      // Nhảy thời gian ngẫu nhiên để không bị lặp lại đoạn mở đầu
      purrAudio.currentTime = Math.random() * 4;
      // Linh hoạt tốc độ gáy rừ rừ (thở nhanh/chậm)
      purrAudio.playbackRate = 0.9 + Math.random() * 0.2;
      purrAudio.play().catch(e => console.error("Purr audio play error:", e));
    }
  } catch (e) {
    console.error("Purr err", e);
  }
}

function stopPurrSound() {
  if (purrFadeInterval) clearInterval(purrFadeInterval);
  if (!purrAudio) return;
  purrFadeInterval = setInterval(() => {
    if (purrAudio && purrAudio.volume > 0.05) {
      purrAudio.volume -= 0.05;
    } else {
      if (purrFadeInterval) clearInterval(purrFadeInterval);
      if (purrAudio) purrAudio.pause();
    }
  }, 40);
}

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

  // ── Đa vũ trụ & Nghề nghiệp ──
  "Hôm nay ta làm Chef Mèo, chuẩn bị dọn Beefsteak ra đây! 🥩",
  "Phew... vừa khám xong cho mấy ca. Sếp Cát kiêm luôn bác sĩ xịn. 🩺",
  "Quỳ xuống! Cát Đại Đế đang ngự giá! 👑",
  "Alo trạm vũ trụ? Cát Phi Hành Gia đã hạ cánh an toàn! 🚀",
  "Úm ba la xì bùa, biến đống bug này thành feature! 🪄",
  "Vũ trụ bao la, nhưng pate thì chỉ có một. 🌌",
  "Khám bao nhiêu bệnh, bệnh 'lười' của bạn là y học bó tay. 💊",
  "Nấu ăn là nghệ thuật, còn Cát Tổng là người thưởng thức ưu tú. 🧑‍🍳",

  // ── Wibu & Anime (Mới) ──
  "Bành Trướng Lãnh Địa: Vô Lượng Tiền Tỷ! 🤞",
  "Ta chính là Gojo Meowtoru, kẻ mạnh nhất thế giới chú thuật... à nhầm, thế giới Pate! 😎",
  "Thế giới này thật tàn nhẫn, nhưng Pate thì rất ngon. Sasageyo! ⚔️",
  "Ta sẽ trở thành Vua Hải Tặc... à nhầm, Vua Mèo! 🍖",
  "Bankai! Thiên Tỏa Trảm Nguyệt! Ủa lộn, Thiên Tỏa Trảm Bug! 🗡️",
  "Dattebayo! Sức mạnh của ta là không bao giờ bỏ cuộc... khi xin ăn. 🍜",
  "Tổ chức Akatsuki Mèo cần thêm kinh phí, bạn chốt đơn nhanh lên! ☁️",
  "Chỉ với 1% sức mạnh, ta có thể clear hết đống công việc này. ⚡",
  "Đôi mắt Sharingan của ta nhìn thấu mọi lời hứa lèo của deadline. 👁️",
  "Đứng lên đi Takemichi! À quên, đứng lên đi bạn nhân viên quèn! 🏍️",

  // ── IDE / Developer / Coder (Mới) ──
  "Lại console.log nữa à? Dùng Debugger đi cái đồ nghiệp dư! 🐛",
  "Code chạy được là do tổ tiên phù hộ, không phải do logic của bạn đâu. 🖥️",
  "Bug này không phải là lỗi, nó là một feature lấp lánh nghệ thuật! 🪄",
  "Copy từ StackOverflow mà quên đổi tên biến à? Ta thấy hết nhé! 👀",
  "Nghĩ ra rồi! À mà thôi quên mất cách code logic đó rồi... 🧠",
  "Xin đừng nén file bừa bãi nữa, nhánh Git này sắp thành đống rác rồi! 🌿",
  "Bảo 'chạy ngon trên máy local' thì lên production cũng vô dụng thôi! ☁️",
  "Pull request 2000 dòng? Ta reject thẳng tay nhé. 🛑",
  "CSS mà chưa flex hay grid được thì đừng hòng làm Cát Tổng thoả mãn. 📦",
  "Dùng any везде... bạn định biến Typescript thành Javascript à? 🗑️",

  // ── Gen Z / Memes / Sassy (Mới) ──
  "Keo lỳ tái châu! Chốt deal dính cứng ngắc luôn! 💅",
  "Làm việc kiểu gì mà xịt keo cứng ngắc vậy bé? 🧊",
  "Chê nha! Chức năng này quá là chê luôn á. 👁️👄👁️",
  "Flexing sương sương cái bug ngàn năm không fix được nào! ✨",
  "Ét o ét, deadline hối quá kìa, giải cứu Cát Tổng! 🆘",
  "Thôi mắc cỡ quá, giấu giùm cái dòng mã xấu xí đó đi. 🫣",
  "Giao diện này đúng chuẩn hệ tư tưởng CEO, mãi mận mãi mận! 🌸",
  "Đừng cọc, cọc là mau già đó. Bình tĩnh nựng ta miếng đi nè. 🍵",
  "Bạn nghĩ bạn làm thế là slay? Không, ta mới là chúa tể Slay. 👑",
  "Ủa alo? Server sập kìa, vô fix đi chứ nhìn ta làm gì? 📞",
]

const SIZE = 120

const OUTFITS: Outfit[] = ["cape", "suit", "ninja", "onepiece", "naruto", "saiyan", "astronaut", "chef", "doctor", "king", "wizardrobe", "akatsuki", "scout", "jujutsu", "gear5"]
const OUTFIT_TO_HAT: Record<Outfit, Hat> = {
  cape: "crown", suit: "tophat", ninja: "none", 
  onepiece: "strawhat", naruto: "leafband", saiyan: "saiyanhair", 
  astronaut: "helmet", chef: "chefhat", doctor: "headmirror", king: "crown", 
  wizardrobe: "wizard", akatsuki: "rogueband", scout: "scoutcape", jujutsu: "blindfold", gear5: "gear5hair"
}

function CatSvg({ state, forcedOutfit }: { state: CatState, forcedOutfit: Outfit | null }) {
  const isJump = state === "jump"
  const config = ACTION_CONFIG[state] || ACTION_CONFIG.idle;
  
  const outfit = forcedOutfit || config.outfit;
  const hat = forcedOutfit ? OUTFIT_TO_HAT[forcedOutfit] : config.hat;

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 128 128" className={`ceo-cat ceo-cat-${state}`}>
      <CatAura />
      <g className={`ceo-cat-body-wrapper ${isJump ? 'anime-jump' : ''}`}>
        <CatTail isJump={isJump} outfit={outfit} />
        <CatPaws outfit={outfit} />
        <CatOutfitLayer outfit={outfit} />
        <CatBody outfit={outfit} />
        <CatHead emotion={config.emotion} hat={hat} outfit={outfit} />
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
  const [forcedOutfit, setForcedOutfit] = useState<Outfit | null>(null)
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null)

  useEffect(() => {
    const clickAway = () => setMenuPos(null)
    window.addEventListener("click", clickAway)
    return () => window.removeEventListener("click", clickAway)
  }, [])

  const clamp = useCallback((y: number) => Math.max(MAX_UP, Math.min(0, y)), [])

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

  // ── Click → Cycle interesting states + quote ──
  const clickIndex = useRef(0)

  const handleClick = useCallback(() => {
    setQuote(CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)])
    setTimeout(() => setQuote(null), 5000)

    const clickActs: CatState[] = ["heart", "cook", "heal", "space", "rule", "magic", "jump"]
    const type = clickActs[clickIndex.current % clickActs.length]
    clickIndex.current += 1

    setShowPurr(false)
    stopPurrSound()
    setCatState(type)

    if (type === "jump") {
      setJumpY(-40 - Math.random() * 20)
      setTimeout(() => { if (sr.current === type) setCatState("idle") }, 800)
    } else if (type === "space" || type === "magic") {
      setPosY(py => clamp(py - 80 - Math.random() * 40))
      setTimeout(() => {
        setPosY(0)
        setTimeout(() => { if (sr.current === type) setCatState("idle") }, 600)
      }, 2500)
    } else if (type === "heart") {
      setTimeout(() => { if (sr.current === type) setCatState("idle") }, 3000)
    } else {
      setTimeout(() => { if (sr.current === type) setCatState("idle") }, 3500)
    }
  }, [setCatState, clamp])

  // ── Petting (Hover, MouseMove, MouseDown) ──
  const petCount = useRef(0)
  const petResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startPetting = useCallback(() => {
    if (sr.current === "idle" || sr.current === "sleep" || sr.current === "pet") {
      if (sr.current !== "pet") {
        setCatState("pet")
        setShowPurr(true)
      }
      playPurrSound()
    }
  }, [setCatState])

  const stopPetting = useCallback(() => {
    if (sr.current === "pet") {
      setCatState("idle")
      setShowPurr(false)
    }
    stopPurrSound()
  }, [setCatState])

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(() => {
      startPetting()
    }, 500)
  }, [startPetting])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    stopPetting()
    petCount.current = 0
  }, [stopPetting])

  const handleMouseMove = useCallback(() => {
    petCount.current += 1
    if (petResetTimer.current) clearTimeout(petResetTimer.current)
    
    if (petCount.current > 3) {
      startPetting()
      petCount.current = 0
    }

    petResetTimer.current = setTimeout(() => {
      petCount.current = 0
    }, 200)
  }, [startPetting])

  const handleMouseDown = useCallback(() => {
    startPetting()
  }, [startPetting])

  // ── Idle AI ──
  useEffect(() => {
    let actTm: ReturnType<typeof setTimeout> | null = null
    const LOCKED = new Set<CatState>([
      "sleep", "groom", "stretch", "look", "scratch", "lay", "whine", "fly", "walk", "run",
      "dance", "eat", "hide", "attack", "celebrate", "work", "laugh",
      "cook", "heal", "rule", "space", "magic", "heart", "pet"
    ])

    const sched = (): ReturnType<typeof setTimeout> => {
      return setTimeout(() => {
        if (LOCKED.has(sr.current)) { timer = sched(); return }

        const r = Math.random()
        const acts: { p: number, s: CatState }[] = [
          { p: 0.04, s: "jump" },
          { p: 0.08, s: "magic" },
          { p: 0.12, s: "rule" },
          { p: 0.16, s: "lay" },
          { p: 0.20, s: "space" },
          { p: 0.24, s: "heal" },
          { p: 0.28, s: "whine" },
          { p: 0.32, s: "cook" },
          { p: 0.36, s: "fly" },
          { p: 0.40, s: "walk" },
          { p: 0.44, s: "run" },
          { p: 0.48, s: "groom" },
          { p: 0.52, s: "scratch" },
          { p: 0.56, s: "dance" },
          { p: 0.60, s: "eat" },
          { p: 0.64, s: "hide" },
          { p: 0.68, s: "attack" },
          { p: 0.72, s: "celebrate" },
          { p: 0.76, s: "work" },
          { p: 0.80, s: "laugh" },
          { p: 0.84, s: "stretch" },
          { p: 0.88, s: "look" },
          { p: 1.00, s: "sleep" }
        ];

        const type = acts.find(a => r < a.p)?.s || "sleep";
        
        let dur = 3000;
        
        if (type === "jump") {
          setJumpY(-60 - Math.random() * 40)
          setCatState("jump")
          setTimeout(() => { if (sr.current === "jump") setCatState("idle") }, 800)
          dur = 0
        } else if (type === "fly" || type === "space" || type === "magic") {
          setCatState(type)
          setPosY(py => clamp(py - (type === "space" ? 100 : 80) - Math.random() * 120))
          actTm = setTimeout(() => {
            setPosY(0)
            setTimeout(() => { if (sr.current === type) setCatState("idle") }, 600)
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
        } else if (type === "cook" || type === "heal" || type === "rule") {
          dur = 3500 + Math.random() * 2500
        } else {
          dur = 2500 + Math.random() * 2500
        }

        if (dur > 0 && type !== "jump" && type !== "fly" && type !== "space" && type !== "magic") {
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
  }, [setCatState, clamp])

  // ── Quote timer ──
  useEffect(() => {
    const go = (): ReturnType<typeof setTimeout> =>
      setTimeout(() => {
        setQuote(CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)])
        setTimeout(() => setQuote(null), 7000)
        tm = go()
      }, 12000 + Math.random() * 10000)
    let tm = go()
    return () => clearTimeout(tm)
  }, [])

  const isJump = state === "jump"
  const isSleep = state === "sleep"

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: SCREENCAT_FX_CSS }} />

    {menuPos && (
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: Math.min(menuPos.y, window.innerHeight - 300),
          left: Math.min(menuPos.x, window.innerWidth - 260),
          zIndex: 99999,
          background: "rgba(20, 20, 25, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          width: "260px"
        }}
      >
        <div style={{ color: "#FFD700", fontWeight: "bold", textAlign: "center", borderBottom: "1px solid #444", paddingBottom: "5px", fontSize: "14px" }}>Chọn Trang Phục</div>
        <button 
          style={{ background: forcedOutfit === null ? "rgba(255,215,0,0.2)" : "transparent", color: forcedOutfit === null ? "#FFD700" : "#FFF", border: "1px solid #FFD700", padding: "6px", borderRadius: "4px", cursor: "pointer", textAlign: "center", fontWeight: "bold" }} 
          onClick={() => { setForcedOutfit(null); setMenuPos(null); }}
        >✨ Tự động (AI)</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
          {OUTFITS.map(o => (
            <button 
              key={o} 
              style={{ background: forcedOutfit === o ? "#FF4500" : "rgba(255,255,255,0.05)", color: forcedOutfit === o ? "#FFF" : "#DDD", border: "none", padding: "5px", borderRadius: "4px", cursor: "pointer", textAlign: "left", textTransform: "capitalize", fontSize: "13px" }}
              onClick={() => { setForcedOutfit(o); setMenuPos(null); }}
            >
              🎭 {o}
            </button>
          ))}
        </div>
      </div>
    )}

    <div
      className="screen-cat-container"
      style={{
        transform: `translateY(${posY + (isJump ? jumpY : 0)}px)`,
        transition: state === "run" || state === "walk"
          ? `transform ${state === "run" ? "1.5s" : "3s"} ease-in-out`
          : state === "fly" || state === "space" || state === "magic"
          ? "transform 2s cubic-bezier(0.2, 0.8, 0.4, 1)"
          : isJump
          ? "transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)" /* slow at top */
          : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",  /* gravity accelerate / normal return */
      }}
    >
      {quote && !isSleep && <div className="screen-cat-bubble">{quote}</div>}
      {isSleep && <div className="screen-cat-bubble">💤 Zzz...</div>}

      <div 
        className="screen-cat-body" 
        onClick={handleClick} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuPos({ x: e.clientX, y: e.clientY });
        }}
      >
        {showPurr && <span className="scat-purr">purr~</span>}
        
        {state === "heart" && (
          <div className="scat-hearts-container">
            <div className="scat-floating-heart">💖</div>
            <div className="scat-floating-heart scat-h2">✨</div>
            <div className="scat-floating-heart scat-h3">💘</div>
            <div className="scat-floating-heart scat-h4">⭐</div>
            <div className="scat-floating-heart scat-h5">😻</div>
          </div>
        )}

        {/* --- DYNAMIC PROPS FOR SPECIFIC ACTIONS --- */}
        {state === "cook" && (
          <>
            <div className="scat-prop scat-pan">🍳</div>
            <div className="scat-prop scat-food">🥞</div>
          </>
        )}
        {state === "work" && <div className="scat-prop scat-laptop">💻</div>}
        {state === "eat" && <div className="scat-prop scat-eat-food">🍣</div>}
        {state === "magic" && <div className="scat-prop scat-wand">🪄</div>}
        {state === "attack" && <div className="scat-prop scat-sword">🗡️</div>}
        {state === "heal" && <div className="scat-prop scat-heal-plus">➕</div>}
        {state === "celebrate" && <div className="scat-prop scat-confetti">🎉</div>}
        {state === "laugh" && <div className="scat-prop scat-laugh-text">😆</div>}
        {state === "dance" && (
          <>
            <div className="scat-prop scat-music scat-mu1">🎵</div>
            <div className="scat-prop scat-music scat-mu2">🎶</div>
          </>
        )}
        {state === "rule" && (
          <>
            <div className="scat-prop scat-money scat-m1">💸</div>
            <div className="scat-prop scat-money scat-m2">💎</div>
            <div className="scat-prop scat-money scat-m3">👑</div>
          </>
        )}

        <CatSvg state={state} forcedOutfit={forcedOutfit} />
      </div>
    </div>
    </>
  )
}
