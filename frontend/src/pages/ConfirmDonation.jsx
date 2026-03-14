import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import TransactionInstruction from '../components/TransactionInstruction'
import LoadingSpinner from '../components/LoadingSpinner'
import { getOrganizationById } from '../services/api'
import { useDonationContext } from '../contexts/DonationContext'

export default function ConfirmDonation() {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const { initiatedDonation, selectedOrg } = useDonationContext()
  const [organization, setOrganization] = useState(selectedOrg || null)
  const [loading, setLoading] = useState(!selectedOrg)

  useEffect(() => {
    if (!initiatedDonation) {
      navigate(`/donate/${orgId}`)
      return
    }
    if (!selectedOrg) {
      getOrganizationById(orgId)
        .then(setOrganization)
        .catch(() => navigate('/'))
        .finally(() => setLoading(false))
    }
  }, [orgId, initiatedDonation, selectedOrg, navigate])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-sm mb-8 flex items-center gap-2" style={{ color: '#5a5246' }}>
          <Link
            to="/"
            className="font-medium transition-colors"
            style={{ color: '#8b6f47' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6b5738'}
            onMouseLeave={e => e.currentTarget.style.color = '#8b6f47'}
          >
            Home
          </Link>
          <span style={{ color: 'rgba(90, 82, 70, 0.45)' }}>›</span>
          <Link
            to={`/donate/${orgId}`}
            className="font-medium transition-colors"
            style={{ color: '#8b6f47' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6b5738'}
            onMouseLeave={e => e.currentTarget.style.color = '#8b6f47'}
          >
            {organization?.name || 'Donate'}
          </Link>
          <span style={{ color: 'rgba(90, 82, 70, 0.45)' }}>›</span>
          <span className="font-light" style={{ color: '#5a5246' }}>Confirm</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : organization ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold font-serif mb-2" style={{ color: '#2d2416' }}>Send Your Donation</h1>
              <p className="font-light" style={{ color: '#5a5246' }}>Follow the instructions below to complete your donation</p>
            </div>
            <TransactionInstruction organization={organization} />
          </>
        ) : null}
      </main>
    </div>
  )
}
