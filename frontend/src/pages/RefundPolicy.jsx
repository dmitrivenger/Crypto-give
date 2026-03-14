import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#E2B96F' }}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
        {children}
      </div>
    </div>
  )
}

export default function RefundPolicy() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(201,168,76,0.60)' }}>Legal</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Last updated: March 2026</p>
        </div>

        {/* Key notice banner */}
        <div
          className="rounded-2xl p-5 mb-8 flex gap-4"
          style={{ background: 'rgba(120,53,15,0.30)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-white mb-1">Blockchain transactions are irreversible</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Once a cryptocurrency transaction is confirmed on the blockchain, it cannot be reversed, cancelled, or refunded by CryptoGive or the recipient organization under any circumstances.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Section title="1. No Refunds on Confirmed Transactions">
            <p>CryptoGive facilitates direct peer-to-peer cryptocurrency donations from a donor's wallet to a charitable organization's wallet. We are not a custodian and do not hold or process funds on your behalf.</p>
            <p>As a result, <strong style={{ color: 'rgba(255,255,255,0.80)' }}>we are technically unable to issue refunds</strong> on any confirmed blockchain transaction. This is a fundamental property of blockchain technology, not a policy choice.</p>
          </Section>

          <Section title="2. Why Refunds Are Not Possible">
            <ul className="list-disc pl-5 space-y-1">
              <li>Blockchain transactions are final once confirmed by the network</li>
              <li>CryptoGive does not control or have access to the recipient organization's wallet</li>
              <li>We never hold your funds — money goes directly from your wallet to the charity</li>
              <li>No central authority can reverse a confirmed on-chain transaction</li>
            </ul>
          </Section>

          <Section title="3. Before You Donate — Please Verify">
            <p>To avoid errors, always verify before confirming a transaction:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The recipient organization name and tax ID displayed in the donation modal</li>
              <li>The recipient wallet address shown in the confirmation screen</li>
              <li>The amount and token you are sending</li>
              <li>The correct blockchain network is selected in your wallet</li>
            </ul>
            <p>For manual chains (Bitcoin, Tron), double-check the QR code address before sending from your wallet app.</p>
          </Section>

          <Section title="4. Erroneous Transactions">
            <p>If you believe you made an error (wrong amount, wrong organization), you may contact the recipient organization directly. Resolution is entirely at the discretion of the organization — CryptoGive has no authority to compel any refund or reimbursement.</p>
            <p>If you sent funds to a wallet address not associated with any organization on this Platform, CryptoGive cannot assist in recovery.</p>
          </Section>

          <Section title="5. Failed or Pending Transactions">
            <p>If a transaction fails before being confirmed on-chain, no funds leave your wallet. Gas fees paid for failed EVM transactions may not be recoverable — this is governed by the blockchain network, not CryptoGive.</p>
            <p>If a transaction shows as "pending" for an extended period, it may be due to network congestion. Check your wallet or the relevant blockchain explorer for status.</p>
          </Section>

          <Section title="6. Tax Receipt Corrections">
            <p>If your tax report contains incorrect information due to data you entered in your profile (name, tax number, etc.), you can update your profile and re-download the report. No refund or financial adjustment is involved.</p>
          </Section>

          <Section title="7. Contact">
            <p>If you have a question about a specific transaction or believe there has been a technical error on our part, please contact us through the Platform with your wallet address and transaction hash. We will investigate and respond within 5 business days.</p>
          </Section>
        </div>

        <div className="flex gap-4 mt-8">
          <Link to="/terms" className="btn-secondary text-sm">Terms of Service →</Link>
          <Link to="/privacy" className="btn-secondary text-sm">Privacy Policy →</Link>
          <Link to="/" className="text-sm flex items-center" style={{ color: 'rgba(255,255,255,0.35)' }}>← Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
