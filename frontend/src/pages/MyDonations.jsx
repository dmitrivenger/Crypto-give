import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import DonationHistory from '../components/DonationHistory'
import { useWallet } from '../contexts/WalletContext'
import { formatAddress } from '../utils/formatters'

export default function MyDonations() {
  const { address, isConnected, connect } = useWallet()
  const navigate = useNavigate()

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to view your donation history and download tax reports.
          </p>
          <button onClick={connect} className="btn-primary text-lg px-8 py-4">
            🔗 Connect Wallet
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Donations</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">{address}</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary text-sm py-2 px-4">
            + Make a Donation
          </button>
        </div>

        <DonationHistory />
      </main>
    </div>
  )
}
