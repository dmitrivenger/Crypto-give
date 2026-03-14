import { useState } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { formatAddress } from '../../utils/formatters'

export default function UserProfileModal() {
  const { address, user, updateUser, setShowProfileModal } = useWallet()
  const { t } = useLanguage()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    taxNumber: user?.taxNumber || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email) {
      setError(t('firstNameRequired'))
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateUser(form)
      setShowProfileModal(false)
    } catch {
      setError(t('failedToSave'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-black/20 overflow-hidden">
        {/* Top gradient */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-500/30">
              👤
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('completeYourProfile')}</h2>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{formatAddress(address)}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{t('profileUsedForTax')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                {t('firstName')} <span className="text-red-500">{t('required')}</span>
              </label>
              <input type="text" placeholder="John" value={form.firstName}
                onChange={e => set('firstName', e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                {t('lastName')} <span className="text-red-500">{t('required')}</span>
              </label>
              <input type="text" placeholder="Smith" value={form.lastName}
                onChange={e => set('lastName', e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t('emailAddress')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input type="email" placeholder="john@example.com" value={form.email}
              onChange={e => set('email', e.target.value)} className="input" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t('taxNumber')} <span className="text-slate-400 dark:text-slate-600 normal-case font-normal">({t('optional')})</span>
            </label>
            <input type="text" placeholder="e.g. 123-45-6789" value={form.taxNumber}
              onChange={e => set('taxNumber', e.target.value)} className="input" />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <span className="text-red-500 text-sm flex-shrink-0">⚠</span>
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? t('saving') : t('saveProfile')}
            </button>
            <button type="button" onClick={() => setShowProfileModal(false)} className="btn-secondary px-5">
              {t('skip')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
