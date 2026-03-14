import { useState } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { formatAddress } from '../../utils/formatters'

export default function UserProfileModal() {
  const { address, user, updateUser, setShowProfileModal } = useWallet()
  const { t } = useLanguage()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    taxNumber: user?.taxNumber || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

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

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.10em',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '6px',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: '#161B27', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 80px rgba(0,0,0,0.75)' }}
      >
        {/* Gold gradient top */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #A87A2D, #E2B96F, #F5D78E, #E2B96F, #A87A2D)' }} />

        {/* Header */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #A87A2D, #E2B96F)', color: '#0D1117' }}
            >
              👤
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-white">{t('completeYourProfile')}</h2>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>{formatAddress(address)}</p>
            </div>
          </div>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>
            {t('profileUsedForTax')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>
                {t('firstName')} <span style={{ color: '#fca5a5' }}>{t('required')}</span>
              </label>
              <input type="text" placeholder="John" value={form.firstName}
                onChange={e => set('firstName', e.target.value)} className="input" />
            </div>
            <div>
              <label style={labelStyle}>
                {t('lastName')} <span style={{ color: '#fca5a5' }}>{t('required')}</span>
              </label>
              <input type="text" placeholder="Smith" value={form.lastName}
                onChange={e => set('lastName', e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              {t('emailAddress')} <span style={{ color: '#fca5a5' }}>{t('required')}</span>
            </label>
            <input type="email" placeholder="john@example.com" value={form.email}
              onChange={e => set('email', e.target.value)} className="input" />
          </div>

          <div>
            <label style={labelStyle}>
              {t('taxNumber')}{' '}
              <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                ({t('optional')})
              </span>
            </label>
            <input type="text" placeholder="e.g. 123-45-6789" value={form.taxNumber}
              onChange={e => set('taxNumber', e.target.value)} className="input" />
          </div>

          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(127,29,29,0.35)', border: '1px solid rgba(239,68,68,0.30)' }}
            >
              <span style={{ color: '#fca5a5', flexShrink: 0 }}>⚠</span>
              <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
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
