import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../contexts/WalletContext'
import { useDonationContext } from '../../contexts/DonationContext'
import { initiateDonation } from '../../services/api'
import { TOKENS_BY_BLOCKCHAIN, BLOCKCHAIN_LABELS } from '../../utils/constants'

const MIN_DONATION_USD = 1
import { formatUSD, formatAddress } from '../../utils/formatters'
import { isValidAmount } from '../../utils/validators'
import LoadingSpinner from '../LoadingSpinner'

export default function DonationForm({ organization }) {
  const navigate = useNavigate()
  const { address, isConnected, connect } = useWallet()
  const {
    donationAmount, setDonationAmount,
    selectedToken, setSelectedToken,
    selectedBlockchain, setSelectedBlockchain,
    setInitiatedDonation,
  } = useDonationContext()

  const [usdValue, setUsdValue] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const availableTokens = TOKENS_BY_BLOCKCHAIN[selectedBlockchain] || []
  const availableBlockchains = (organization.blockchains || []).map(b => b.name)

  // Reset token when blockchain changes
  useEffect(() => {
    const tokens = TOKENS_BY_BLOCKCHAIN[selectedBlockchain] || []
    if (!tokens.includes(selectedToken)) setSelectedToken(tokens[0] || 'ETH')
  }, [selectedBlockchain, selectedToken, setSelectedToken])

  // Fetch USD value when amount/token changes
  useEffect(() => {
    if (!donationAmount || !isValidAmount(donationAmount)) {
      setUsdValue(null)
      return
    }
    const controller = new AbortController()
    setPriceLoading(true)

    // Use a simple timeout to debounce
    const timer = setTimeout(async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const res = await fetch(`/v1/crypto-price/${selectedToken}/${today}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (data.data?.priceUsd) {
          setUsdValue(parseFloat(donationAmount) * data.data.priceUsd)
        }
      } catch {
        setUsdValue(null)
      } finally {
        setPriceLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      controller.abort()
      setPriceLoading(false)
    }
  }, [donationAmount, selectedToken])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isConnected) {
      await connect()
      return
    }
    if (!isValidAmount(donationAmount)) {
      setError('Please enter a valid amount greater than 0')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const result = await initiateDonation(address, organization.id, donationAmount, selectedToken, selectedBlockchain)
      setInitiatedDonation(result)
      navigate(`/donate/${organization.id}/confirm`)
    } catch (err) {
      setError(err.message || 'Failed to initiate donation. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const recipientAddress = (organization.blockchains || []).find(b => b.name === selectedBlockchain)?.address

  const selectorActive = {
    background: 'linear-gradient(135deg, #d4af8f, #8b6f47)',
    color: '#ffffff',
    border: '2px solid rgba(255,255,255,0.25)',
  }
  const selectorInactive = {
    background: 'rgba(255, 255, 255, 0.70)',
    color: '#5a5246',
    border: '1px solid #d4af8f',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
        border: '2px solid #d4af8f',
        boxShadow: '0 16px 48px rgba(139, 111, 71, 0.14)',
      }}
    >
      {/* Org info */}
      <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(212, 175, 143, 0.40)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(212, 175, 143, 0.20)', border: '1px solid rgba(212, 175, 143, 0.45)' }}
          >
            {organization.logoUrl
              ? <img src={organization.logoUrl} alt={organization.name} className="h-8 w-8 object-contain rounded-lg" />
              : <span className="text-xl">🏛️</span>
            }
          </div>
          <div>
            <h2 className="font-bold" style={{ color: '#2d2416' }}>{organization.name}</h2>
            <p className="text-xs font-light" style={{ color: '#5a5246' }}>Tax ID: {organization.taxId}</p>
          </div>
        </div>
        {recipientAddress && (
          <div className="rounded-lg p-3" style={{ background: 'rgba(212, 175, 143, 0.12)', border: '1px solid rgba(212, 175, 143, 0.35)' }}>
            <p className="text-xs mb-1" style={{ color: '#5a5246' }}>Recipient Address ({BLOCKCHAIN_LABELS[selectedBlockchain]})</p>
            <p className="text-xs font-mono break-all" style={{ color: '#2d2416' }}>{recipientAddress}</p>
          </div>
        )}
      </div>

      {/* Blockchain selector */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2d2416', letterSpacing: '0.06em' }}>Blockchain</label>
        <div className="flex gap-2">
          {availableBlockchains.map(bc => (
            <button
              key={bc}
              type="button"
              onClick={() => setSelectedBlockchain(bc)}
              className="flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all duration-150"
              style={selectedBlockchain === bc ? selectorActive : selectorInactive}
            >
              {BLOCKCHAIN_LABELS[bc] || bc}
            </button>
          ))}
        </div>
      </div>

      {/* Token selector */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2d2416', letterSpacing: '0.06em' }}>Token</label>
        <div className="flex gap-2">
          {availableTokens.map(token => (
            <button
              key={token}
              type="button"
              onClick={() => setSelectedToken(token)}
              className="flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all duration-150"
              style={selectedToken === token ? selectorActive : selectorInactive}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2d2416', letterSpacing: '0.06em' }}>Amount</label>
        <div className="relative">
          <input
            type="number"
            step="any"
            min="0"
            placeholder="0.00"
            value={donationAmount}
            onChange={e => setDonationAmount(e.target.value)}
            className="input pr-16 text-lg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: '#8b6f47' }}>{selectedToken}</span>
        </div>

        {/* USD value */}
        <div className="mt-2 h-5">
          {priceLoading ? (
            <span className="text-xs font-light" style={{ color: '#5a5246' }}>Fetching price...</span>
          ) : usdValue !== null ? (
            <span className={`text-sm font-bold ${usdValue < MIN_DONATION_USD ? 'text-yellow-600' : ''}`}
              style={usdValue >= MIN_DONATION_USD ? { color: '#2d7a3a' } : {}}>
              ≈ {formatUSD(usdValue)}
              {usdValue < MIN_DONATION_USD && ' (below $1 minimum)'}
            </span>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl p-3 text-sm" style={{ background: 'rgba(254, 226, 226, 0.60)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !isValidAmount(donationAmount)}
        className="btn-primary w-full text-base py-4"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" /> Processing...
          </span>
        ) : !isConnected ? (
          'Connect Wallet to Donate'
        ) : (
          'Review Donation →'
        )}
      </button>

      <p className="text-xs text-center mt-4 font-light" style={{ color: 'rgba(90, 82, 70, 0.60)' }}>
        🔒 No personal information is stored. Only your wallet address is recorded on-chain.
      </p>
    </form>
  )
}
