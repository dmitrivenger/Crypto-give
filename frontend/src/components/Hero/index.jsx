import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'

function StarWatermark() {
  return (
    <svg
      viewBox="0 0 100 115"
      fill="currentColor"
      className="absolute pointer-events-none select-none"
      style={{ color: 'rgba(201,168,76,0.04)', width: '420px', height: '420px', top: '-60px', right: '-80px' }}
    >
      <polygon points="50,5 95,82 5,82" />
      <polygon points="50,110 5,33 95,33" />
    </svg>
  )
}

export default function Hero() {
  const { connect } = useWallet()
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden py-28 px-4">
      {/* Background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% -5%, rgba(59,74,138,0.65) 0%, transparent 65%)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: '10%', left: '15%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(80,40,130,0.22) 0%, transparent 70%)',
          filter: 'blur(40px)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: '5%', right: '10%', width: '380px', height: '380px',
          background: 'radial-gradient(circle, rgba(42,53,96,0.35) 0%, transparent 70%)',
          filter: 'blur(50px)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: '0', left: '30%', width: '600px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
          filter: 'blur(30px)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(10,13,24,1) 0%, transparent 100%)', height: '180px' }}
      />
      <StarWatermark />

      <div className="relative max-w-4xl mx-auto text-center">

        {/* Trust pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-8"
          style={{
            background: 'rgba(42,53,96,0.60)',
            border: '1px solid rgba(201,168,76,0.25)',
            color: '#E2B96F',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4ade80' }} />
          {t('heroTagline')}
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
          <span className="text-white">{t('heroHeadline1')}</span>
          <br />
          <span className="text-gold">{t('heroHeadline2')}</span>
        </h1>

        {/* Sub */}
        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {t('heroSubtext')}
        </p>

        {/* Hebrew blessing */}
        <p className="text-sm mb-8" style={{ color: 'rgba(201,168,76,0.55)', fontStyle: 'italic' }}>
          "צְדָקָה תַּצִּיל מִמָּוֶת" — Tzedakah saves from death (Proverbs 10:2)
        </p>

        {/* CTA */}
        <button
          onClick={connect}
          className="btn-primary btn-gold-shimmer text-base px-10 py-4 font-semibold font-serif"
          style={{ fontSize: '1.05rem', letterSpacing: '0.01em' }}
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
              <div className="text-2xl font-bold font-serif" style={{ color: '#E2B96F' }}>{s.value}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{t(s.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div
          className="mt-14 flex flex-wrap items-center justify-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {['Bitcoin', 'Ethereum', 'Polygon', 'BNB Chain', 'Tron', 'USDC', 'USDT'].map(name => (
            <span
              key={name}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', border: '0.5px solid rgba(201,168,76,0.18)' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
