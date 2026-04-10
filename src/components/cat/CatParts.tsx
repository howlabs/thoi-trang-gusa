import type { Emotion, Outfit, Hat } from "./types"

export const CatAura = () => (
  <>
    <defs>
      <radialGradient id="animeAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
        <stop offset="60%" stopColor="#FFA500" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="64" cy="90" r="45" fill="url(#animeAura)" className="ceo-aura" />
    <ellipse cx="64" cy="115" rx="35" ry="8" fill="#000" opacity="0.3" className="ceo-shadow" />
  </>
)

export const CatTail = ({ isJump, outfit }: { isJump: boolean, outfit: Outfit }) => (
  <path className={`ceo-tail ${isJump ? 'tail-jump' : ''}`} d="M 80 100 Q 130 110, 115 65 Q 110 45, 95 50 Q 80 55, 95 75 Q 105 85, 80 100" fill={outfit === "gear5" ? "#F8F8FF" : "#171821"} />
)

export const CatPaws = ({ outfit }: { outfit: Outfit }) => (
  <>
    {/* Base back legs */}
    <path className="ceo-leg-l" d="M 40 85 C 30 85, 25 105, 30 115 C 35 120, 50 120, 50 115 Z" fill={outfit === "gear5" ? "#EEEEEE" : "#0E0F14"} />
    <path className="ceo-leg-r" d="M 80 85 C 100 85, 105 105, 95 115 C 90 120, 75 120, 75 115 Z" fill={outfit === "gear5" ? "#EEEEEE" : "#0E0F14"} />
    
    {/* Scratch Paw (Hidden normally) */}
    <g className="ceo-scratch-paw" opacity="0">
      <path d="M 90 85 C 110 65, 115 45, 95 35 C 85 30, 75 40, 80 45 Z" fill="#171821" />
      <circle cx="95" cy="45" r="3" fill="#FF9999" />
      <circle cx="90" cy="40" r="2.5" fill="#FF9999" />
      <circle cx="85" cy="45" r="2" fill="#FF9999" />
      <circle cx="90" cy="50" r="2" fill="#FF9999" />
    </g>

    {/* Front paws resting elegantly */}
    <g className="ceo-front-paws">
      <path className="ceo-paw-l" d="M 48 100 L 48 118 C 48 122, 58 122, 58 118 L 56 100 Z" fill={outfit === "gear5" ? "#F8F8FF" : "#0E0F14"} />
      {/* Toe lines for left paw */}
      <line x1="51" y1="115" x2="51" y2="120" stroke={outfit === "gear5" ? "#CCC" : "#333"} strokeWidth="1" strokeLinecap="round" />
      <line x1="55" y1="115" x2="55" y2="120" stroke={outfit === "gear5" ? "#CCC" : "#333"} strokeWidth="1" strokeLinecap="round" />

      <path className="ceo-paw-r" d="M 72 100 L 70 118 C 70 122, 80 122, 80 118 L 80 100 Z" fill={outfit === "gear5" ? "#F8F8FF" : "#0E0F14"} />
      {/* Toe lines for right paw */}
      <line x1="73" y1="115" x2="73" y2="120" stroke={outfit === "gear5" ? "#CCC" : "#333"} strokeWidth="1" strokeLinecap="round" />
      <line x1="77" y1="115" x2="77" y2="120" stroke={outfit === "gear5" ? "#CCC" : "#333"} strokeWidth="1" strokeLinecap="round" />
    </g>
  </>
)

