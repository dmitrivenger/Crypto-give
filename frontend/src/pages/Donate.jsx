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
        <nav className="text-sm mb-8 flex items-center gap-2" style={{ color: '#5a5246' }}>
          <Link
            to="/"
            className="transition-colors font-medium"
            style={{ color: '#8b6f47' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6b5738'}
            onMouseLeave={e => e.currentTarget.style.color = '#8b6f47'}
          >
            Home
          </Link>
          <span style={{ color: 'rgba(90, 82, 70, 0.45)' }}>›</span>
          <span className="font-light" style={{ color: '#5a5246' }}>{organization?.name || 'Donate'}</span>
        </nav>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="mb-4 font-medium" style={{ color: '#b91c1c' }}>{error}</p>
            <button onClick={() => navigate('/')} className="btn-secondary">← Back to Home</button>
          </div>
        )}

        {!loading && organization && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold font-serif mb-2" style={{ color: '#2d2416' }}>Donate to {organization.name}</h1>
              <p className="font-light" style={{ color: '#5a5246' }}>Your donation will be recorded on the blockchain</p>
            </div>
            <DonationForm organization={organization} />
          </>
        )}
      </main>
    </div>
  )
}
