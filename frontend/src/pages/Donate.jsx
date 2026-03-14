import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import DonationForm from '../components/DonationForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { getOrganizationById } from '../services/api'
import { useDonationContext } from '../contexts/DonationContext'

export default function Donate() {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const { setSelectedOrg } = useDonationContext()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getOrganizationById(orgId)
      .then(org => {
        setOrganization(org)
        setSelectedOrg(org)
      })
      .catch(() => setError('Organization not found'))
      .finally(() => setLoading(false))
  }, [orgId, setSelectedOrg])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-300">{organization?.name || 'Donate'}</span>
        </nav>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => navigate('/')} className="btn-secondary">← Back to Home</button>
          </div>
        )}

        {!loading && organization && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Donate to {organization.name}</h1>
              <p className="text-gray-400">Your donation will be recorded on the blockchain</p>
            </div>
            <DonationForm organization={organization} />
          </>
        )}
      </main>
    </div>
  )
}
