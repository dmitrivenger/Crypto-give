import { useState, useEffect } from 'react'
import { getOrganizations } from '../services/api'

export default function useOrganizations() {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getOrganizations()
      .then(data => { if (!cancelled) setOrganizations(Array.isArray(data) ? data : []) })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { organizations, loading, error }
}
