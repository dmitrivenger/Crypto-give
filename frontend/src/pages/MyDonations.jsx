import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import DonationHistory from '../components/DonationHistory'
import { useWallet } from '../contexts/WalletContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function MyDonations() {
  const { address, isConnected, connect } = useWallet()
  const navigate = useNavigate()
  const { t } = useLanguage()

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-5xl mb-6">🔒</div>
          <h1 className="font-serif text-3xl font-bold text-white mb-4">{t('connectYourWallet')}</h1>
          <p className="mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>{t('connectToViewHistory')}</p>
          <button onClick={connect} className="btn-primary btn-gold-shimmer text-base px-8 py-4">
            {t('connectWalletBtn')}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">{t('myDonationsTitle')}</h1>
            <p className="text-sm font-mono mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{address}</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary text-sm py-2 px-5">
            {t('makeADonation')}
          </button>
        </div>
        <DonationHistory />
      </main>
    </div>
  )
}
