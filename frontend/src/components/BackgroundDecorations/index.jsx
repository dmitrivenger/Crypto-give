/* Fixed full-screen layer of subtle Judaism + crypto icons — always behind content */

function StarOfDavid({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 115" fill="currentColor">
      <polygon points="50,5 95,82 5,82" />
      <polygon points="50,110 5,33 95,33" />
    </svg>
  )
}

function Menorah({ size = 90 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 130" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Base */}
      <line x1="40" y1="125" x2="80" y2="125" />
      <line x1="60" y1="125" x2="60" y2="55" />
      {/* Left arms */}
      <path d="M60,90 Q42,85 30,70 Q26,60 30,55" />
      <path d="M60,80 Q48,76 42,65 Q40,57 44,53" />
      <path d="M60,70 Q54,67 52,60 Q51,54 55,51" />
      {/* Right arms */}
      <path d="M60,90 Q78,85 90,70 Q94,60 90,55" />
      <path d="M60,80 Q72,76 78,65 Q80,57 76,53" />
      <path d="M60,70 Q66,67 68,60 Q69,54 65,51" />
      {/* Flames */}
      <ellipse cx="30" cy="51" rx="3.5" ry="5.5" fill="currentColor" />
      <ellipse cx="44" cy="49" rx="3.5" ry="5.5" fill="currentColor" />
      <ellipse cx="55" cy="47" rx="3.5" ry="5.5" fill="currentColor" />
      <ellipse cx="60" cy="46" rx="3.5" ry="5.5" fill="currentColor" />
      <ellipse cx="65" cy="47" rx="3.5" ry="5.5" fill="currentColor" />
      <ellipse cx="76" cy="49" rx="3.5" ry="5.5" fill="currentColor" />
      <ellipse cx="90" cy="51" rx="3.5" ry="5.5" fill="currentColor" />
    </svg>
  )
}

function TorahScroll({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Left roller */}
      <rect x="5" y="20" width="14" height="60" rx="7" />
      <line x1="12" y1="10" x2="12" y2="90" />
      {/* Right roller */}
      <rect x="81" y="20" width="14" height="60" rx="7" />
      <line x1="88" y1="10" x2="88" y2="90" />
      {/* Scroll body */}
      <rect x="19" y="22" width="62" height="56" rx="2" />
      {/* Text lines */}
      <line x1="27" y1="36" x2="73" y2="36" />
      <line x1="27" y1="46" x2="73" y2="46" />
      <line x1="27" y1="56" x2="73" y2="56" />
      <line x1="27" y1="66" x2="60" y2="66" />
    </svg>
  )
}

function EthDiamond({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 160" fill="currentColor">
      <polygon points="50,5 92,60 50,80 8,60" opacity="0.8" />
      <polygon points="50,80 92,60 50,155" opacity="0.5" />
      <polygon points="50,80 8,60 50,155" opacity="0.65" />
    </svg>
  )
}

function BitcoinSymbol({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
      <text x="50%" y="78" textAnchor="middle" fontSize="88" fontFamily="serif" fontWeight="bold">₿</text>
    </svg>
  )
}

function Hamsa({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* Palm */}
      <path d="M20,70 Q18,40 22,25 Q25,15 30,18 Q35,22 35,35 L35,55" />
      <path d="M35,55 L35,20 Q35,10 40,10 Q45,10 45,20 L45,50" />
      <path d="M45,50 L45,15 Q45,5 50,5 Q55,5 55,15 L55,50" />
      <path d="M55,50 L55,20 Q55,10 60,10 Q65,10 65,20 L65,55" />
      <path d="M65,55 Q65,35 68,25 Q71,15 76,18 Q80,22 78,40 L76,70" />
      <path d="M20,70 Q18,100 50,110 Q82,100 80,70 Z" />
      {/* Eye */}
      <ellipse cx="50" cy="82" rx="8" ry="5" />
      <circle cx="50" cy="82" r="3" fill="currentColor" />
    </svg>
  )
}

// Each decoration: { Component, x (%), y (%), size, rotate, opacity }
const DECORATIONS = [
  { C: StarOfDavid,    x: 4,   y: 8,   size: 130, rotate: 15,   opacity: 0.032 },
  { C: Menorah,        x: 85,  y: 5,   size: 110, rotate: -8,   opacity: 0.030 },
  { C: EthDiamond,     x: 92,  y: 38,  size: 90,  rotate: 10,   opacity: 0.035 },
  { C: BitcoinSymbol,  x: 2,   y: 42,  size: 100, rotate: -12,  opacity: 0.028 },
  { C: TorahScroll,    x: 88,  y: 68,  size: 95,  rotate: 6,    opacity: 0.030 },
  { C: Hamsa,          x: 6,   y: 72,  size: 90,  rotate: -5,   opacity: 0.028 },
  { C: StarOfDavid,    x: 48,  y: 2,   size: 80,  rotate: 0,    opacity: 0.022 },
  { C: EthDiamond,     x: 20,  y: 85,  size: 75,  rotate: -18,  opacity: 0.025 },
  { C: Menorah,        x: 62,  y: 80,  size: 85,  rotate: 5,    opacity: 0.025 },
  { C: BitcoinSymbol,  x: 76,  y: 52,  size: 70,  rotate: 20,   opacity: 0.022 },
  { C: StarOfDavid,    x: 38,  y: 55,  size: 60,  rotate: -10,  opacity: 0.018 },
  { C: TorahScroll,    x: 14,  y: 22,  size: 65,  rotate: 12,   opacity: 0.022 },
]

export default function BackgroundDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {DECORATIONS.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left:      `${d.x}%`,
            top:       `${d.y}%`,
            color:     '#E2B96F',
            opacity:   d.opacity,
            transform: `rotate(${d.rotate}deg)`,
          }}
        >
          <d.C size={d.size} />
        </div>
      ))}
    </div>
  )
}
