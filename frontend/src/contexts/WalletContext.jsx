import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const isConnected = !!address

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('No Web3 wallet detected. Please install MetaMask.')
      return false
    }
    setIsConnecting(true)
    setError(null)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
      const addr = accounts[0]
      setAddress(addr)
      setChainId(parseInt(chainIdHex, 16))
      localStorage.setItem('walletAddress', addr)
      return true
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected by user.')
      } else {
        setError('Failed to connect wallet.')
      }
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setChainId(null)
    localStorage.removeItem('walletAddress')
  }, [])

  // Restore connection on mount
  useEffect(() => {
    const saved = localStorage.getItem('walletAddress')
    if (saved && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.includes(saved)) {
          setAddress(saved)
          window.ethereum.request({ method: 'eth_chainId' }).then(hex => {
            setChainId(parseInt(hex, 16))
          })
        } else {
          localStorage.removeItem('walletAddress')
        }
      }).catch(() => {})
    }
  }, [])

  // Listen for wallet events
  useEffect(() => {
    if (!window.ethereum) return

    const onAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
        localStorage.setItem('walletAddress', accounts[0])
      }
    }

    const onChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16))
    }

    window.ethereum.on('accountsChanged', onAccountsChanged)
    window.ethereum.on('chainChanged', onChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged)
      window.ethereum.removeListener('chainChanged', onChainChanged)
    }
  }, [disconnect])

  return (
    <WalletContext.Provider value={{ address, chainId, isConnected, isConnecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
