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

function IconWallet() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Blockchain nodes */}
      <circle cx="16" cy="6" r="3" fill="currentColor" fillOpacity="0.15" />
      <circle cx="6" cy="22" r="3" fill="currentColor" fillOpacity="0.15" />
      <circle cx="26" cy="22" r="3" fill="currentColor" fillOpacity="0.15" />
      <circle cx="16" cy="6" r="3" />
      <circle cx="6" cy="22" r="3" />
      <circle cx="26" cy="22" r="3" />
      {/* Links between nodes */}
      <line x1="16" y1="9" x2="6" y2="19" />
      <line x1="16" y1="9" x2="26" y2="19" />
      <line x1="9" y1="22" x2="23" y2="22" />
      {/* Wallet card */}
      <rect x="10" y="26" width="12" height="4" rx="1.5" strokeWidth="1.4" />
      <line x1="14" y1="28" x2="18" y2="28" strokeWidth="1.4" />
    </svg>
  )
}

function IconCrypto() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Main coin */}
      <circle cx="16" cy="16" r="9" fill="currentColor" fillOpacity="0.10" />
      <circle cx="16" cy="16" r="9" />
      {/* Bitcoin B symbol */}
      <path d="M14 11.5h4a2.5 2.5 0 0 1 0 5h-4M14 16.5h4.5a2.5 2.5 0 0 1 0 5H14" strokeWidth="1.6" />
      <line x1="14" y1="11.5" x2="14" y2="21.5" strokeWidth="1.6" />
      <line x1="15.5" y1="10" x2="15.5" y2="11.5" strokeWidth="1.6" />
      <line x1="15.5" y1="21.5" x2="15.5" y2="23" strokeWidth="1.6" />
      {/* Small orbiting coins */}
      <circle cx="5" cy="10" r="2.5" fill="currentColor" fillOpacity="0.10" />
      <circle cx="5" cy="10" r="2.5" strokeWidth="1.4" />
      <line x1="5" y1="8.2" x2="5" y2="11.8" strokeWidth="1.2" />
      <circle cx="27" cy="22" r="2.5" fill="currentColor" fillOpacity="0.10" />
      <circle cx="27" cy="22" r="2.5" strokeWidth="1.4" />
      <line x1="27" y1="20.2" x2="27" y2="23.8" strokeWidth="1.2" />
    </svg>
  )
}

function IconTaxReport() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Document */}
      <rect x="6" y="3" width="16" height="22" rx="2" fill="currentColor" fillOpacity="0.10" />
      <rect x="6" y="3" width="16" height="22" rx="2" />
      {/* Folded corner */}
      <path d="M18 3 L22 7" />
      <path d="M18 3 v4 h4" strokeWidth="1.4" />
      {/* Dollar sign circle */}
      <circle cx="14" cy="15" r="4.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="14" cy="15" r="4.5" strokeWidth="1.5" />
      <path d="M14 11.5v7M12.2 13.2a1.8 1.8 0 0 1 3.6 0c0 1-1.8 1.8-1.8 1.8s-1.8.8-1.8 1.8a1.8 1.8 0 0 0 3.6 0" strokeWidth="1.4" />
      {/* Lines at bottom */}
      <line x1="9" y1="23" x2="19" y2="23" strokeWidth="1.3" />
    </svg>
  )
}

function HowItWorks() {
  const { t } = useLanguage()
  const steps = [
    { icon: <IconWallet />, titleKey: 'step1Title', descKey: 'step1Desc', num: '01' },
    { icon: <IconCrypto />, titleKey: 'step2Title', descKey: 'step2Desc', num: '02' },
    { icon: <IconTaxReport />, titleKey: 'step3Title', descKey: 'step3Desc', num: '03' },
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
                style={{ background: 'rgba(212, 175, 143, 0.20)', border: '2px solid rgba(212, 175, 143, 0.50)', color: '#8b6f47' }}
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
