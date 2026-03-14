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

// ── Delete confirm ────────────────────────────────────────────────────────────
function DeleteConfirmModal({ onConfirm, onCancel, deleting, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl shadow-black/20 p-7 text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('deleteConfirmTitle')}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{t('deleteConfirmText')}</p>
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

// ── Profile card ──────────────────────────────────────────────────────────────
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Gradient top strip */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Avatar + identity */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-indigo-500/30">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {fullName || formatAddress(address)}
              </h2>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">{address}</p>
              {memberDate && (
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">{t('memberSince')} {memberDate}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button onClick={onEdit}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-colors">
              ✏️ {t('editProfile')}
            </button>
            <button onClick={onDelete}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 transition-colors">
              🗑️ {t('deleteAccount')}
            </button>
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="section-label mb-1">{t('email')}</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
              {user?.email || <span className="text-slate-400 dark:text-slate-600 font-normal">{t('notProvided')}</span>}
            </p>
          </div>
          <div>
            <p className="section-label mb-1">{t('taxNumberLabel')}</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.taxNumber || <span className="text-slate-400 dark:text-slate-600 font-normal">{t('notProvided')}</span>}
            </p>
          </div>
          <div>
            <p className="section-label mb-1">{t('profile')}</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              user?.profileComplete
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {user?.profileComplete ? t('profileComplete') : t('profileIncomplete')}
            </span>
          </div>
          <div>
            <p className="section-label mb-1">{t('taxReports')}</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('taxFormats')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Org tile ──────────────────────────────────────────────────────────────────
function OrgTile({ organization, onDonate, t }) {
  return (
    <div className="card-hover flex flex-col group cursor-pointer" onClick={() => onDonate(organization)}>
      {/* Logo area */}
      <div className="h-20 w-full rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mb-5 text-4xl group-hover:scale-105 transition-transform duration-200">
        🏛️
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {organization.name}
        </h3>
        {organization.description && (
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">{organization.description}</p>
        )}

        <div className="mb-3">
          <p className="section-label mb-1">501(c)(3) {t('taxId')}</p>
          <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{organization.taxId}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {(organization.blockchains || []).map(b => (
            <span key={b.name} className="badge-chain">{BLOCKCHAIN_LABELS[b.name] || b.name}</span>
          ))}
        </div>

        <button
          className="btn-primary w-full mt-auto group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-shadow"
          onClick={e => { e.stopPropagation(); onDonate(organization) }}
        >
          {t('donate')} →
        </button>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
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
    try {
      await deleteAccount()
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('welcomeBack')},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {firstName}
            </span>{' '}
            👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5">{t('chooseOrg')}</p>
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('organizations')}</h2>
          <Link to="/my-donations" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors">
            {t('viewMyDonations')}
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading organizations..." />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500 dark:text-red-400">{t('failedToLoad')}</div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.map(org => (
            <OrgTile key={org.id} organization={org} onDonate={setSelectedOrg} t={t} />
          ))}
        </div>

        {!loading && !error && organizations.length === 0 && (
          <div className="text-center py-20 text-slate-400 dark:text-slate-600">{t('noOrgs')}</div>
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
