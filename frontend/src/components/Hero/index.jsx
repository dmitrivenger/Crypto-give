import { useWallet } from '../../contexts/WalletContext'

export default function Hero() {
  const { connect } = useWallet()

  return (
    <section className="relative overflow-hidden py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 dark:from-indigo-950/30 dark:via-[#080d1a] dark:to-purple-950/20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/8 dark:bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-500/6 dark:bg-purple-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/50 rounded-full px-4 py-1.5 text-sm text-indigo-700 dark:text-indigo-300 mb-8 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          On-chain · Transparent · Tax-Compliant
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          Donate Crypto,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Get Tax Receipts
          </span>
        </h1>

        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The easiest way to donate cryptocurrency to charitable organizations.
          Every donation is recorded on-chain. Download a tax report in seconds.
        </p>

        <button onClick={connect} className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-indigo-500/25">
          Connect Wallet & Donate →
        </button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[
            { value: '3', label: 'Blockchains' },
            { value: '5+', label: 'Tokens' },
            { value: 'PDF & CSV', label: 'Tax Formats' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
