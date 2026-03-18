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

      <div className="relative max-w-5xl mx-auto">

        {/* Trust pill */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(212, 175, 143, 0.20)',
              border: '1px solid rgba(212, 175, 143, 0.55)',
              color: '#8b6f47',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4ade80' }} />
            {t('heroTagline')}
          </div>
        </div>

        {/* Headline + image side by side */}
        <div className="flex items-center justify-center gap-8 mb-4">
          <img
            src="/img1.png"
            alt=""
            className="hidden sm:block flex-shrink-0 rounded-2xl object-cover"
            style={{
              width: '200px',
              height: '200px',
              border: '2px solid rgba(212, 175, 143, 0.50)',
              boxShadow: '0 12px 40px rgba(139, 111, 71, 0.18)',
            }}
          />
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-center">
            <span style={{ color: '#2d2416' }}>{t('heroHeadline1')}</span>
            <br />
            <span className="text-gold">{t('heroHeadline2')}</span>
          </h1>
        </div>

        {/* Subtle crypto note */}
        <p className="text-xs font-medium mb-8 tracking-widest uppercase text-center" style={{ color: 'rgba(139, 111, 71, 0.50)' }}>
          {t('heroCryptoNote')}
        </p>

        {/* Sub */}
        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light text-center" style={{ color: '#5a5246' }}>
          {t('heroSubtext')}
        </p>

        {/* Hebrew blessing */}
        <p className="text-sm mb-8 font-light text-center" style={{ color: 'rgba(139, 111, 71, 0.70)', fontStyle: 'italic' }}>
          "צְדָקָה תַּצִּיל מִמָּוֶת" — Tzedakah saves from death (Proverbs 10:2)
        </p>

        {/* CTA */}
        <div className="text-center">
        <button
          onClick={connect}
          className="btn-primary btn-gold-shimmer text-base px-10 py-4 font-bold font-serif"
          style={{ fontSize: '1.05rem' }}
        >
          {t('heroConnectBtn')}
        </button>
        </div>

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