export const CatOutfitLayer = ({ outfit }: { outfit: Outfit }) => {
  if (outfit === "suit") {
    return (
      <g className="ceo-suit">
        <path d="M 46 55 C 46 70, 82 70, 82 55 Z" fill="#FFFFFF" />
        <polygon points="64,60 67,80 64,90 61,80" fill="#8B0000" />
        <path d="M 40 60 C 20 90, 30 115, 35 115 C 45 115, 60 90, 64 65 C 64 65, 46 65, 40 60 Z" fill="#0E0F14" />
        <path d="M 88 60 C 108 90, 98 115, 93 115 C 83 115, 68 90, 64 65 C 64 65, 82 65, 88 60 Z" fill="#0E0F14" />
      </g>
    )
  }
  if (outfit === "ninja") {
    return (
      <g className="ceo-ninja">
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#1A1A1A" />
        <path d="M 46 55 L 82 55 L 75 75 L 53 75 Z" fill="#2C2C2C" />
        <path d="M 48 65 L 80 65" stroke="#8B0000" strokeWidth="3" />
      </g>
    )
  }
  if (outfit === "sweater") {
    return (
      <g className="ceo-sweater">
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#FFB6C1" />
        <path d="M 38 105 C 35 115, 64 115, 90 105 Z" fill="#FF69B4" opacity="0.6" />
        <line x1="45" y1="65" x2="83" y2="65" stroke="#FF69B4" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="42" y1="80" x2="86" y2="80" stroke="#FF69B4" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="40" y1="95" x2="88" y2="95" stroke="#FF69B4" strokeWidth="2" strokeDasharray="4 2" />
      </g>
    )
  }
  if (outfit === "beach") {
    return (
      <g className="ceo-beach">
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#87CEEB" />
        <path d="M 48 65 L 53 60 L 58 65 L 63 60 L 68 65 L 73 60 L 80 67" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M 45 85 L 50 80 L 55 85 L 60 80 L 65 85 L 70 80 L 83 93" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="64" cy="74" r="7" fill="#FFD700" />
      </g>
    )
  }
  // ── One Piece: Luffy - áo vest đỏ mở ngực + quần xanh + sẹo X ──
  if (outfit === "onepiece") {
    return (
      <g className="ceo-onepiece">
        {/* Quần short xanh đậm (phần dưới) */}
        <path d="M 38 95 C 33 110, 38 118, 64 118 C 90 118, 95 110, 90 95 Z" fill="#1A3A6B" />
        {/* Bên trong quần */}
        <path d="M 42 98 C 40 110, 48 118, 64 118 C 80 118, 88 110, 86 98 Z" fill="#15305A" />

        {/* Áo vest đỏ mở ngực (phần trên) */}
        <path d="M 38 55 C 30 75, 34 95, 38 100 L 90 100 C 94 95, 98 75, 90 55 Z" fill="#CC1A1A" />
        {/* Cấu trúc vest mở - mép vest trái */}
        <path d="M 46 55 C 42 75, 44 90, 46 100 L 58 100 L 58 60 C 58 57, 52 56, 46 55 Z" fill="#E02020" />
        {/* Mép vest phải */}
        <path d="M 82 55 C 86 75, 84 90, 82 100 L 70 100 L 70 60 C 70 57, 76 56, 82 55 Z" fill="#E02020" />
        {/* Phần ngực trống giữa */}
        <path d="M 58 60 L 58 100 L 70 100 L 70 60 C 70 58, 64 56, 58 60 Z" fill="#1A1A1A" opacity="0.15" />
        {/* Viền vest kim loại */}
        <path d="M 46 55 C 42 75, 44 95, 46 100" stroke="#FFD700" strokeWidth="1.5" fill="none" />
        <path d="M 82 55 C 86 75, 84 95, 82 100" stroke="#FFD700" strokeWidth="1.5" fill="none" />
        {/* Nút vest */}
        <circle cx="52" cy="72" r="2" fill="#FFD700" />
        <circle cx="52" cy="85" r="2" fill="#FFD700" />
        {/* Sẹo X khổng lồ dưới ngực (to và rõ răng cưa hơn) */}
        <path d="M 52 66 L 76 88 M 76 66 L 52 88" stroke="#B22222" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 58 68 L 62 74 M 64 80 L 68 86 M 54 82 L 60 84 M 68 70 L 72 74" stroke="#B22222" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Đai lưng (Sash) màu vàng đặc trưng cuộn dày ở eo */}
        <path d="M 38 95 Q 64 100, 90 95" fill="none" stroke="#FFD700" strokeWidth="8" />
        <path d="M 40 95 Q 64 98, 88 95" fill="none" stroke="#FFA500" strokeWidth="2" opacity="0.5" />
        {/* Mối thắt đai rủ xuống */}
        <path d="M 44 95 Q 38 110, 42 120" fill="none" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" />
        <path d="M 48 95 Q 46 110, 50 120" fill="none" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" />
        {/* Dép sandals */}
        <ellipse cx="44" cy="118" rx="10" ry="3" fill="#8B4513" />
        <ellipse cx="84" cy="118" rx="10" ry="3" fill="#8B4513" />
        <path d="M 38 115 L 44 110 L 50 115" stroke="#8B4513" strokeWidth="2" fill="none" />
        <path d="M 78 115 L 84 110 L 90 115" stroke="#8B4513" strokeWidth="2" fill="none" />
      </g>
    )
  }
  // ── Naruto: áo jumpsuit cam + đen cổ cao + whirlpool + ninja pouch ──
  if (outfit === "naruto") {
    return (
      <g className="ceo-naruto">
        {/* Áo jumpsuit cam */}
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#FF8C00" />
        {/* Phần đen ở vai + ngực trên */}
        <path d="M 38 55 L 46 55 L 56 62 L 64 57 L 72 62 L 82 55 L 90 55 L 86 72 L 64 78 L 42 72 Z" fill="#1A1A1A" />
        {/* Zipper dọc giữa */}
        <line x1="64" y1="78" x2="64" y2="115" stroke="#555" strokeWidth="1.5" />
        {/* Đường zipper răng kéo */}
        <g stroke="#666" strokeWidth="0.5">
          <line x1="63" y1="80" x2="65" y2="80" />
          <line x1="63" y1="84" x2="65" y2="84" />
          <line x1="63" y1="88" x2="65" y2="88" />
          <line x1="63" y1="92" x2="65" y2="92" />
          <line x1="63" y1="96" x2="65" y2="96" />
          <line x1="63" y1="100" x2="65" y2="100" />
          <line x1="63" y1="104" x2="65" y2="104" />
        </g>
        {/* Biểu tượng Uzumaki xoắn (con zun) trên lưng */}
        <g transform="translate(64, 88)">
          <circle r="10" fill="none" stroke="#E04000" strokeWidth="1.5" />
          <circle r="7" fill="none" stroke="#E04000" strokeWidth="1" />
          <path d="M 0 -10 C 5 -5, 5 5, 0 10 C -5 5, -5 -5, 0 -10" fill="#E04000" opacity="0.5" />
          <circle r="3" fill="#E04000" opacity="0.4" />
        </g>
        {/* Ninja pouch đeo sau hông phải */}
        <rect x="82" y="78" width="10" height="14" rx="2" fill="#5C4033" stroke="#3E2723" strokeWidth="0.8" />
        <line x1="84" y1="83" x2="90" y2="83" stroke="#3E2723" strokeWidth="0.5" />
        <line x1="84" y1="87" x2="90" y2="87" stroke="#3E2723" strokeWidth="0.5" />
        {/* Băng quấn chân */}
        <rect x="32" y="100" width="14" height="5" rx="1" fill="#F5F5DC" opacity="0.8" />
        <rect x="82" y="100" width="14" height="5" rx="1" fill="#F5F5DC" opacity="0.8" />
        {/* Giày ninja đen */}
        <path d="M 32 105 L 32 115 C 32 118, 46 118, 46 115 L 46 105 Z" fill="#1A1A1A" />
        <path d="M 82 105 L 82 115 C 82 118, 96 118, 96 115 L 96 105 Z" fill="#1A1A1A" />
      </g>
    )
  }
  // ── Super Saiyan Goku: gi cam + áo lót xanh + đai lưng + wristband + kanji ──
  if (outfit === "saiyan") {
    return (
      <g className="ceo-saiyan">
        {/* Áo gi cam (tất cả) */}
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#FF6B00" />
        {/* Áo lót xanh dương bên trong, lộ ở cổ */}
        <path d="M 50 55 L 58 62 L 64 58 L 70 62 L 78 55 L 76 60 L 64 68 L 52 60 Z" fill="#1E3A6B" />
        {/* Cổ áo lót xanh cao */}
        <path d="M 50 54 L 56 52 L 64 54 L 72 52 L 78 54 L 76 58 L 64 56 L 52 58 Z" fill="#234E80" />
        {/* Đai lưng (obi) xanh dương */}
        <rect x="38" y="86" width="52" height="8" rx="2" fill="#1E3A6B" />
        {/* Nút thắt đai */}
        <circle cx="64" cy="90" r="5" fill="#2B5090" stroke="#1E3A6B" strokeWidth="1.5" />
        <line x1="62" y1="88" x2="66" y2="92" stroke="#FFD700" strokeWidth="1" />
        {/* Wristbands xanh */}
        <rect x="34" y="82" width="8" height="6" rx="2" fill="#1E3A6B" />
        <rect x="86" y="82" width="8" height="6" rx="2" fill="#1E3A6B" />
        {/* Chữ kanji "悟" (Go) của Goku trên ngực */}
        <text x="64" y="78" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold" fontFamily="serif">悟</text>
        {/* Nếp gấp gi dưới đai */}
        <path d="M 42 96 Q 52 94, 64 96 Q 76 98, 86 96" fill="none" stroke="#CC5500" strokeWidth="0.8" />
        {/* Giày chiến đấu */}
        <path d="M 32 108 L 32 118 C 32 120, 46 120, 46 118 L 46 108 Z" fill="#1E3A6B" />
        <path d="M 32 108 L 39 108 L 46 108" stroke="#234E80" strokeWidth="1.5" />
        <path d="M 82 108 L 82 118 C 82 120, 96 120, 96 118 L 96 108 Z" fill="#1E3A6B" />
        <path d="M 82 108 L 89 108 L 96 108" stroke="#234E80" strokeWidth="1.5" />
      </g>
    )
  }
  if (outfit === "astronaut") {
    return (
      <g className="ceo-astronaut">
        {/* Backpack showing on sides */}
        <path d="M 30 55 L 30 100 A 5 5 0 0 0 35 105 L 35 55 Z" fill="#C0C0C0" />
        <path d="M 98 55 L 98 100 A 5 5 0 0 1 93 105 L 93 55 Z" fill="#C0C0C0" />
        {/* Main Suit */}
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#EAEAEA" stroke="#CCC" strokeWidth="1.5" />
        {/* Control panel */}
        <rect x="52" y="70" width="24" height="20" rx="3" fill="#D3D3D3" stroke="#999" strokeWidth="1"/>
        <rect x="54" y="72" width="20" height="10" rx="1" fill="#111" />
        <circle cx="58" cy="86" r="2.5" fill="#FF4500" />
        <circle cx="64" cy="86" r="2.5" fill="#00CED1" />
        <circle cx="70" cy="86" r="2.5" fill="#32CD32" />
        {/* Hoses connecting panel to suit side */}
        <path d="M 46 80 Q 40 95, 52 86" fill="none" stroke="#666" strokeWidth="2.5" />
        <path d="M 82 80 Q 88 95, 76 86" fill="none" stroke="#666" strokeWidth="2.5" />
        {/* Boots */}
        <path d="M 32 105 L 32 118 C 32 120, 46 120, 46 118 L 46 105 Z" fill="#999" />
        <path d="M 82 105 L 82 118 C 82 120, 96 120, 96 118 L 96 105 Z" fill="#999" />
      </g>
    )
  }
  if (outfit === "chef") {
    return (
      <g className="ceo-chef">
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#FFF" />
        {/* Double breasted line */}
        <path d="M 54 55 Q 52 85, 54 115" stroke="#EEEEEE" strokeWidth="1" fill="none" />
        <path d="M 74 55 Q 76 85, 74 115" stroke="#EEEEEE" strokeWidth="1" fill="none" />
        {/* Buttons */}
        <circle cx="58" cy="70" r="2" fill="#333" />
        <circle cx="70" cy="70" r="2" fill="#333" />
        <circle cx="58" cy="85" r="2" fill="#333" />
        <circle cx="70" cy="85" r="2" fill="#333" />
        <circle cx="58" cy="100" r="2" fill="#333" />
        <circle cx="70" cy="100" r="2" fill="#333" />
        {/* Red Neckerchief */}
        <path d="M 44 55 Q 64 68, 84 55 L 75 62 L 64 68 L 53 62 Z" fill="#EE2C2C" />
        <path d="M 64 68 L 60 85 L 64 80 L 68 85 Z" fill="#FF4040" />
      </g>
    )
  }
  if (outfit === "doctor") {
    return (
      <g className="ceo-doctor">
        {/* Scrubs underneath */}
        <path d="M 42 55 C 38 75, 42 95, 64 95 C 86 95, 90 75, 86 55 Z" fill="#5F9EA0" />
        {/* V-neck */}
        <path d="M 56 55 L 64 65 L 72 55 Z" fill="#171821" />
        <path d="M 56 55 L 64 65 L 72 55" fill="none" stroke="#4682B4" strokeWidth="1.5" />
        
        {/* White Lab Coat */}
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#F8F9FA" />
        {/* Coat opening showing scrubs */}
        <path d="M 52 55 Q 56 85, 60 115 L 68 115 Q 72 85, 76 55 Z" fill="#5F9EA0" />
        {/* Stethoscope around neck */}
        <path d="M 48 55 Q 40 85, 64 85 Q 88 85, 80 55" fill="none" stroke="#2C3E50" strokeWidth="3" />
        {/* Ear tubes hanging */}
        <path d="M 48 55 L 50 65 M 80 55 L 78 65" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
        {/* Tube running down */}
        <path d="M 64 85 Q 66 100, 72 105" fill="none" stroke="#2C3E50" strokeWidth="2.5" />
        <circle cx="72" cy="105" r="4" fill="#BDC3C7" stroke="#2C3E50" strokeWidth="1.5" />
        
        {/* Lab coat pockets */}
        <rect x="42" y="85" width="12" height="14" rx="1" fill="#F0F0F0" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="42" y1="88" x2="54" y2="88" stroke="#E0E0E0" strokeWidth="1" />
        {/* Pen in pocket */}
        <rect x="44" y="80" width="2" height="8" rx="1" fill="#1E90FF" />
        
        <rect x="74" y="85" width="12" height="14" rx="1" fill="#F0F0F0" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="74" y1="88" x2="86" y2="88" stroke="#E0E0E0" strokeWidth="1" />
      </g>
    )
  }
  if (outfit === "king") {
    return (
      <g className="ceo-king">
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#B22222" />
        {/* Gold Trim */}
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="none" stroke="#FFD700" strokeWidth="2" />
        <path d="M 52 55 L 64 110 L 76 55 Z" fill="#FFD700" opacity="0.3" />
        <path d="M 64 55 L 64 115" stroke="#FFD700" strokeWidth="1.5" />

        {/* Ermine Collar/Shoulders */}
        <path d="M 35 55 Q 64 75, 93 55 Q 100 70, 85 80 Q 64 90, 43 80 Q 28 70, 35 55 Z" fill="#FFF" />
        {/* Ermine spots (tail tufts) */}
        <path d="M 45 65 L 47 62 L 49 65 Z" fill="#000" />
        <path d="M 83 65 L 81 62 L 79 65 Z" fill="#000" />
        <path d="M 55 75 L 57 72 L 59 75 Z" fill="#000" />
        <path d="M 73 75 L 71 72 L 69 75 Z" fill="#000" />
        <path d="M 64 68 L 66 65 L 68 68 Z" fill="#000" />
        
        {/* Royal Sash */}
        <path d="M 85 80 Q 70 95, 50 112 L 55 115 Q 75 95, 90 77" fill="#1E90FF" />
        
        {/* Center medallion */}
        <circle cx="64" cy="65" r="5" fill="#FFD700" />
        <circle cx="64" cy="65" r="2.5" fill="#DC143C" />
      </g>
    )
  }
  if (outfit === "wizardrobe") {
    return (
      <g className="ceo-wizardrobe">
        <path d="M 38 55 C 28 90, 25 115, 64 115 C 103 115, 100 90, 90 55 Z" fill="#4B0082" />
        {/* Golden collar/trim */}
        <path d="M 48 55 L 64 70 L 80 55" fill="none" stroke="#FFD700" strokeWidth="2.5" />
        <path d="M 64 70 L 64 115" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Constellation lines */}
        <path d="M 45 80 L 55 90 L 50 100" fill="none" stroke="#9370DB" strokeWidth="0.8" />
        <path d="M 80 75 L 70 85 L 75 105" fill="none" stroke="#9370DB" strokeWidth="0.8" />
        
        {/* Stars properly spaced */}
        <g fill="#FFD700">
          <polygon points="45,78 46,80 48,80 46.5,81.5 47,83.5 45,82.5 43,83.5 43.5,81.5 42,80 44,80" />
          <polygon points="55,88 56,90 58,90 56.5,91.5 57,93.5 55,92.5 53,93.5 53.5,91.5 52,90 54,90" />
          <polygon points="50,98 51,100 53,100 51.5,101.5 52,103.5 50,102.5 48,103.5 48.5,101.5 47,100 49,100" />
          
          <polygon points="80,73 81,75 83,75 81.5,76.5 82,78.5 80,77.5 78,78.5 78.5,76.5 77,75 79,75" />
          <polygon points="70,83 71,85 73,85 71.5,86.5 72,88.5 70,87.5 68,88.5 68.5,86.5 67,85 69,85" />
          <polygon points="75,103 76,105 78,105 76.5,106.5 77,108.5 75,107.5 73,108.5 73.5,106.5 72,105 74,105" />
        </g>
      </g>
    )
  }
  if (outfit === "akatsuki") {
    return (
      <g className="ceo-akatsuki">
        <path d="M 38 55 C 28 90, 30 115, 64 115 C 98 115, 100 90, 90 55 Z" fill="#1A1A1A" />
        <path d="M 40 55 L 42 35 L 56 45 L 64 42 L 72 45 L 86 35 L 88 55 Z" fill="#1A1A1A" />
        {/* Red Cloud patterns (Akatsuki clouds) */}
        <path d="M 48 88 C 45 88 45 93 48 93 C 48 95 53 95 55 93 C 58 96 63 93 61 89 C 63 85 58 83 55 85 C 52 83 48 85 48 88 Z" fill="#CC0000" stroke="#FFF" strokeWidth="1.2" />
        <path d="M 76 75 C 72 75 72 82 76 82 C 76 85 82 85 84 82 C 88 86 94 82 92 77 C 94 72 88 69 84 72 C 80 69 76 72 76 75 Z" fill="#CC0000" stroke="#FFF" strokeWidth="1.2" transform="scale(0.85) translate(20, 20)" />
        {/* Zipper line */}
        <line x1="64" y1="55" x2="64" y2="115" stroke="#CC0000" strokeWidth="1.5" />
      </g>
    )
  }
  if (outfit === "scout") {
    return (
      <g className="ceo-scout">
        {/* White shirt underneath */}
        <path d="M 46 90 C 46 115, 82 115, 82 90 Z" fill="#F5F5DC" />
        <path d="M 52 55 L 64 70 L 76 55 Z" fill="#F5F5DC" />
        {/* Brown short jacket with V-neck */}
        <path d="M 38 55 C 28 80, 35 90, 64 90 C 93 90, 100 80, 90 55 L 64 70 Z" fill="#8B5A2B" />
        <path d="M 40 110 C 40 120, 88 120, 88 110 Z" fill="#FFF" />
        <path d="M 38 90 C 35 110, 64 110, 90 90 Z" fill="#5C4033" opacity="0.9" />
        {/* Harness straps */}
        <path d="M 40 55 L 64 80 L 88 55" fill="none" stroke="#555" strokeWidth="3" />
        <path d="M 45 80 L 83 80" fill="none" stroke="#555" strokeWidth="3" />
        <path d="M 40 100 L 88 100" fill="none" stroke="#555" strokeWidth="3" />
        <path d="M 55 80 L 55 115" fill="none" stroke="#555" strokeWidth="3" />
        <path d="M 73 80 L 73 115" fill="none" stroke="#555" strokeWidth="3" />
        {/* Metal buckles */}
        <rect x="52" y="78" width="6" height="4" fill="#C0C0C0" />
        <rect x="70" y="78" width="6" height="4" fill="#C0C0C0" />
        {/* Wings of freedom patch */}
        <rect x="75" y="65" width="10" height="12" fill="#5C4033" />
        <path d="M 76 70 L 80 66 L 81 72 Z" fill="#FFF" />
        <path d="M 84 70 L 80 66 L 79 72 Z" fill="#4169E1" />
      </g>
    )
  }
  if (outfit === "jujutsu") {
    return (
      <g className="ceo-jujutsu">
        <path d="M 38 55 C 28 90, 35 115, 64 115 C 93 115, 100 90, 90 55 Z" fill="#11151c" />
        <path d="M 46 55 L 48 40 L 64 45 L 80 40 L 82 55 Z" fill="#11151c" />
        <line x1="64" y1="45" x2="64" y2="115" stroke="#222" strokeWidth="1" />
        {/* Metal button/pin Swirl */}
        <circle cx="76" cy="55" r="3" fill="#FFD700" />
        <circle cx="76" cy="55" r="1.5" fill="#B8860B" />
        {/* Wrinkles */}
        <path d="M 42 80 Q 50 85, 48 95" fill="none" stroke="#222" strokeWidth="2" />
        <path d="M 86 80 Q 78 85, 80 95" fill="none" stroke="#222" strokeWidth="2" />
      </g>
    )
  }
  if (outfit === "gear5") {
    return (
      <g className="ceo-gear5">
        {/* Quần Trắng cắt ngắn tới đầu gối (để lộ cẳng chân gầy) */}
        <path d="M 38 95 C 35 102, 38 108, 64 108 C 90 108, 93 102, 90 95 Z" fill="#F8F8FF" stroke="#DDD" strokeWidth="1" />
        <path d="M 42 98 C 40 102, 48 108, 64 108 C 80 108, 88 102, 86 98 Z" fill="#EAEAEA" />

        {/* Áo vest trắng mở ngực */}
        <path d="M 38 55 C 30 75, 34 95, 38 100 L 90 100 C 94 95, 98 75, 90 55 Z" fill="#FFFFFF" stroke="#EEE" strokeWidth="1" />
        <path d="M 46 55 C 42 75, 44 90, 46 100 L 58 100 L 58 60 C 58 57, 52 56, 46 55 Z" fill="#F0F0F0" />
        <path d="M 82 55 C 86 75, 84 90, 82 100 L 70 100 L 70 60 C 70 57, 76 56, 82 55 Z" fill="#F0F0F0" />
        <path d="M 58 60 L 58 100 L 70 100 L 70 60 C 70 58, 64 56, 58 60 Z" fill="#1A1A1A" opacity="0.1" />
        
        {/* Biên viền áo vàng kim nhạt */}
        <path d="M 46 55 C 42 75, 44 95, 46 100" stroke="#FFD700" opacity="0.6" strokeWidth="1.5" fill="none" />
        <path d="M 82 55 C 86 75, 84 95, 82 100" stroke="#FFD700" opacity="0.6" strokeWidth="1.5" fill="none" />
        
        {/* Sẹo X */}
        <path d="M 52 66 L 76 88 M 76 66 L 52 88" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <path d="M 58 68 L 62 74 M 64 80 L 68 86 M 54 82 L 60 84 M 68 70 L 72 74" stroke="#CC0000" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        
        {/* Đai eo TÍM đặc trưng của form thức tỉnh Gear 5 */}
        <path d="M 38 95 Q 64 100, 90 95" fill="none" stroke="#7B68EE" strokeWidth="8" />
        <path d="M 40 95 Q 64 98, 88 95" fill="none" stroke="#9370DB" strokeWidth="2" />
        <path d="M 44 95 Q 38 110, 42 120" fill="none" stroke="#7B68EE" strokeWidth="5" strokeLinecap="round" />
        <path d="M 48 95 Q 46 110, 50 120" fill="none" stroke="#7B68EE" strokeWidth="5" strokeLinecap="round" />
        
        {/* Mũ rơm lồng dây đeo vắt sau lưng */}
        <g transform="translate(64, 85)">
          <ellipse cx="0" cy="0" rx="22" ry="8" fill="#DEB887" stroke="#B8860B" strokeWidth="1" />
          <ellipse cx="0" cy="-2" rx="12" ry="5" fill="#F5DEB3" stroke="#B8860B" strokeWidth="0.8" />
          <path d="M -12 -2 Q 0 2, 12 -2" fill="none" stroke="#CC1A1A" strokeWidth="2" strokeLinecap="round" />
          <path d="M -8 -20 Q 0 -10, 8 -20" fill="none" stroke="#CC1A1A" strokeWidth="1.5" />
        </g>

        {/* Bông xốp mây ở gấu quần (Nâng lên cùng với quần) */}
        <path d="M 38 108 Q 36 114, 44 114 Q 52 114, 50 108 Q 52 104, 44 104 Q 36 104, 38 108" fill="#F8F8FF" stroke="#DDD" strokeWidth="1" strokeLinejoin="round" />
        <path d="M 78 108 Q 76 114, 84 114 Q 92 114, 90 108 Q 92 104, 84 104 Q 76 104, 78 108" fill="#F8F8FF" stroke="#DDD" strokeWidth="1" strokeLinejoin="round" />
        
        {/* Dép sandals */}
        <ellipse cx="44" cy="118" rx="10" ry="3" fill="#8B4513" />
        <ellipse cx="84" cy="118" rx="10" ry="3" fill="#8B4513" />
        <path d="M 38 115 L 44 110 L 50 115" stroke="#8B4513" strokeWidth="2" fill="none" />
        <path d="M 78 115 L 84 110 L 90 115" stroke="#8B4513" strokeWidth="2" fill="none" />
      </g>
    )
  }
  return (
    <>
      <path className="ceo-cape" d="M 40 60 C 15 90, 20 115, 35 115 C 50 115, 85 115, 95 115 C 110 115, 105 80, 80 60 Z" fill="#8B0000" opacity="0.95"/>
      <path className="ceo-cape-trim" d="M 40 60 C 15 90, 20 115, 35 115 C 50 115, 85 115, 95 115 C 110 115, 105 80, 80 60" stroke="#FFD700" strokeWidth="2.5" fill="none" opacity="0.9"/>
    </>
  )
}

