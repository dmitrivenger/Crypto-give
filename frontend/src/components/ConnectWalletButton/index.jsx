import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { formatAddress } from '../../utils/formatters'

export default function ConnectWalletButton() {
  const { address, isConnected, disconnect } = useWallet()
  const { t } = useLanguage()
  const { open } = useWeb3Modal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!isConnected) {
    return (
      <button onClick={() => open()} className="btn-primary btn-gold-shimmer text-sm px-4 py-2">
        {t('connectWalletBtn') || 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setDropdownOpen(o => !o)}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200"
        style={{
          background: 'rgba(42,53,96,0.70)',
          border: '1px solid rgba(201,168,76,0.30)',
          color: '#E2B96F',
        }}
      >
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: '#4ade80' }} />
        <span className="font-mono">{formatAddress(address)}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl z-50 overflow-hidden animate-scale-in"
          style={{
            background: '#161B27',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          }}
        >
          <div className="py-1.5">
            <button
              onClick={() => { setDropdownOpen(false); open() }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-base">🔗</span> Switch Wallet
            </button>
            <button
              onClick={() => { setDropdownOpen(false); navigate('/my-donations') }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-base">📋</span> {t('myDonations')}
            </button>
            <div className="divider mx-3" />
            <button
              onClick={() => { setDropdownOpen(false); disconnect() }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
              style={{ color: '#fca5a5' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-base">🔌</span> Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
