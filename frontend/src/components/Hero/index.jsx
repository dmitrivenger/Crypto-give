import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden py-24 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-gray-950 to-purple-950/30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 rounded-full px-4 py-2 text-sm text-indigo-300 mb-8">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          On-chain • Transparent • Tax-Compliant
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Donate Crypto,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Get Tax Receipts
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The easiest way to donate cryptocurrency to charitable organizations.
          Every donation is recorded on-chain. Download a tax report in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/donate')}
            className="btn-primary text-lg px-8 py-4"
          >
            Donate Now →
          </button>
          <button
            onClick={() => navigate('/my-donations')}
            className="btn-secondary text-lg px-8 py-4"
          >
            View My Donations
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { label: 'Blockchains', value: '2' },
            { label: 'Tokens', value: '3+' },
            { label: 'Tax Formats', value: 'PDF & CSV' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
