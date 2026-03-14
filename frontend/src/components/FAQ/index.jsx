import { useState } from 'react'

const FAQS = [
  {
    q: 'What cryptocurrencies can I donate?',
    a: 'We currently support ETH and USDC on Ethereum, and MATIC and USDC on Polygon. More tokens will be added in future updates.',
  },
  {
    q: 'Is my donation tax-deductible?',
    a: 'Donations to 501(c)(3) organizations like Chabad may be tax-deductible. We provide documentation of your donation, but please consult a qualified tax professional to confirm deductibility in your jurisdiction.',
  },
  {
    q: 'What wallets are supported?',
    a: 'Any browser-based Web3 wallet works, including MetaMask, Coinbase Wallet, Brave Wallet, and more. Connect using your existing wallet — no new accounts needed.',
  },
  {
    q: 'How is the USD value calculated?',
    a: 'We use historical closing prices from CoinGecko for the date of each confirmed transaction. This is the standard method used for crypto tax calculations.',
  },
  {
    q: 'What is in the tax report?',
    a: 'The PDF report includes your wallet address, each donation with date and amount, USD valuations at time of transaction, organization name and tax ID, and a total summary. It is designed to share with your tax accountant.',
  },
  {
    q: 'How long does it take for a donation to be confirmed?',
    a: 'Ethereum transactions typically confirm in 2-5 minutes (requires 12 block confirmations). Polygon transactions are faster, usually under a minute.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{faq.q}</h3>
                <span className={`text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}>▾</span>
              </div>
              {open === i && (
                <p className="mt-3 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
