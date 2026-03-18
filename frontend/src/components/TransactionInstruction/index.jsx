import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../contexts/WalletContext'
import { useDonationContext } from '../../contexts/DonationContext'
import { confirmDonation } from '../../services/api'
import { formatUSD, formatAmount, getTxLink } from '../../utils/formatters'
import { isValidTxHash } from '../../utils/validators'
import { BLOCKCHAIN_LABELS } from '../../utils/constants'
import LoadingSpinner from '../LoadingSpinner'

const EXPIRY_SECONDS = 60 * 60 // 1 hour

const EXPLORER_NAMES = {
  ethereum: 'Etherscan',
  polygon:  'Polygonscan',
  bsc:      'BscScan',
  bitcoin:  'Mempool.space',
  tron:     'Tronscan',
}

function ThankYouModal({ txHash, blockchain, organization, onViewDonations, onDonateAgain }) {
  const txLink = getTxLink(blockchain, txHash)
  const explorerName = EXPLORER_NAMES[blockchain] || 'Explorer'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45, 36, 22, 0.55)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in text-center"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
          border: '2px solid #d4af8f',
          boxShadow: '0 28px 64px rgba(139, 111, 71, 0.25)',
        }}
      >
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #d4af8f, #8b6f47, #d4af8f)' }} />

        <div className="px-8 py-10">
          <div className="text-6xl mb-5">🙏</div>

          <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: '#2d2416' }}>
            Thank You!
          </h2>
          <p className="text-base font-light mb-2" style={{ color: '#5a5246' }}>
            Your donation to <strong style={{ color: '#8b6f47', fontWeight: 700 }}>{organization.name}</strong> has been submitted.
          </p>
          <p className="text-sm font-light mb-6" style={{ color: 'rgba(90, 82, 70, 0.70)' }}>
            It will appear in your history once blockchain confirmation is complete.
          </p>

          {txHash && (
            <div
              className="rounded-xl p-4 mb-6 text-left"
              style={{ background: 'rgba(212, 175, 143, 0.18)', border: '1px solid rgba(212, 175, 143, 0.45)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8b6f47' }}>
                Transaction Hash
              </p>
              <p className="font-mono text-xs break-all mb-3" style={{ color: '#2d2416' }}>{txHash}</p>
              {txLink && (
                <a
                  href={txLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-colors"
                  style={{ color: '#8b6f47' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6b5738'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8b6f47'}
                >
                  View on {explorerName} ↗
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={onViewDonations} className="btn-primary w-full py-3">
              View My Donations
            </button>
            <button onClick={onDonateAgain} className="btn-secondary w-full py-3">
              Donate Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TransactionInstruction({ organization }) {
  const navigate = useNavigate()
  const { address } = useWallet()
  const { initiatedDonation, donationAmount, selectedToken, selectedBlockchain, resetDonation } = useDonationContext()

  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
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
  const previewLink = getTxLink(blockchain, txHash)
  const explorerName = EXPLORER_NAMES[blockchain] || 'Explorer'

  async function copyAddress() {
    await navigator.clipboard.writeText(recipientAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleConfirm() {
    if (!txHash || !isValidTxHash(txHash)) {
      setError('Please enter a valid transaction hash')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await confirmDonation(address, txHash, organization.id, blockchain, token, amount)
      setConfirmedTxHash(txHash)
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
      <ThankYouModal
        txHash={confirmedTxHash}
        blockchain={blockchain}
        organization={organization}
        onViewDonations={() => navigate('/my-donations')}
        onDonateAgain={() => { resetDonation(); navigate(`/donate/${organization.id}`) }}
      />
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Timer */}
      {secondsLeft > 0 ? (
        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#5a5246' }}>
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          Time remaining:{' '}
          <span className="font-mono font-bold" style={{ color: '#2d2416' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      ) : (
        <div className="rounded-xl p-3 text-sm text-center" style={{ background: 'rgba(254,226,226,0.60)', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.30)' }}>
          Session expired. Please go back and start again.
        </div>
      )}

      {/* Recipient address */}
      <div className="card">
        <h3 className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#5a5246', letterSpacing: '0.06em' }}>
          Send {formatAmount(amount, token)} on {BLOCKCHAIN_LABELS[blockchain]}
        </h3>
        <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,143,0.15)', border: '1px solid rgba(212,175,143,0.40)' }}>
          <p className="font-mono text-sm break-all flex-1" style={{ color: '#2d2416' }}>{recipientAddress}</p>
          <button
            onClick={copyAddress}
            className="flex-shrink-0 text-xs rounded-lg px-3 py-1.5 font-bold transition-colors uppercase tracking-wide"
            style={{
              background: copied ? 'rgba(22,101,52,0.12)' : 'rgba(212,175,143,0.25)',
              color: copied ? '#166534' : '#8b6f47',
              border: '1px solid currentColor',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        {amountUsd && (
          <p className="text-center text-sm mt-3 font-light" style={{ color: '#5a5246' }}>
            ≈ <span className="font-bold" style={{ color: '#166534' }}>{formatUSD(amountUsd)}</span> USD
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="card text-sm space-y-2">
        <p className="font-bold mb-3" style={{ color: '#2d2416' }}>How to complete your donation:</p>
        {[
          'Copy the recipient address above',
          `Open your wallet and send exactly ${formatAmount(amount, token)}`,
          'Paste the recipient address',
          'Confirm the transaction in your wallet',
          'Copy the transaction hash and paste it below',
        ].map((step, i) => (
          <div key={i} className="flex gap-3 font-light" style={{ color: '#5a5246' }}>
            <span
              className="flex-shrink-0 h-5 w-5 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: 'rgba(212,175,143,0.25)', color: '#8b6f47', border: '1px solid rgba(212,175,143,0.55)' }}
            >
              {i + 1}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* TX Hash input */}
      <div className="card">
        <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2d2416', letterSpacing: '0.06em' }}>
          Transaction Hash
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={txHash}
          onChange={e => { setTxHash(e.target.value); setError(null) }}
          className="input font-mono text-sm"
        />

        {/* Live explorer preview link */}
        {txHash && isValidTxHash(txHash) && previewLink && (
          <a
            href={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold transition-colors uppercase tracking-wide"
            style={{ color: '#8b6f47' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6b5738'}
            onMouseLeave={e => e.currentTarget.style.color = '#8b6f47'}
          >
            Preview on {explorerName} ↗
          </a>
        )}

        {error && <p className="text-sm mt-2 font-medium" style={{ color: '#b91c1c' }}>{error}</p>}
      </div>

      <button
        onClick={handleConfirm}
        disabled={submitting || secondsLeft === 0}
        className="btn-primary w-full py-4 text-base"
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
        className="w-full text-center text-sm py-2 font-light transition-colors"
        style={{ color: 'rgba(90,82,70,0.55)' }}
        onMouseEnter={e => e.currentTarget.style.color = '#8b6f47'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(90,82,70,0.55)'}
      >
        ← Go back
      </button>
    </div>
  )
}