export const CatBody = ({ outfit }: { outfit: Outfit }) => (
  <>
    {/* Base body */}
    <path className="ceo-body" d="M 46 55 C 36 90, 42 120, 64 120 C 86 120, 92 90, 82 55 Z" fill={outfit === "gear5" ? "#F8F8FF" : "#171821"} />

    {/* Soft inner belly */}
    <path className="ceo-belly" d="M 52 65 C 46 95, 52 114, 64 114 C 76 114, 82 95, 76 65" fill={outfit === "gear5" ? "#FFFFFF" : "#222533"} />

    {/* White fluffy chest/neck tuft */}
    <path className="ceo-fluff" d="M 48 55 Q 64 78, 80 55 Q 64 65, 48 55" fill="#E8EBED" />
    <path className="ceo-fluff-inner" d="M 54 58 Q 64 74, 74 58 Q 64 62, 54 58" fill="#FFFFFF" />

    {outfit === "cape" && (
      <>
        <path d="M 48 55 Q 64 70, 80 55" fill="none" stroke="#D4AF37" strokeWidth="3" />
        <g className="ceo-pendant">
          <polygon points="64,65 68,70 64,77 60,70" fill="#E0FFFF" stroke="#FFFFFF" strokeWidth="0.5"/>
          <path d="M 60 70 L 68 70 M 62 67 L 64 77 L 66 67" stroke="#00FFFF" strokeWidth="0.5" fill="none" />
        </g>
      </>
    )}

    {/* Super Saiyan aura phát sáng */}
    {outfit === "saiyan" && (
      <g className="ceo-saiyan-aura">
        <ellipse cx="64" cy="80" rx="40" ry="50" fill="#FFD700" opacity="0.08">
          <animate attributeName="rx" values="38;44;38" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
      </g>
    )}
  </>
)

