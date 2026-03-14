import { useState, useCallback } from 'react'
import { getUser, saveUser } from '../services/api'

export default function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUser = useCallback(async (walletAddress) => {
    setLoading(true)
    try {
      const data = await getUser(walletAddress)
      setUser(data)
      return data
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        // Create empty user record
        const created = await saveUser(walletAddress, {})
        setUser(created)
        return created
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (walletAddress, profile) => {
    const updated = await saveUser(walletAddress, profile)
    setUser(updated)
    return updated
  }, [])

  return { user, loading, fetchUser, updateUser, setUser }
}
