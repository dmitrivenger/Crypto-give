import Header from '../components/Header'
import Hero from '../components/Hero'
import OrganizationCard from '../components/OrganizationCard'
import FAQ from '../components/FAQ'
import LoadingSpinner from '../components/LoadingSpinner'
import useOrganizations from '../hooks/useOrganizations'

function HowItWorks() {
  const steps = [
    { icon: '🔗', title: 'Connect Wallet', desc: 'Connect any Web3 wallet — MetaMask, Coinbase, Brave. No account needed.' },
    { icon: '💸', title: 'Send Crypto', desc: 'Choose an organization, enter an amount, and send from your wallet.' },
    { icon: '📄', title: 'Download Tax Report', desc: 'Get a PDF tax receipt with USD valuations for your accountant.' },
  ]

  return (
    <section className="py-16 px-4 bg-gray-900/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="h-0.5 w-8 bg-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8 px-4 text-center text-sm text-gray-600">
      <p className="mb-2">
        <strong className="text-gray-400">Disclaimer:</strong> This platform provides tax documentation for informational purposes only.
        It is not tax advice. Consult a qualified tax professional.
      </p>
      <p>© {new Date().getFullYear()} CryptoGive. All rights reserved.</p>
    </footer>
  )
}

export default function Home() {
  const { organizations, loading, error } = useOrganizations()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />

        {/* Organizations */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Supported Organizations</h2>
            <p className="text-gray-400 text-center mb-12">All organizations have verified 501(c)(3) status</p>

            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading organizations..." />
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-400">
                Failed to load organizations. Please refresh the page.
              </div>
            )}

            {!loading && !error && organizations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No organizations available at this time.
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map(org => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