export const CatHead = ({ emotion, hat, outfit }: { emotion: Emotion, hat: Hat, outfit: Outfit }) => (
  <g className="ceo-head-group">
    {/* Cheek fluffs */}
    <path d="M 36 40 L 26 43 L 34 48 L 24 53 L 36 55 Z" fill={outfit === "gear5" ? "#F8F8FF" : "#171821"} />
    <path d="M 92 40 L 102 43 L 94 48 L 104 53 L 92 55 Z" fill={outfit === "gear5" ? "#F8F8FF" : "#171821"} />

    <ellipse className="ceo-head" cx="64" cy="45" rx="30" ry="24" fill={outfit === "gear5" ? "#F8F8FF" : "#171821"} />
    
    <g className="ceo-ears">
      <path className="ceo-ear-l" d="M 40 32 L 30 5 L 50 24 Z" fill={outfit === "gear5" ? "#EEEEEE" : "#0E0F14"} />
      <path className="ceo-ear-l-inner" d="M 38 28 L 33 12 L 46 24 Z" fill="#FFB6C1" opacity="0.8"/>
      <path className="ceo-ear-r" d="M 88 32 L 98 5 L 78 24 Z" fill={outfit === "gear5" ? "#EEEEEE" : "#0E0F14"} />
      <path className="ceo-ear-r-inner" d="M 90 28 L 95 12 L 82 24 Z" fill="#FFB6C1" opacity="0.8"/>
    </g>
    
    {hat === "crown" && (
      <g className="ceo-crown" transform="translate(68, -2) rotate(15)">
        <path d="M -5 20 L -10 5 L 5 12 L 15 -2 L 25 12 L 40 5 L 35 20 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="-10" cy="5" r="3" fill="#FF0000" />
        <circle cx="5" cy="12" r="2" fill="#00FFFF" />
        <circle cx="15" cy="-2" r="4" fill="#FF00FF" />
        <circle cx="25" cy="12" r="2" fill="#00FFFF" />
        <circle cx="40" cy="5" r="3" fill="#FF0000" />
        <polygon points="15,8 18,13 15,18 12,13" fill="#FFFFFF" />
        <path className="ceo-sparkle" d="M 15 -15 L 17 -8 L 24 -6 L 17 -4 L 15 3 L 13 -4 L 6 -6 L 13 -8 Z" fill="#FFFFFF" />
      </g>
    )}

    {hat === "tophat" && (
      <g className="ceo-tophat" transform="translate(56, -15) rotate(5)">
        <ellipse cx="14" cy="20" rx="18" ry="3" fill="#0E0F14" />
        <path d="M 2 20 L 4 0 L 24 0 L 26 20 Z" fill="#0E0F14" />
        <path d="M 3 15 L 5 10 L 23 10 L 25 15 Z" fill="#8B0000" />
        <path className="ceo-sparkle" d="M 24 -5 L 26 2 L 33 4 L 26 6 L 24 13 L 22 6 L 15 4 L 22 2 Z" fill="#FFFFFF" />
      </g>
    )}

    {hat === "wizard" && (
      <g className="ceo-wizard" transform="translate(48, -22) rotate(-5)">
        <path d="M 16 0 L 0 35 L 32 35 Z" fill="#4B0082" />
        <ellipse cx="16" cy="35" rx="22" ry="5" fill="#4B0082" />
        <path d="M -6 35 C 5 30 27 30 38 35" stroke="#FFD700" strokeWidth="2" fill="none" />
        <path d="M 16 10 L 13 15 L 18 16 Z M 10 22 L 8 26 L 12 25 Z M 22 20 L 20 24 L 24 25 Z" fill="#FFD700" />
      </g>
    )}

    {hat === "cap" && (
      <g className="ceo-cap" transform="translate(50, 10)">
        <path d="M 0 10 C 0 -5 28 -5 28 10 Z" fill="#FF4500" />
        <path d="M 20 10 L 40 10 C 40 15 30 15 20 10 Z" fill="#FF4500" />
        <circle cx="14" cy="0" r="2" fill="#FFFFFF" />
      </g>
    )}

    {hat === "headband" && (
      <g className="ceo-headband" transform="translate(44, 18)">
        <path d="M -5 5 C 15 0 25 0 45 5 L 43 12 C 25 7 15 7 -3 12 Z" fill="#0000CC" />
        <rect x="12" y="2" width="16" height="10" rx="2" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
        <path d="M 15 7 C 20 5 25 9 20 10" fill="none" stroke="#333" strokeWidth="1" />
      </g>
    )}

    {hat === "sunglasses" && (
      <g className="ceo-sunglasses" transform="translate(38, 35)">
        <path d="M -5 5 L 5 2 L 20 5 L 35 2 L 45 5 L 45 8 C 40 15 30 15 25 8 L 15 8 C 10 15 0 15 -5 8 Z" fill="#111" />
        <path d="M -2 5 C 5 10 12 10 18 5 Z" fill="#333" opacity="0.5" />
        <path d="M 22 5 C 29 10 36 10 42 5 Z" fill="#333" opacity="0.5" />
      </g>
    )}

    {/* ── One Piece: Nón rơm Luffy - andnh rộng, thân tròn, dây đỏ ── */}
    {hat === "strawhat" && (
      <g className="ceo-strawhat" transform="translate(38, 8)">
        {/* Andnh nón rộng đặc trưng */}
        <ellipse cx="26" cy="22" rx="32" ry="7" fill="#DEB887" stroke="#B8860B" strokeWidth="1.2" />
        {/* Đường rơm đan trên andnh */}
        <ellipse cx="26" cy="22" rx="32" ry="7" fill="none" stroke="#C4A46C" strokeWidth="0.5" strokeDasharray="4 3" />
        {/* Thân nón chóp tròn */}
        <path d="M 2 22 C 0 8, 52 8, 50 22 Z" fill="#F5DEB3" stroke="#B8860B" strokeWidth="1" />
        {/* Đường rơm đan thân nón */}
        <path d="M 6 18 C 8 14, 44 14, 46 18" fill="none" stroke="#D4A860" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 8 14 C 10 10, 42 10, 44 14" fill="none" stroke="#D4A860" strokeWidth="0.5" strokeDasharray="3 3" />
        {/* Dây buộc đỏ quanh nón */}
        <path d="M 4 18 C 6 15, 46 15, 48 18 L 48 22 C 46 19, 6 19, 4 22 Z" fill="#CC1A1A" />
        {/* Dấu X trắng trên andnh */}
        <line x1="22" y1="10" x2="30" y2="18" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="10" x2="22" y2="18" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" />
        {/* Dây mây mảnh buộc sau gáy */}
        <path d="M -4 24 C -12 28, -14 38, -8 44" stroke="#CC1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 56 24 C 64 28, 66 38, 60 44" stroke="#CC1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    )}

    {/* ── Naruto: Băng đô làng Lá với spiral icon chính xác ── */}
    {hat === "leafband" && (
      <g className="ceo-leafband" transform="translate(36, 22)">
        {/* Băng đô vải */}
        <path d="M -2 6 C 20 -3, 40 -3, 62 6 L 60 14 C 40 5, 20 5, 0 14 Z" fill="#3355AA" />
        {/* Tấm kim loại bảo vệ */}
        <rect x="16" y="0" width="26" height="16" rx="2" fill="#C8C8C8" stroke="#999" strokeWidth="1" />
        {/* Hiệu ứng kim loại phản quang */}
        <rect x="17" y="1" width="24" height="5" rx="1" fill="#E0E0E0" opacity="0.6" />
        {/* Biểu tượng làng Lá - spiral/vòng xoắn lá */}
        <g transform="translate(29, 8)">
          {/* Vòng ngoài spiral */}
          <path d="M 0 -5 C 6 -5, 7 0, 5 3 C 3 6, -2 6, -4 3 C -6 0, -4 -3, 0 -3 C 3 -3, 4 0, 2 2 C 0 4, -1 3, 0 2" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
          {/* Điểm tâm */}
          <circle r="0.8" fill="#333" />
        </g>
        {/* Đinh tán kim loại */}
        <circle cx="18" cy="2" r="1" fill="#AAA" />
        <circle cx="40" cy="2" r="1" fill="#AAA" />
        <circle cx="18" cy="14" r="1" fill="#AAA" />
        <circle cx="40" cy="14" r="1" fill="#AAA" />
        {/* Dây buộc bay sau gáy */}
        <path d="M -2 12 C -10 16, -14 26, -10 34 C -8 30, -12 22, -4 16" stroke="#3355AA" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 62 12 C 70 16, 74 26, 70 34 C 68 30, 72 22, 64 16" stroke="#3355AA" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )}

    {/* ── Super Saiyan Goku: Tóc vàng xù vươn lên + aura chớp ── */}
    {hat === "saiyanhair" && (
      <g className="ceo-saiyanhair" transform="translate(64, 22)">
        {/* Aura tia sét phía sau tóc */}
        <g opacity="0.4">
          <path d="M -22 6 L -30 -5 L -20 -2 L -26 -20 L -14 -8 L -16 -28 L -6 -12 L 0 -35 L 6 -12 L 12 -30 L 14 -8 L 22 -22 L 18 -2 L 28 -8 L 24 6" fill="none" stroke="#FFFF44" strokeWidth="2">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.4s" repeatCount="indefinite" />
          </path>
        </g>
        {/* Tóc vàng xù chính - nhiều lớp tia nhọn vươn lên */}
        <path d="
          M -20 10
          L -26 -6 L -18 0
          L -20 -18 L -12 -4
          L -14 -28 L -6 -8
          L -6 -38 L 0 -10
          L 2 -42 L 6 -12
          L 10 -35 L 12 -6
          L 16 -28 L 16 -2
          L 22 -18 L 20 2
          L 26 -8 L 24 8
          Z" fill="#FFD700" stroke="#CC9900" strokeWidth="0.8" />
        {/* Highlight sáng bên trong tóc */}
        <path d="
          M -16 6
          L -20 -8 L -14 0
          L -16 -20 L -10 -6
          L -10 -32 L -4 -8
          L -2 -36 L 2 -10
          L 6 -32 L 8 -6
          L 12 -24 L 12 0
          L 18 -14 L 16 4
          L 22 -6 L 20 6
          Z" fill="#FFED4A" />
        {/* Tia sáng highlight strong nhất */}
        <path d="M -4 -8 L -2 -30 L 2 -8 L 4 -32 L 8 -6 L 10 -28 L 12 -4" fill="none" stroke="#FFFFAA" strokeWidth="1" opacity="0.6" />
        {/* Sọc bóng đổ tóc */}
        <path d="M -12 4 L -10 -10 L -6 2 M 4 0 L 6 -16 L 10 0 M 14 2 L 16 -10 L 20 4" fill="none" stroke="#DAA520" strokeWidth="0.8" opacity="0.5" />
      </g>
    )}

    {hat === "helmet" && (
      <g className="ceo-helmet">
        {/* Encase the head entirely cx="64" cy="45" */}
        <ellipse cx="64" cy="45" rx="42" ry="36" fill="rgba(255,255,255,0.2)" stroke="#EAEAEA" strokeWidth="3" />
        <ellipse cx="64" cy="45" rx="42" ry="36" fill="#1E90FF" opacity="0.15" />
        {/* Reflection */}
        <path d="M 35 25 C 50 15, 75 15, 85 30" stroke="#FFF" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" />
        {/* Base ring */}
        <ellipse cx="64" cy="78" rx="35" ry="6" fill="#D3D3D3" stroke="#999" strokeWidth="1.5" />
      </g>
    )}

    {hat === "chefhat" && (
      <g className="ceo-chefhat" transform="translate(64, 18)">
        <path d="M -20 0 C -35 -15, -25 -35, -5 -30 C -5 -45, 15 -45, 20 -30 C 35 -35, 40 -15, 20 0 Z" fill="#FFF" stroke="#EEE" strokeWidth="1.5" />
        <rect x="-18" y="-5" width="36" height="15" rx="2" fill="#FFF" stroke="#EEE" strokeWidth="1" />
        <path d="M -15 -1 L -15 8 M -5 -1 L -5 8 M 5 -1 L 5 8 M 15 -1 L 15 8" stroke="#F5F5F5" strokeWidth="1" />
      </g>
    )}

    {hat === "headmirror" && (
      <g className="ceo-headmirror" transform="translate(64, 25)">
        {/* Headband arch around head */}
        <path d="M -30 15 C -25 -5, 25 -5, 30 15" fill="none" stroke="#2C3E50" strokeWidth="3.5" />
        <circle cx="0" cy="0" r="12" fill="#E0E0E0" stroke="#7F8C8D" strokeWidth="2" />
        {/* Reflector rings */}
        <circle cx="0" cy="0" r="9" fill="#BDC3C7" />
        <circle cx="0" cy="0" r="6" fill="#F5F5F5" />
        <circle cx="0" cy="0" r="2.5" fill="#2C3E50" />
      </g>
    )}
    {hat === "rogueband" && (
      <g className="ceo-rogueband" transform="translate(36, 22)">
        <path d="M -2 6 C 20 -3, 40 -3, 62 6 L 60 14 C 40 5, 20 5, 0 14 Z" fill="#1A1A1A" />
        <rect x="16" y="0" width="26" height="16" rx="2" fill="#A8A8A8" stroke="#555" strokeWidth="1" />
        <rect x="17" y="1" width="24" height="5" rx="1" fill="#E0E0E0" opacity="0.6" />
        <g transform="translate(29, 8)">
          <path d="M 0 -5 C 6 -5, 7 0, 5 3 C 3 6, -2 6, -4 3 C -6 0, -4 -3, 0 -3 C 3 -3, 4 0, 2 2 C 0 4, -1 3, 0 2" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
          <circle r="0.8" fill="#333" />
        </g>
        <line x1="18" y1="4" x2="40" y2="12" stroke="#222" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="2" r="1" fill="#444" />
        <circle cx="40" cy="2" r="1" fill="#444" />
        <circle cx="18" cy="14" r="1" fill="#444" />
        <circle cx="40" cy="14" r="1" fill="#444" />
        <path d="M 62 12 C 70 16, 74 26, 70 34" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )}

    {hat === "scoutcape" && (
      <g className="ceo-scoutcape" transform="translate(64, 43)">
        <path d="M -36 5 C -42 -10, -32 -38, 0 -42 C 32 -38, 42 -10, 36 5 Z" fill="#2E8B57" />
        <path d="M -28 5 C -35 -5, -20 -30, 0 -33 C 20 -30, 35 -5, 28 5 Z" fill="#171821" />
        <path d="M -36 5 C -40 20, -30 30, -26 25 L -26 15 Z" fill="#2E8B57" />
        <path d="M 36 5 C 40 20, 30 30, 26 25 L 26 15 Z" fill="#2E8B57" />
        <path d="M -10 12 C 0 16, 10 12, 0 14 Z" fill="#1E5C3A" />
      </g>
    )}

    {outfit === "akatsuki" && (
      <g className="ceo-akatsuki-collar">
        {/* Cổ áo vươn cao đặc trưng che nửa cằm */}
        <path d="M 28 58 L 22 25 C 40 18, 88 18, 106 25 L 100 58 C 75 62, 53 62, 28 58 Z" fill="#1A1A1A" stroke="#CC0000" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M 30 28 C 50 22, 78 22, 98 28 L 96 55 C 75 60, 53 60, 32 55 Z" fill="#8B0000" />
      </g>
    )}

    {outfit === "jujutsu" && (
      <g className="ceo-jujutsu-collar">
        {/* Cổ áo Jujutsu bọc lên cằm siêu ngầu */}
        <path d="M 36 60 L 36 45 C 50 55, 78 55, 92 45 L 92 60 C 80 65, 48 65, 36 60 Z" fill="#11151c" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
        <path d="M 36 45 L 40 50 M 92 45 L 88 50" stroke="#222" strokeWidth="1" />
      </g>
    )}

    {outfit === "gear5" && (
      <g className="ceo-gear5-hagoromo">
        {/* Dải khói mây Hagoromo bay thành vòng cung khổng lồ quấn quanh người và đầu */}
        <path d="M 18 75 C -15 65, -20 -30, 64 -25 C 148 -30, 143 65, 110 75" fill="none" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" filter="drop-shadow(0 5px 8px rgba(0,0,0,0.2))" opacity="0.95" />
        <path d="M 18 75 C -15 65, -20 -30, 64 -25 C 148 -30, 143 65, 110 75" fill="none" stroke="#F8F8FF" strokeWidth="10" strokeLinecap="round" strokeDasharray="18 15" />
        <path d="M 18 75 Q 64 95, 110 75" fill="none" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" opacity="0.95" />
        <path d="M 18 75 Q 64 95, 110 75" fill="none" stroke="#F8F8FF" strokeWidth="8" strokeLinecap="round" strokeDasharray="12 10" />
      </g>
    )}
    
    <g className="ceo-face">
      {outfit === "onepiece" && (
        <>
          {/* Tóc đen bù xù của Luffy rũ xuống trán */}
          <path d="M 45 20 L 42 26 L 50 22 L 55 28 L 60 22 L 68 30 L 75 22 L 80 28 L 82 20 Z" fill="#111" />
        </>
      )}
      {(outfit === "onepiece" || outfit === "gear5") && (
        <>
          {/* Vết sẹo 2 mũi khâu dưới mắt trái (Mắt phải người xem) */}
          <path d="M 34 46 C 40 49, 44 49, 48 46" fill="none" stroke="#8B0000" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="38" y1="45" x2="38" y2="50" stroke="#8B0000" strokeWidth="1" opacity="0.8" />
          <line x1="43" y1="45" x2="43" y2="50" stroke="#8B0000" strokeWidth="1" opacity="0.8" />
        </>
      )}
      {outfit === "naruto" && (
        <g stroke="#333" strokeWidth="0.5" opacity="0.5">
          <line x1="32" y1="46" x2="38" y2="44" />
          <line x1="32" y1="48" x2="38" y2="48" />
          <line x1="32" y1="50" x2="38" y2="52" />
          <line x1="90" y1="46" x2="96" y2="44" />
          <line x1="90" y1="48" x2="96" y2="48" />
          <line x1="90" y1="50" x2="96" y2="52" />
        </g>
      )}
      <ellipse cx="40" cy="46" rx="6" ry="3" fill="#FF69B4" opacity="0.5" className="ceo-blush" />
      <ellipse cx="88" cy="46" rx="6" ry="3" fill="#FF69B4" opacity="0.5" className="ceo-blush" />
      <g className="ceo-eyes">
        {outfit === "gear5" ? (
          <>
            {/* Gear 5 Red Ring Eyes */}
            <circle cx="44" cy="40" r="8" fill="#FFF" />
            <circle cx="44" cy="40" r="5" fill="none" stroke="#FF4500" strokeWidth="1.5" />
            <circle cx="44" cy="40" r="2.5" fill="#FF0000" />
            <circle cx="45" cy="38" r="1.5" fill="#FFF" />
            
            <circle cx="74" cy="40" r="8" fill="#FFF" />
            <circle cx="74" cy="40" r="5" fill="none" stroke="#FF4500" strokeWidth="1.5" />
            <circle cx="74" cy="40" r="2.5" fill="#FF0000" />
            <circle cx="75" cy="38" r="1.5" fill="#FFF" />
          </>
        ) : emotion === "surprised" || emotion === "shocked" ? (
          <>
            <circle cx="44" cy="40" r={emotion === "shocked" ? 9 : 7} fill="#FFF" />
            <circle cx="44" cy="40" r={emotion === "shocked" ? 1.5 : 2} fill="#111" />
            <circle cx="74" cy="40" r={emotion === "shocked" ? 9 : 7} fill="#FFF" />
            <circle cx="74" cy="40" r={emotion === "shocked" ? 1.5 : 2} fill="#111" />
          </>
        ) : emotion === "cute" ? (
          <>
            {/* Left eye X=44 Y=40 */}
            <ellipse cx="44" cy="40" rx="7" ry="9" fill="#222" />
            <ellipse cx="44" cy="40" rx="6" ry="8" fill="#FFD700" />
            <circle cx="44" cy="40" r="3.5" fill="#B8860B" />
            <circle cx="46" cy="36" r="2.5" fill="#FFFFFF" />
            <circle cx="42" cy="44" r="1" fill="#FFFFFF" />
            
            {/* Right eye X=74 Y=40 */}
            <ellipse cx="74" cy="40" rx="7" ry="9" fill="#222" />
            <ellipse cx="74" cy="40" rx="6" ry="8" fill="#FFD700" />
            <circle cx="74" cy="40" r="3.5" fill="#B8860B" />
            <circle cx="76" cy="36" r="2.5" fill="#FFFFFF" />
            <circle cx="72" cy="44" r="1" fill="#FFFFFF" />
          </>
        ) : emotion === "happy" ? (
          <>
            <path d="M 38 42 C 40 34, 48 34, 50 42" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <path d="M 68 42 C 70 34, 78 34, 80 42" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : emotion === "sleepy" ? (
          <>
            <path d="M 37 42 L 51 43" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <path d="M 67 43 L 81 42" fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : emotion === "angry" ? (
          <>
            <path d="M 36 36 L 50 42 L 44 44 Z" fill="#FFD700" />
            <circle cx="45" cy="41" r="1.5" fill="#111" />
            <path d="M 82 36 L 68 42 L 74 44 Z" fill="#FFD700" />
            <circle cx="73" cy="41" r="1.5" fill="#111" />
          </>
        ) : emotion === "mischievous" ? (
          <>
            <path d="M 36 38 L 50 40 L 46 44 L 38 44 Z" fill="#FFD700" />
            <circle cx="44" cy="41" r="1.5" fill="#111" />
            <circle cx="46" cy="40" r="0.8" fill="#FFF" />
            <path d="M 82 38 L 68 40 L 72 44 L 80 44 Z" fill="#FFD700" />
            <circle cx="74" cy="41" r="1.5" fill="#111" />
            <circle cx="72" cy="40" r="0.8" fill="#FFF" />
          </>
        ) : emotion === "love" ? (
          <>
            <path d="M 44 45 C 44 45, 36 38, 36 34 C 36 29, 42 29, 44 33 C 46 29, 52 29, 52 34 C 52 38, 44 45, 44 45 Z" fill="#FF1493" />
            <circle cx="48" cy="34" r="1.5" fill="#FFF" />
            <path d="M 74 45 C 74 45, 66 38, 66 34 C 66 29, 72 29, 74 33 C 76 29, 82 29, 82 34 C 82 38, 74 45, 74 45 Z" fill="#FF1493" />
            <circle cx="78" cy="34" r="1.5" fill="#FFF" />
          </>
        ) : emotion === "sad" ? (
          <>
            <path d="M 38 36 Q 44 34, 50 38" fill="none" stroke="#222" strokeWidth="1.5" />
            <ellipse cx="44" cy="41" rx="5" ry="5.5" fill="#FFD700" />
            <circle cx="44" cy="41" r="2.5" fill="#B8860B" />
            <circle cx="46" cy="39" r="1.5" fill="#FFF" />
            <circle cx="44" cy="46" r="3" fill="#87CEFA" opacity="0.8" />

            <path d="M 80 36 Q 74 34, 68 38" fill="none" stroke="#222" strokeWidth="1.5" />
            <ellipse cx="74" cy="41" rx="5" ry="5.5" fill="#FFD700" />
            <circle cx="74" cy="41" r="2.5" fill="#B8860B" />
            <circle cx="76" cy="39" r="1.5" fill="#FFF" />
            <circle cx="74" cy="46" r="3" fill="#87CEFA" opacity="0.8" />
          </>
        ) : emotion === "proud" ? (
          <>
            <path d="M 38 42 C 40 38, 48 38, 50 42" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
            <path d="M 68 42 C 70 38, 78 38, 80 42" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
            <circle cx="44" cy="46" r="3" fill="#FFC0CB" opacity="0.6" />
            <circle cx="74" cy="46" r="3" fill="#FFC0CB" opacity="0.6" />
          </>
        ) : emotion === "thoughtful" ? (
          <>
            <ellipse cx="44" cy="40" rx="6" ry="8" fill="#FFD700" />
            <circle cx="45" cy="40" r="2" fill="#111" />
            <circle cx="46" cy="38" r="1" fill="#FFF" />

            <ellipse cx="74" cy="40" rx="5" ry="6" fill="#FFD700" />
            <circle cx="73" cy="40" r="1.5" fill="#111" />
            <circle cx="74" cy="38" r="0.8" fill="#FFF" />
          </>
        ) : emotion === "dizzy" ? (
          <>
            <path d="M 44 40 m -6,0 a 6,6 0 1,0 12,0 a 4,4 0 1,0 -8,0 a 2,2 0 1,0 4,0" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <path d="M 74 40 m -6,0 a 6,6 0 1,0 12,0 a 4,4 0 1,0 -8,0 a 2,2 0 1,0 4,0" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          </>
        ) : (
          /* Default "smug" / cool half-closed eyes */
          <>
            <path d="M 36 39 Q 44 35, 52 39" fill="none" stroke="#222" strokeWidth="1.5" />
            <path d="M 37 40 L 51 40 C 49 44, 39 44, 37 40 Z" fill="#FFD700" />
            <circle cx="44" cy="41.5" r="1.5" fill="#111" />
            <circle cx="45.5" cy="40.5" r="0.6" fill="#FFF" />

            <path d="M 82 39 Q 74 35, 66 39" fill="none" stroke="#222" strokeWidth="1.5" />
            <path d="M 81 40 L 67 40 C 69 44, 79 44, 81 40 Z" fill="#FFD700" />
            <circle cx="74" cy="41.5" r="1.5" fill="#111" />
            <circle cx="75.5" cy="40.5" r="0.6" fill="#FFF" />
          </>
        )}
      </g>

      {hat === "blindfold" && (
        <g className="ceo-blindfold" transform="translate(64, 40)">
          {/* Tóc trắng đặc trưng của Gojo */}
          <path d="M -30 -10 L -38 -25 L -26 -16 L -20 -32 L -10 -15 L -2 -34 L 8 -15 L 18 -32 L 24 -16 L 36 -25 L 30 -10 Z" fill="#F8F8FF" stroke="#E0E0E0" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Vải bịt mắt đen */}
          <path d="M -36 -6 C -10 -15, 10 -15, 36 -6 L 36 12 C 10 5, -10 5, -36 12 Z" fill="#1a1a1a" />
          <path d="M -36 -6 C -10 -12, 10 -12, 36 -6 L 36 12 C 10 8, -10 8, -36 12 Z" fill="#111" />
          <path d="M -20 -6 Q -15 2, -26 10" fill="none" stroke="#2a2a2a" strokeWidth="1" />
          <path d="M 20 -6 Q 15 2, 26 10" fill="none" stroke="#2a2a2a" strokeWidth="1" />
        </g>
      )}

      {hat === "gear5hair" && (
        <g className="ceo-gear5hair" transform="translate(64, 22)">
          {/* Mái tóc mây rực lửa lởm chởm bốc lên của Nika */}
          <path d="
            M -26 -2
            C -40 -15, -20 -30, -14 -25
            C -20 -40, 0 -45, -2 -32
            C 0 -55, 15 -45, 10 -30
            C 25 -45, 30 -30, 18 -22
            C 40 -25, 35 -10, 24 -2
            C 35 10, 15 15, 14 5
            C 5 15, -5 15, -14 5
            C -30 15, -30 -2, -26 -2 Z
          " fill="#FFFFFF" stroke="#DDDDDD" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* Lọn tóc mây lượn sóng highlight bên trong */}
          <path d="M -12 -22 C -5 -15, -10 -5, -8 2" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 8 -24 C 0 -15, 5 -5, 4 2" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 0 -30 C -2 -20, 2 -15, 0 -8" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {(outfit === "suit" || outfit === "king" || outfit === "doctor") && (
        <>
          <circle cx="79" cy="41" r="10" fill="none" stroke="#FFD700" strokeWidth="2.5" className="ceo-monocle" />
          <path className="ceo-chain" d="M 89 45 C 95 60, 95 75, 92 85" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="3,3" />
        </>
      )}
      
      <path d="M 62 50 L 66 50 L 64 53 Z" fill="#FF9999" />
      
      {outfit === "gear5" ? (
         <>
           {/* Gear 5 Nika Laughing Mouth */}
           <path d="M 50 48 Q 64 68, 78 48 Q 64 58, 50 48 Z" fill="#8B0000" />
           <path d="M 52 50 Q 64 56, 76 50 Q 64 53, 52 50 Z" fill="#FFF" />
         </>
      ) : emotion === "surprised" || emotion === "shocked" || emotion === "thoughtful" || emotion === "dizzy" ? (
         <ellipse cx="64" cy="56" rx="3" ry="5" fill="#FFB6C1" />
      ) : emotion === "happy" || emotion === "sleepy" || emotion === "cute" || emotion === "love" ? (
         <path d="M 58 54 Q 64 62, 70 54" fill="none" stroke="#FFB6C1" strokeWidth="2.5" strokeLinecap="round" />
      ) : emotion === "angry" || emotion === "mischievous" ? (
         <path d="M 58 56 Q 64 52, 70 56" fill="none" stroke="#FFB6C1" strokeWidth="2.5" strokeLinecap="round" />
      ) : emotion === "sad" ? (
         <path d="M 60 56 Q 64 52, 68 56" fill="none" stroke="#FFB6C1" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
         <>
          <path className="ceo-mouth" d="M 64 53 Q 60 57 56 55" fill="none" stroke="#FFB6C1" strokeWidth="2" strokeLinecap="round" />
          <path className="ceo-mouth" d="M 64 53 Q 68 57 72 55" fill="none" stroke="#FFB6C1" strokeWidth="2" strokeLinecap="round" />
          <path d="M 56 55 L 57 58 L 58 55 Z" fill="#FFFFFF" />
         </>
      )}
    </g>
  </g>
)
