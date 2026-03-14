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
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>›</span>
          <Link to={`/donate/${orgId}`} className="hover:text-gray-300 transition-colors">
            {organization?.name || 'Donate'}
          </Link>
          <span>›</span>
          <span className="text-gray-300">Confirm</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : organization ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Send Your Donation</h1>
              <p className="text-gray-400">Follow the instructions below to complete your donation</p>
            </div>
            <TransactionInstruction organization={organization} />
          </>
        ) : null}
      </main>
    </div>
  )
}
