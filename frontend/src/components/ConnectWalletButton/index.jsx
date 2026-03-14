import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useWallet } from '../../contexts/WalletContext'
import { formatAddress } from '../../utils/formatters'

export default function ConnectWalletButton() {
  const { address, isConnected, disconnect } = useWallet()
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
      <button onClick={() => open()} className="btn-primary text-sm px-4 py-2">
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setDropdownOpen(o => !o)}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors shadow-sm"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="font-mono text-slate-700 dark:text-slate-200">{formatAddress(address)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 z-50 overflow-hidden py-1">
          <button
            onClick={() => { setDropdownOpen(false); open() }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
          >
            <span className="text-base">🔗</span> Switch Wallet
          </button>
          <button
            onClick={() => { setDropdownOpen(false); navigate('/my-donations') }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
          >
            <span className="text-base">📋</span> My Donations
          </button>
          <div className="divider my-1" />
          <button
            onClick={() => { setDropdownOpen(false); disconnect() }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
          >
            <span className="text-base">🔌</span> Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
