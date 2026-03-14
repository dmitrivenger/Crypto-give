import { useState, useCallback } from 'react'
import { getDonations } from '../services/api'

export default function useDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalUsd, setTotalUsd] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const fetchDonations = useCallback(async (walletAddress, filters = {}) => {
    if (!walletAddress) return
    setLoading(true)
    setError(null)
    try {
      const data = await getDonations(walletAddress, filters)
      setDonations(data.donations || [])
      setTotalUsd(data.totalDonations || 0)
      setTotalCount(data.totalCount || 0)
    } catch (err) {
      if (err.code === 'NO_DONATIONS_FOUND') {
        setDonations([])
        setTotalUsd(0)
        setTotalCount(0)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { donations, loading, error, totalUsd, totalCount, fetchDonations }
}
