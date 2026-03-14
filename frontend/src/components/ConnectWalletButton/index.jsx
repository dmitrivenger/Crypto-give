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
        className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200"
        style={{
          background: 'rgba(212, 175, 143, 0.20)',
          border: '2px solid #d4af8f',
          color: '#8b6f47',
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
            background: '#faf6f0',
            border: '2px solid #d4af8f',
            boxShadow: '0 16px 48px rgba(139, 111, 71, 0.20)',
          }}
        >
          <div className="py-1.5">
            <button
              onClick={() => { setDropdownOpen(false); open() }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
              style={{ color: '#5a5246' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212, 175, 143, 0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-base">🔗</span> Switch Wallet
            </button>
            <button
              onClick={() => { setDropdownOpen(false); navigate('/my-donations') }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
              style={{ color: '#5a5246' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212, 175, 143, 0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-base">📋</span> {t('myDonations')}
            </button>
            <div className="divider mx-3" />
            <button
              onClick={() => { setDropdownOpen(false); disconnect() }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
              style={{ color: '#b91c1c' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
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
