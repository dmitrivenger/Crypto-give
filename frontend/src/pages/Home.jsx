import Header from '../components/Header'
import Hero from '../components/Hero'
import FAQ from '../components/FAQ'
import LoadingSpinner from '../components/LoadingSpinner'
import useOrganizations from '../hooks/useOrganizations'
import { useWallet } from '../contexts/WalletContext'
import { BLOCKCHAIN_LABELS } from '../utils/constants'

function HowItWorks() {
  const steps = [
    { icon: '🔗', title: 'Connect Wallet', desc: 'Connect any Web3 wallet — MetaMask, Trust Wallet, Coinbase. No account needed.' },
    { icon: '💸', title: 'Send Crypto', desc: 'Choose an organization, pick your token, and donate in a single tap.' },
    { icon: '📄', title: 'Get Tax Receipt', desc: 'Download a PDF or CSV tax report with USD valuations for your accountant.' },
  ]
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-2xl mx-auto mb-4">
                {step.icon}
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">0{i + 1}</span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OrgPreviewCard({ organization }) {
  const { connect } = useWallet()
  return (
    <div className="card-hover flex flex-col">
      <div className="h-16 w-full rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mb-4 text-3xl">
        🏛️
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{organization.name}</h3>
      {organization.description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">{organization.description}</p>
      )}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(organization.blockchains || []).map(b => (
          <span key={b.name} className="badge-chain">{BLOCKCHAIN_LABELS[b.name] || b.name}</span>
        ))}
      </div>
      <button onClick={connect} className="btn-primary w-full mt-auto">
        Connect to Donate →
      </button>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 py-8 px-4 text-center text-sm text-slate-400 dark:text-slate-600">
      <p className="mb-2 max-w-xl mx-auto">
        <strong className="text-slate-500 dark:text-slate-500">Disclaimer:</strong> This platform provides tax documentation for informational purposes only. Not tax advice.
      </p>
      <p>© {new Date().getFullYear()} CryptoGive. All rights reserved.</p>
    </footer>
  )
}

export default function Home() {
  const { organizations, loading, error } = useOrganizations()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a]">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />

        {/* Organizations */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Supported Organizations</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm text-center mb-12">All organizations are verified 501(c)(3) nonprofits</p>

            {loading && <div className="flex justify-center py-12"><LoadingSpinner /></div>}
            {error && <p className="text-center py-12 text-red-500 dark:text-red-400">Failed to load organizations.</p>}
            {!loading && !error && organizations.length === 0 && (
              <p className="text-center py-12 text-slate-400 dark:text-slate-600">No organizations available.</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {organizations.map(org => (
                <OrgPreviewCard key={org.id} organization={org} />
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
