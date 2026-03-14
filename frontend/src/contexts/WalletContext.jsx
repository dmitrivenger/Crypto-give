import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { getUser, saveUser, deleteUser } from '../services/api'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { open } = useWeb3Modal()

  const [isConnecting, setIsConnecting] = useState(false)
  const [user, setUser] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  async function loadUser(addr) {
    try {
      const data = await getUser(addr)
      setUser(data)
      if (!data.profileComplete) setShowProfileModal(true)
    } catch (err) {
      if (err.status === 404 || err.code === 'USER_NOT_FOUND') {
        const created = await saveUser(addr, {})
        setUser(created)
        setShowProfileModal(true)
      }
    }
  }

  // Load user profile whenever address changes
  useEffect(() => {
    if (address) {
      localStorage.setItem('walletAddress', address)
      loadUser(address)
    } else {
      setUser(null)
      setShowProfileModal(false)
      localStorage.removeItem('walletAddress')
    }
  }, [address])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await open()
    } finally {
      setIsConnecting(false)
    }
  }, [open])

  const disconnect = useCallback(() => {
    wagmiDisconnect()
  }, [wagmiDisconnect])

  const updateUser = useCallback(async (profile) => {
    if (!address) return
    const updated = await saveUser(address, profile)
    setUser(updated)
    return updated
  }, [address])

  const deleteAccount = useCallback(async () => {
    if (!address) return
    await deleteUser(address)
    setUser(null)
    wagmiDisconnect()
  }, [address, wagmiDisconnect])

  return (
    <WalletContext.Provider value={{
      address,
      chainId,
      isConnected,
      isConnecting,
      user,
      showProfileModal,
      setShowProfileModal,
      connect,
      disconnect,
      updateUser,
      deleteAccount,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
