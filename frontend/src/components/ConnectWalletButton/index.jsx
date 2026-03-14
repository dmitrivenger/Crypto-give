import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../contexts/WalletContext'
import { formatAddress } from '../../utils/formatters'

export default function ConnectWalletButton() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="btn-primary text-sm flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Connecting...
          </>
        ) : (
          <>
            <span>🔗</span> Connect Wallet
          </>
        )}
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-2 text-sm transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="font-mono text-gray-200">{formatAddress(address)}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <button
            onClick={() => { setOpen(false); navigate('/my-donations') }}
            className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2"
          >
            📋 My Donations
          </button>
          <button
            onClick={() => { setOpen(false); disconnect() }}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2 border-t border-gray-700"
          >
            🔌 Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
