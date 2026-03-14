import { createContext, useContext, useState, useCallback } from 'react'

const DonationContext = createContext(null)

export function DonationProvider({ children }) {
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum')
  const [currentDonationId, setCurrentDonationId] = useState(null)
  const [initiatedDonation, setInitiatedDonation] = useState(null)

  const resetDonation = useCallback(() => {
    setDonationAmount('')
    setSelectedToken('ETH')
    setSelectedBlockchain('ethereum')
    setCurrentDonationId(null)
    setInitiatedDonation(null)
  }, [])

  return (
    <DonationContext.Provider value={{
      selectedOrg, setSelectedOrg,
      donationAmount, setDonationAmount,
      selectedToken, setSelectedToken,
      selectedBlockchain, setSelectedBlockchain,
      currentDonationId, setCurrentDonationId,
      initiatedDonation, setInitiatedDonation,
      resetDonation,
    }}>
      {children}
    </DonationContext.Provider>
  )
}

export function useDonationContext() {
  const ctx = useContext(DonationContext)
  if (!ctx) throw new Error('useDonationContext must be used within DonationProvider')
  return ctx
}
