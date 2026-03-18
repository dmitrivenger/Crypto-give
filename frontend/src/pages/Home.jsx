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
    {
      num: '01',
      titleKey: 'step1Title',
      descKey: 'step1Desc',
      gradient: 'linear-gradient(145deg, #bfdbfe, #93c5fd)',
      shadow: 'rgba(147, 197, 253, 0.45)',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          {/* Chain links */}
          <rect x="4" y="13" width="10" height="6" rx="3" fill="#1d4ed8" fillOpacity="0.18" stroke="#2563eb" strokeWidth="1.8"/>
          <rect x="22" y="13" width="10" height="6" rx="3" fill="#1d4ed8" fillOpacity="0.18" stroke="#2563eb" strokeWidth="1.8"/>
          <line x1="14" y1="16" x2="22" y2="16" stroke="#2563eb" strokeWidth="1.8"/>
          {/* Top block */}
          <rect x="12" y="4" width="12" height="8" rx="2.5" fill="#3b82f6" fillOpacity="0.25" stroke="#2563eb" strokeWidth="1.8"/>
          <line x1="18" y1="12" x2="18" y2="13" stroke="#2563eb" strokeWidth="1.8"/>
          {/* Bottom block */}
          <rect x="12" y="24" width="12" height="8" rx="2.5" fill="#3b82f6" fillOpacity="0.25" stroke="#2563eb" strokeWidth="1.8"/>
          <line x1="18" y1="19" x2="18" y2="24" stroke="#2563eb" strokeWidth="1.8"/>
          {/* Shine */}
          <rect x="13" y="5" width="4" height="2" rx="1" fill="white" fillOpacity="0.45"/>
          <rect x="13" y="25" width="4" height="2" rx="1" fill="white" fillOpacity="0.45"/>
        </svg>
      ),
    },
    {
      num: '02',
      titleKey: 'step2Title',
      descKey: 'step2Desc',
      gradient: 'linear-gradient(145deg, #bbf7d0, #6ee7b7)',
      shadow: 'rgba(110, 231, 183, 0.45)',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          {/* Coin body */}
          <ellipse cx="18" cy="19" rx="11" ry="4" fill="#065f46" fillOpacity="0.15"/>
          <circle cx="18" cy="16" r="11" fill="#d1fae5" stroke="#059669" strokeWidth="1.8"/>
          <circle cx="18" cy="16" r="8" fill="#a7f3d0" fillOpacity="0.5" stroke="#059669" strokeWidth="1.2"/>
          {/* ₿ symbol */}
          <path d="M16 11h3.5a2 2 0 0 1 0 4H16M16 15h4a2 2 0 0 1 0 4h-4" stroke="#065f46" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="16" y1="11" x2="16" y2="19" stroke="#065f46" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="17.5" y1="9.5" x2="17.5" y2="11" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="17.5" y1="19" x2="17.5" y2="20.5" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Shine */}
          <ellipse cx="13" cy="12" rx="3" ry="1.5" fill="white" fillOpacity="0.50" transform="rotate(-30 13 12)"/>
        </svg>
      ),
    },
    {
      num: '03',
      titleKey: 'step3Title',
      descKey: 'step3Desc',
      gradient: 'linear-gradient(145deg, #bfdbfe, #bbf7d0)',
      shadow: 'rgba(147, 197, 253, 0.35)',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          {/* Doc shadow */}
          <rect x="10" y="6" width="17" height="23" rx="2.5" fill="#1d4ed8" fillOpacity="0.08"/>
          {/* Doc body */}
          <rect x="8" y="4" width="17" height="23" rx="2.5" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.7"/>
          {/* Folded corner */}
          <path d="M21 4 L25 8 H21 V4Z" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1.4"/>
          {/* Dollar badge */}
          <circle cx="22" cy="26" r="6" fill="#d1fae5" stroke="#059669" strokeWidth="1.7"/>
          <path d="M22 22.5v7M20.5 24.2a1.5 1.5 0 0 1 3 0c0 .8-1.5 1.5-1.5 1.5s-1.5.7-1.5 1.5a1.5 1.5 0 0 0 3 0" stroke="#065f46" strokeWidth="1.4" strokeLinecap="round"/>
          {/* Lines */}
          <line x1="11" y1="14" x2="20" y2="14" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="11" y1="18" x2="18" y2="18" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="11" y1="22" x2="15" y2="22" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]
  return (
    <section className="py-20 px-4" style={{ borderTop: '1px solid rgba(212, 175, 143, 0.30)' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-center mb-14" style={{ color: '#2d2416' }}>
          {t('howItWorks')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
                border: '2px solid #d4af8f',
                boxShadow: '0 8px 24px rgba(139, 111, 71, 0.10)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#8b6f47'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(139, 111, 71, 0.18)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#d4af8f'
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 111, 71, 0.10)'
              }}
            >
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: step.gradient,
                  boxShadow: `0 6px 18px ${step.shadow}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                {step.icon}
              </div>
              <p className="text-xs font-bold mb-2" style={{ color: 'rgba(139, 111, 71, 0.55)', letterSpacing: '0.12em' }}>
                {step.num}
              </p>
              <h3 className="font-bold mb-2" style={{ color: '#2d2416' }}>{t(step.titleKey)}</h3>
              <p className="text-sm leading-relaxed font-light" style={{ color: '#5a5246' }}>{t(step.descKey)}</p>
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
      className="rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
        border: '2px solid #d4af8f',
        boxShadow: '0 12px 32px rgba(139, 111, 71, 0.10)',
      }}
      onClick={() => { if (organization.websiteUrl) window.open(organization.websiteUrl, '_blank', 'noopener,noreferrer') }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#8b6f47'
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 24px 52px rgba(139, 111, 71, 0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#d4af8f'
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 111, 71, 0.10)'
      }}
    >
      <div
        className="h-16 w-full rounded-xl flex items-center justify-center mb-4 overflow-hidden"
        style={{ background: 'rgba(212, 175, 143, 0.18)', border: '1px solid rgba(212, 175, 143, 0.40)' }}
      >
        {organization.logoUrl
          ? <img src={organization.logoUrl} alt={organization.name} className="h-12 w-12 object-contain rounded-lg" />
          : <span className="text-3xl">🏛️</span>
        }
      </div>
      <h3 className="font-bold mb-1 transition-colors" style={{ color: '#2d2416' }}>{organization.name}</h3>
      {organization.description && (
        <p className="text-sm mb-3 line-clamp-2 leading-relaxed font-light" style={{ color: '#5a5246' }}>
          {organization.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(organization.blockchains || []).map(b => (
          <span key={b.name} className="badge-chain">{BLOCKCHAIN_LABELS[b.name] || b.name}</span>
        ))}
      </div>
      <button onClick={e => { e.stopPropagation(); connect() }} className="btn-primary w-full mt-auto">
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
      style={{ borderTop: '1px solid rgba(212, 175, 143, 0.40)' }}
    >
      {/* Star divider */}
      <div className="flex items-center justify-center gap-3 mb-6" style={{ color: 'rgba(212, 175, 143, 0.60)' }}>
        <span className="h-px flex-1 max-w-32" style={{ background: 'rgba(212, 175, 143, 0.40)' }} />
        <StarOfDavid size={16} />
        <span className="h-px flex-1 max-w-32" style={{ background: 'rgba(212, 175, 143, 0.40)' }} />
      </div>

      <p className="text-sm mb-2 max-w-xl mx-auto font-light" style={{ color: '#5a5246' }}>
        <strong style={{ color: '#2d2416', fontWeight: 700 }}>{t('disclaimerLabel')}</strong> {t('disclaimerText')}
      </p>
      <p className="text-sm font-light" style={{ color: 'rgba(90, 82, 70, 0.60)' }}>
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
            className="text-xs font-medium transition-colors"
            style={{ color: 'rgba(90, 82, 70, 0.55)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#8b6f47'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(90, 82, 70, 0.55)'}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        {['🔒 SSL Secured', '✅ On-Chain Verified', '📑 Tax-Compliant'].map(item => (
          <span key={item} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{
            background: 'rgba(212, 175, 143, 0.15)',
            color: '#5a5246',
            border: '1px solid rgba(212, 175, 143, 0.40)',
          }}>
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
              <img
                src="/img2.png"
                alt=""
                className="mx-auto mb-8 rounded-2xl object-cover"
                style={{
                  width: '100%',
                  maxWidth: '720px',
                  height: '260px',
                  border: '2px solid rgba(212, 175, 143, 0.50)',
                  boxShadow: '0 16px 48px rgba(139, 111, 71, 0.16)',
                }}
              />
              <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#2d2416' }}>
                {t('supportedOrgs')}
              </h2>
              <p className="text-sm font-light" style={{ color: '#5a5246' }}>{t('verifiedNonprofits')}</p>
            </div>

            {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}
            {error && <p className="text-center py-16 text-red-600">{t('failedToLoad')}</p>}
            {!loading && !error && organizations.length === 0 && (
              <p className="text-center py-16 font-light" style={{ color: 'rgba(90, 82, 70, 0.55)' }}>{t('noOrgs')}</p>
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
