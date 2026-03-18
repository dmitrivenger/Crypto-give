import { useState } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { formatAddress } from '../../utils/formatters'

export default function UserProfileModal() {
  const { address, user, updateUser, setShowProfileModal } = useWallet()
  const { t } = useLanguage()
  const [anonymous, setAnonymous] = useState(false)
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
    if (anonymous) {
      // Close without saving — modal will reappear on next session
      setShowProfileModal(false)
      return
    }
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
    color: '#5a5246',
    marginBottom: '6px',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 36, 22, 0.55)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
          border: '2px solid #d4af8f',
          boxShadow: '0 24px 64px rgba(139, 111, 71, 0.22)',
        }}
      >
        {/* Gold gradient top */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #d4af8f, #8b6f47, #d4af8f)' }} />

        {/* Header */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(212,175,143,0.40)' }}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #d4af8f, #8b6f47)', color: '#ffffff' }}
            >
              👤
            </div>
            <div>
              <h2 className="font-serif text-base font-bold" style={{ color: '#2d2416' }}>{t('completeYourProfile')}</h2>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(90,82,70,0.55)' }}>{formatAddress(address)}</p>
            </div>
          </div>
          <p className="text-sm mt-3 leading-relaxed font-light" style={{ color: '#5a5246' }}>
            {t('profileUsedForTax')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">

          {/* Anonymous checkbox */}
          <label
            className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all"
            style={{
              background: anonymous ? 'rgba(212,175,143,0.20)' : 'rgba(212,175,143,0.08)',
              border: `2px solid ${anonymous ? '#8b6f47' : 'rgba(212,175,143,0.45)'}`,
            }}
          >
            <input
              type="checkbox"
              checked={anonymous}
              onChange={e => { setAnonymous(e.target.checked); setError(null) }}
              className="h-4 w-4 rounded"
              style={{ accentColor: '#8b6f47', cursor: 'pointer' }}
            />
            <div>
              <p className="text-sm font-bold" style={{ color: '#2d2416' }}>Donate Anonymously</p>
              <p className="text-xs font-light" style={{ color: '#5a5246' }}>
                Skip donor details — no personal data will be saved
              </p>
            </div>
          </label>

          {/* Donor fields — dimmed when anonymous */}
          <div style={{ opacity: anonymous ? 0.4 : 1, pointerEvents: anonymous ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>
                  {t('firstName')} <span style={{ color: '#b91c1c' }}>{t('required')}</span>
                </label>
                <input type="text" placeholder="John" value={form.firstName}
                  onChange={e => set('firstName', e.target.value)} className="input" disabled={anonymous} />
              </div>
              <div>
                <label style={labelStyle}>
                  {t('lastName')} <span style={{ color: '#b91c1c' }}>{t('required')}</span>
                </label>
                <input type="text" placeholder="Smith" value={form.lastName}
                  onChange={e => set('lastName', e.target.value)} className="input" disabled={anonymous} />
              </div>
            </div>

            <div className="mt-3">
              <label style={labelStyle}>
                {t('emailAddress')} <span style={{ color: '#b91c1c' }}>{t('required')}</span>
              </label>
              <input type="email" placeholder="john@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} className="input" disabled={anonymous} />
            </div>

            <div className="mt-3">
              <label style={labelStyle}>
                {t('taxNumber')}{' '}
                <span style={{ color: 'rgba(90,82,70,0.50)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  ({t('optional')})
                </span>
              </label>
              <input type="text" placeholder="e.g. 123-45-6789" value={form.taxNumber}
                onChange={e => set('taxNumber', e.target.value)} className="input" disabled={anonymous} />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(254,226,226,0.60)', border: '1px solid rgba(239,68,68,0.30)' }}>
              <span style={{ color: '#b91c1c', flexShrink: 0 }}>⚠</span>
              <p className="text-sm" style={{ color: '#b91c1c' }}>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {anonymous ? 'Close' : saving ? t('saving') : t('saveProfile')}
            </button>
            {!anonymous && (
              <button type="button" onClick={() => setShowProfileModal(false)} className="btn-secondary px-5">
                {t('skip')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
