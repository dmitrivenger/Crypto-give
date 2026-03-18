import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'

function StarWatermark() {
  return (
    <svg
      viewBox="0 0 100 115"
      fill="currentColor"
      className="absolute pointer-events-none select-none"
      style={{ color: 'rgba(212, 175, 143, 0.07)', width: '420px', height: '420px', top: '-60px', right: '-80px' }}
    >
      <polygon points="50,5 95,82 5,82" />
      <polygon points="50,110 5,33 95,33" />
    </svg>
  )
}

function MenorahWatermark() {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      className="absolute pointer-events-none select-none"
      style={{ color: 'rgba(212, 175, 143, 0.13)', width: '340px', height: '340px', bottom: '-40px', left: '-60px' }}
    >
      {/* Base */}
      <rect x="72" y="238" width="56" height="10" rx="5" fill="currentColor" />
      {/* Stem foot */}
      <rect x="88" y="222" width="24" height="18" rx="3" fill="currentColor" />
      {/* Center shaft */}
      <rect x="97" y="100" width="6" height="124" rx="3" fill="currentColor" />

      {/* Arms — arching out then up. Each arm: horizontal + vertical segment */}
      {/* Arm widths from center: 28, 56, 84 */}

      {/* Outer left arm */}
      <path d="M100 172 Q72 172 72 140 L72 100" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Mid left arm */}
      <path d="M100 172 Q86 172 86 152 L86 100" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Inner left arm */}
      <path d="M100 172 Q93 172 93 160 L93 100" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none"/>

      {/* Outer right arm */}
      <path d="M100 172 Q128 172 128 140 L128 100" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Mid right arm */}
      <path d="M100 172 Q114 172 114 152 L114 100" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Inner right arm */}
      <path d="M100 172 Q107 172 107 160 L107 100" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none"/>

      {/* Candle holders (cups at top of each arm) */}
      {[72, 86, 93, 100, 107, 114, 128].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y="88" width="8" height="14" rx="2" fill="currentColor" />
        </g>
      ))}

      {/* Candles */}
      {[72, 86, 93, 100, 107, 114, 128].map((x, i) => (
        <rect key={i} x={x - 2.5} y="60" width="5" height="30" rx="2.5" fill="currentColor" />
      ))}

      {/* Flames */}
      {[72, 86, 93, 100, 107, 114, 128].map((x, i) => (
        <ellipse key={i} cx={x} cy="53" rx="4" ry="7" fill="currentColor" />
      ))}
    </svg>
  )
}

export default function Hero() {
  const { connect } = useWallet()
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden py-28 px-4">
      {/* Warm background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% -5%, rgba(212, 175, 143, 0.18) 0%, transparent 65%)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: '10%', left: '15%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(212, 175, 143, 0.10) 0%, transparent 70%)',
          filter: 'blur(40px)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: '5%', right: '10%', width: '380px', height: '380px',
          background: 'radial-gradient(circle, rgba(139, 111, 71, 0.07) 0%, transparent 70%)',
          filter: 'blur(50px)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: '0', left: '30%', width: '600px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(212, 175, 143, 0.12) 0%, transparent 70%)',
          filter: 'blur(30px)' }}
      />
      <StarWatermark />
      <MenorahWatermark />

      <div className="relative max-w-4xl mx-auto text-center">

        {/* Trust pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-8 uppercase tracking-widest"
          style={{
            background: 'rgba(212, 175, 143, 0.20)',
            border: '1px solid rgba(212, 175, 143, 0.55)',
            color: '#8b6f47',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4ade80' }} />
          {t('heroTagline')}
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 tracking-tight">
          <span style={{ color: '#2d2416' }}>{t('heroHeadline1')}</span>
          <br />
          <span className="text-gold">{t('heroHeadline2')}</span>
        </h1>

        {/* Subtle crypto note */}
        <p className="text-xs font-medium mb-8 tracking-widest uppercase" style={{ color: 'rgba(139, 111, 71, 0.50)' }}>
          {t('heroCryptoNote')}
        </p>

        {/* Sub */}
        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light" style={{ color: '#5a5246' }}>
          {t('heroSubtext')}
        </p>

        {/* Hebrew blessing */}
        <p className="text-sm mb-8 font-light" style={{ color: 'rgba(139, 111, 71, 0.70)', fontStyle: 'italic' }}>
          "צְדָקָה תַּצִּיל מִמָּוֶת" — Tzedakah saves from death (Proverbs 10:2)
        </p>

        {/* CTA */}
        <button
          onClick={connect}
          className="btn-primary btn-gold-shimmer text-base px-10 py-4 font-bold font-serif"
          style={{ fontSize: '1.05rem' }}
        >
          {t('heroConnectBtn')}
        </button>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-xs mx-auto">
          {[
            { value: '5', labelKey: 'statBlockchains' },
            { value: '7+', labelKey: 'statTokens' },
            { value: 'PDF & CSV', labelKey: 'statTaxFormats' },
          ].map(s => (
            <div key={s.labelKey} className="text-center">
              <div className="text-2xl font-bold font-serif" style={{ color: '#8b6f47' }}>{s.value}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'rgba(90, 82, 70, 0.60)' }}>{t(s.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div
          className="mt-14 flex flex-wrap items-center justify-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(212, 175, 143, 0.35)' }}
        >
          {['Bitcoin', 'Ethereum', 'Polygon', 'BNB Chain', 'Tron', 'USDC', 'USDT'].map(name => (
            <span
              key={name}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(212, 175, 143, 0.15)',
                color: '#5a5246',
                border: '1px solid rgba(212, 175, 143, 0.40)',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
