import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import DonationModal from '../components/DonationModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { useWallet } from '../contexts/WalletContext'
import { useLanguage } from '../contexts/LanguageContext'
import useOrganizations from '../hooks/useOrganizations'
import { BLOCKCHAIN_LABELS } from '../utils/constants'
import { formatAddress } from '../utils/formatters'

function StarOfDavid({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 115" fill="currentColor">
      <polygon points="50,5 95,82 5,82" /><polygon points="50,110 5,33 95,33" />
    </svg>
  )
}

function DeleteConfirmModal({ onConfirm, onCancel, deleting, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-dark w-full max-w-sm p-7 text-center animate-scale-in">
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
          style={{ background: 'rgba(127,29,29,0.40)', border: '1px solid rgba(239,68,68,0.30)' }}
        >⚠️</div>
        <h3 className="font-serif text-lg font-bold text-white mb-2">{t('deleteConfirmTitle')}</h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{t('deleteConfirmText')}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={deleting} className="btn-secondary flex-1">{t('cancel')}</button>
          <button onClick={onConfirm} disabled={deleting} className="btn-danger flex-1">
            {deleting ? t('deleting') : t('deleteConfirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ user, address, onEdit, onDelete, t }) {
  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || null

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : null

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : address?.slice(2, 4).toUpperCase() || '??'

  return (
    <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Gold top strip */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #A87A2D, #E2B96F, #F5D78E, #E2B96F, #A87A2D)' }} />

      <div className="p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Avatar + identity */}
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #A87A2D, #E2B96F)', color: '#0D1117', boxShadow: '0 0 16px rgba(201,168,76,0.30)' }}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white leading-tight">
                {fullName || formatAddress(address)}
              </h2>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{address}</p>
              {memberDate && (
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.30)' }}>{t('memberSince')} {memberDate}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(42,53,96,0.70)', color: '#E2B96F', border: '1px solid rgba(201,168,76,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.50)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}
            >
              ✏️ {t('editProfile')}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(127,29,29,0.35)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.50)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'}
            >
              🗑️ {t('deleteAccount')}
            </button>
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { label: t('email'), value: user?.email },
            { label: t('taxNumberLabel'), value: user?.taxNumber },
            {
              label: t('profile'),
              custom: (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: user?.profileComplete ? 'rgba(22,101,52,0.40)' : 'rgba(120,53,15,0.40)',
                    color: user?.profileComplete ? '#4ade80' : '#fbbf24',
                    border: `1px solid ${user?.profileComplete ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {user?.profileComplete ? t('profileComplete') : t('profileIncomplete')}
                </span>
              ),
            },
            { label: t('taxReports'), value: t('taxFormats') },
          ].map((item, i) => (
            <div key={i}>
              <p className="section-label mb-1.5">{item.label}</p>
              {item.custom
                ? item.custom
                : <p className="text-sm font-medium" style={{ color: item.value ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.25)' }}>
                    {item.value || t('notProvided')}
                  </p>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrgTile({ organization, onDonate, t }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col cursor-pointer group transition-all duration-200"
      style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => onDonate(organization)}
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
        className="h-20 w-full rounded-xl flex items-center justify-center mb-4 text-4xl"
        style={{ background: 'linear-gradient(135deg, rgba(42,53,96,0.80), rgba(26,32,80,0.60))', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        🏛️
      </div>

      <h3 className="font-bold font-serif text-white mb-1 group-hover:text-[#E2B96F] transition-colors">
        {organization.name}
      </h3>
      {organization.description && (
        <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {organization.description}
        </p>
      )}

      <div className="mb-2">
        <p className="section-label mb-1">501(c)(3) {t('taxId')}</p>
        <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>{organization.taxId}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5 mt-2">
        {(organization.blockchains || []).map(b => (
          <span key={b.name} className="badge-chain">{BLOCKCHAIN_LABELS[b.name] || b.name}</span>
        ))}
      </div>

      <button
        className="btn-primary w-full mt-auto"
        onClick={e => { e.stopPropagation(); onDonate(organization) }}
      >
        {t('donate')} →
      </button>
    </div>
  )
}

export default function Dashboard() {
  const { address, user, setShowProfileModal, deleteAccount } = useWallet()
  const { t } = useLanguage()
  const { organizations, loading, error } = useOrganizations()
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const firstName = user?.firstName || formatAddress(address)

  async function handleDeleteAccount() {
    setDeleting(true)
    try { await deleteAccount() }
    finally { setDeleting(false); setShowDeleteConfirm(false) }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Greeting */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ color: 'rgba(201,168,76,0.40)' }}>
              <StarOfDavid size={18} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {t('welcomeBack')},{' '}
              <span className="text-gold">{firstName}</span>
            </h1>
            <span className="text-2xl">שָׁלוֹם</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('chooseOrg')}</p>
        </div>

        {/* Profile card */}
        <ProfileCard
          user={user}
          address={address}
          onEdit={() => setShowProfileModal(true)}
          onDelete={() => setShowDeleteConfirm(true)}
          t={t}
        />

        {/* Orgs header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg font-bold" style={{ color: '#F5D78E' }}>{t('organizations')}</h2>
          <Link
            to="/my-donations"
            className="text-sm font-medium transition-colors"
            style={{ color: 'rgba(201,168,76,0.65)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#E2B96F'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,168,76,0.65)'}
          >
            {t('viewMyDonations')}
          </Link>
        </div>

        {loading && <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}
        {error && <div className="text-center py-20 text-red-400">{t('failedToLoad')}</div>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.map(org => (
            <OrgTile key={org.id} organization={org} onDonate={setSelectedOrg} t={t} />
          ))}
        </div>

        {!loading && !error && organizations.length === 0 && (
          <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.30)' }}>{t('noOrgs')}</div>
        )}
      </main>

      {selectedOrg && <DonationModal organization={selectedOrg} onClose={() => setSelectedOrg(null)} />}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          deleting={deleting}
          t={t}
        />
      )}
    </div>
  )
}
