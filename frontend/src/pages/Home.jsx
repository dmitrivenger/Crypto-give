import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import FAQ from '../components/FAQ'
import LoadingSpinner from '../components/LoadingSpinner'
import useOrganizations from '../hooks/useOrganizations'
import { useWallet } from '../contexts/WalletContext'
import { useLanguage } from '../contexts/LanguageContext'
import { BLOCKCHAIN_LABELS } from '../utils/constants'

function StarOfDavid({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 115" fill="currentColor">
      <polygon points="50,5 95,82 5,82" /><polygon points="50,110 5,33 95,33" />
    </svg>
  )
}

function HowItWorks() {
  const { t } = useLanguage()
  const steps = [
    { icon: '🔗', titleKey: 'step1Title', descKey: 'step1Desc', num: '01' },
    { icon: '💸', titleKey: 'step2Title', descKey: 'step2Desc', num: '02' },
    { icon: '📄', titleKey: 'step3Title', descKey: 'step3Desc', num: '03' },
  ]
  return (
    <section className="py-20 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-center mb-14" style={{ color: '#F5D78E' }}>
          {t('howItWorks')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center"
              style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: 'rgba(42,53,96,0.80)', border: '1px solid rgba(201,168,76,0.25)' }}
              >
                {step.icon}
              </div>
              <p className="text-xs font-bold mb-2" style={{ color: 'rgba(201,168,76,0.45)', letterSpacing: '0.12em' }}>
                {step.num}
              </p>
              <h3 className="font-semibold mb-2 text-white">{t(step.titleKey)}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OrgPreviewCard({ organization }) {
  const { connect } = useWallet()
  const { t } = useLanguage()
  return (
    <div
      className="rounded-2xl p-5 flex flex-col cursor-pointer group transition-all duration-200"
      style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.15), 0 12px 40px rgba(0,0,0,0.55)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div
        className="h-16 w-full rounded-xl flex items-center justify-center mb-4 text-3xl"
        style={{ background: 'linear-gradient(135deg, rgba(42,53,96,0.80), rgba(26,32,80,0.60))', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        🏛️
      </div>
      <h3 className="font-bold text-white mb-1 group-hover:text-[#E2B96F] transition-colors">{organization.name}</h3>
      {organization.description && (
        <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {organization.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(organization.blockchains || []).map(b => (
          <span key={b.name} className="badge-chain">{BLOCKCHAIN_LABELS[b.name] || b.name}</span>
        ))}
      </div>
      <button onClick={connect} className="btn-primary w-full mt-auto">
        {t('connectToDonate')}
      </button>
    </div>
  )
}

function Footer() {
  const { t } = useLanguage()
  return (
    <footer
      className="py-10 px-4 text-center"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Star divider */}
      <div className="flex items-center justify-center gap-3 mb-6" style={{ color: 'rgba(201,168,76,0.25)' }}>
        <span className="h-px flex-1 max-w-32" style={{ background: 'rgba(201,168,76,0.20)' }} />
        <StarOfDavid size={16} />
        <span className="h-px flex-1 max-w-32" style={{ background: 'rgba(201,168,76,0.20)' }} />
      </div>

      <p className="text-sm mb-2 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <strong style={{ color: 'rgba(255,255,255,0.50)' }}>{t('disclaimerLabel')}</strong> {t('disclaimerText')}
      </p>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
        © {new Date().getFullYear()} {t('copyrightText')}
      </p>

      {/* Legal links */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-6 mb-4">
        {[
          { to: '/terms',         label: 'Terms of Service' },
          { to: '/privacy',       label: 'Privacy Policy' },
          { to: '/refund-policy', label: 'Refund Policy' },
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.30)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#E2B96F'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        {['🔒 SSL Secured', '✅ On-Chain Verified', '📑 Tax-Compliant'].map(item => (
          <span key={item} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {item}
          </span>
        ))}
      </div>
    </footer>
  )
}

export default function Home() {
  const { organizations, loading, error } = useOrganizations()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />

        {/* Organizations */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#F5D78E' }}>
                {t('supportedOrgs')}
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('verifiedNonprofits')}</p>
            </div>

            {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}
            {error && <p className="text-center py-16 text-red-400">{t('failedToLoad')}</p>}
            {!loading && !error && organizations.length === 0 && (
              <p className="text-center py-16" style={{ color: 'rgba(255,255,255,0.30)' }}>{t('noOrgs')}</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {organizations.map(org => (
                <OrgPreviewCard key={org.id} organization={org} />
              ))}
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
