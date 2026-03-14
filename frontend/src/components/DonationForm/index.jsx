import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../contexts/WalletContext'
import { useDonationContext } from '../../contexts/DonationContext'
import { initiateDonation } from '../../services/api'
import { TOKENS_BY_BLOCKCHAIN, BLOCKCHAIN_LABELS, MIN_DONATION_USD } from '../../utils/constants'
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

  return (
    <form onSubmit={handleSubmit} className="card max-w-lg mx-auto">
      {/* Org info */}
      <div className="mb-6 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-900/50 border border-indigo-800/50 flex items-center justify-center text-xl">🏛️</div>
          <div>
            <h2 className="font-bold text-white">{organization.name}</h2>
            <p className="text-xs text-gray-500">Tax ID: {organization.taxId}</p>
          </div>
        </div>
        {recipientAddress && (
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Recipient Address ({BLOCKCHAIN_LABELS[selectedBlockchain]})</p>
            <p className="text-xs font-mono text-gray-300 break-all">{recipientAddress}</p>
          </div>
        )}
      </div>

      {/* Blockchain selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Blockchain</label>
        <div className="flex gap-2">
          {availableBlockchains.map(bc => (
            <button
              key={bc}
              type="button"
              onClick={() => setSelectedBlockchain(bc)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                selectedBlockchain === bc
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {BLOCKCHAIN_LABELS[bc] || bc}
            </button>
          ))}
        </div>
      </div>

      {/* Token selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Token</label>
        <div className="flex gap-2">
          {availableTokens.map(token => (
            <button
              key={token}
              type="button"
              onClick={() => setSelectedToken(token)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                selectedToken === token
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
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
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{selectedToken}</span>
        </div>

        {/* USD value */}
        <div className="mt-2 h-5">
          {priceLoading ? (
            <span className="text-xs text-gray-500">Fetching price...</span>
          ) : usdValue !== null ? (
            <span className={`text-sm font-medium ${usdValue < MIN_DONATION_USD ? 'text-yellow-400' : 'text-green-400'}`}>
              ≈ {formatUSD(usdValue)}
              {usdValue < MIN_DONATION_USD && ' (below $1 minimum)'}
            </span>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-950/50 border border-red-800 rounded-xl p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !isValidAmount(donationAmount)}
        className="btn-primary w-full text-lg py-4"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" /> Processing...
          </span>
        ) : !isConnected ? (
          'Connect Wallet to Donate'
        ) : (
          `Review Donation →`
        )}
      </button>

      <p className="text-xs text-gray-600 text-center mt-4">
        🔒 No personal information is stored. Only your wallet address is recorded on-chain.
      </p>
    </form>
  )
}
