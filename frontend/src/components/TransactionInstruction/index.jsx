import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../contexts/WalletContext'
import { useDonationContext } from '../../contexts/DonationContext'
import { confirmDonation } from '../../services/api'
import { formatUSD, formatAmount } from '../../utils/formatters'
import { isValidTxHash } from '../../utils/validators'
import { BLOCKCHAIN_LABELS } from '../../utils/constants'
import LoadingSpinner from '../LoadingSpinner'

const EXPIRY_SECONDS = 60 * 60 // 1 hour

export default function TransactionInstruction({ organization }) {
  const navigate = useNavigate()
  const { address } = useWallet()
  const { initiatedDonation, donationAmount, selectedToken, selectedBlockchain, resetDonation } = useDonationContext()

  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const recipientAddress = initiatedDonation?.recipientAddress
  const amount = initiatedDonation?.amount || donationAmount
  const token = initiatedDonation?.token || selectedToken
  const blockchain = initiatedDonation?.blockchain || selectedBlockchain
  const amountUsd = initiatedDonation?.amountUsd

  async function copyAddress() {
    await navigator.clipboard.writeText(recipientAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleConfirm() {
    if (!txHash || !isValidTxHash(txHash)) {
      setError('Please enter a valid transaction hash (0x + 64 hex characters)')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await confirmDonation(address, txHash, organization.id, blockchain, token, amount)
      setConfirmed(true)
    } catch (err) {
      setError(err.message || 'Failed to submit transaction. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  if (confirmed) {
    return (
      <div className="card max-w-lg mx-auto text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-3">Donation Submitted!</h2>
        <p className="text-gray-400 mb-2">
          Your transaction has been submitted for verification. It will be confirmed once{' '}
          {blockchain === 'ethereum' ? '12 block confirmations' : '128 block confirmations'} are reached.
        </p>
        <p className="text-sm text-gray-500 mb-8">This typically takes {blockchain === 'ethereum' ? '2–5 minutes' : 'under a minute'}.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/my-donations')} className="btn-primary">View My Donations</button>
          <button onClick={() => { resetDonation(); navigate(`/donate/${organization.id}`) }} className="btn-secondary">Donate Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Timer */}
      {secondsLeft > 0 ? (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          Time remaining: <span className="font-mono text-white">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      ) : (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-3 text-sm text-red-400 text-center">
          Session expired. Please go back and start again.
        </div>
      )}

      {/* Recipient address */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          Send {formatAmount(amount, token)} to this address on {BLOCKCHAIN_LABELS[blockchain]}
        </h3>
        <div className="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
          <p className="font-mono text-gray-200 text-sm break-all flex-1">{recipientAddress}</p>
          <button
            onClick={copyAddress}
            className="flex-shrink-0 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-1.5 text-gray-300 transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        {amountUsd && (
          <p className="text-center text-sm text-gray-400 mt-3">
            ≈ <span className="text-green-400 font-medium">{formatUSD(amountUsd)}</span> USD
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="card text-sm text-gray-400 space-y-2">
        <p className="font-medium text-white mb-3">How to complete your donation:</p>
        {[
          'Copy the recipient address above',
          `Open your wallet and send exactly ${formatAmount(amount, token)}`,
          'Paste the recipient address',
          'Confirm the transaction in your wallet',
          'Copy the transaction hash and paste it below',
        ].map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-900 text-indigo-300 text-xs flex items-center justify-center font-bold">{i + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* TX Hash input */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Transaction Hash <span className="text-gray-600">(optional but recommended)</span>
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={txHash}
          onChange={e => { setTxHash(e.target.value); setError(null) }}
          className="input font-mono text-sm"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <button
        onClick={handleConfirm}
        disabled={submitting || secondsLeft === 0}
        className="btn-primary w-full py-4 text-lg"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" /> Submitting...
          </span>
        ) : (
          "I've Sent the Transaction ✓"
        )}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors py-2"
      >
        ← Go back
      </button>
    </div>
  )
}
