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

function DataRow({ label, value }) {
  return (
    <div className="flex gap-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="w-40 flex-shrink-0 font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.50)' }}>{value}</span>
    </div>
  )
}

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(201,168,76,0.60)' }}>Legal</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Last updated: March 2026</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Section title="1. Overview">
            <p>CryptoGive is committed to protecting your privacy. This policy explains what personal data we collect, why we collect it, and your rights regarding that data.</p>
            <p>We collect only the minimum data necessary to provide donation documentation and tax reporting services. We do not sell your data to third parties.</p>
          </Section>

          <Section title="2. Data We Collect">
            <p>The following data is collected when you use the Platform:</p>

            <div className="rounded-xl overflow-hidden mt-2" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <DataRow label="Wallet Address" value="Collected automatically when you connect your wallet. Publicly visible on the blockchain." />
              <DataRow label="First & Last Name" value="Provided voluntarily by you during profile setup. Used for tax receipt personalisation." />
              <DataRow label="Email Address" value="Provided voluntarily. Used to identify your account and may be used for donation confirmations." />
              <DataRow label="Tax Number" value="Provided voluntarily. Stored securely and included in your tax reports only." />
              <DataRow label="Donation Records" value="Transaction hash, amount, token, blockchain, timestamp, and organization. Derived from on-chain data." />
              <DataRow label="IP Address / Device" value="Logged by our server infrastructure for security and abuse prevention. Not linked to your identity." />
            </div>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1">
              <li>To generate personalised PDF and CSV tax reports</li>
              <li>To display your donation history within the Platform</li>
              <li>To associate donations with your profile for record-keeping</li>
              <li>To detect and prevent fraudulent or abusive activity</li>
            </ul>
            <p>We do <strong style={{ color: 'rgba(255,255,255,0.80)' }}>not</strong> use your data for advertising, profiling, or sale to third parties.</p>
          </Section>

          <Section title="4. Data Storage & Security">
            <p>Your profile data is stored in a hosted PostgreSQL database (Supabase) with encryption at rest. Wallet addresses, names, emails, and tax numbers are stored securely and accessible only through authenticated API calls.</p>
            <p>Blockchain transaction data is publicly available on-chain and is not exclusively held by us.</p>
          </Section>

          <Section title="5. Third-Party Services">
            <p>The Platform uses the following third-party services that may process data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>WalletConnect</strong> — facilitates wallet connections. Subject to WalletConnect's own privacy policy.</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Blockchain Networks</strong> — Ethereum, Polygon, BNB Chain, Bitcoin, Tron. Transaction data is permanently public.</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>CoinGecko</strong> — used to fetch historical crypto prices for USD valuation in tax reports. No personal data is shared.</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Google Fonts</strong> — fonts loaded from Google servers. May log your IP address.</li>
            </ul>
          </Section>

          <Section title="6. Your Rights (GDPR & CCPA)">
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Correction</strong> — update inaccurate data via your profile settings</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Deletion</strong> — delete your account and all associated profile data using the "Delete Account" button in your dashboard. Note: on-chain transaction data cannot be deleted as it is permanently recorded on public blockchains.</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Portability</strong> — export your donation data via the CSV download feature</li>
              <li><strong style={{ color: 'rgba(255,255,255,0.75)' }}>Objection</strong> — object to processing of your personal data</li>
            </ul>
            <p>To exercise any of these rights, please contact us through the Platform or use the self-service tools available in your dashboard.</p>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain your profile data for as long as your account exists. If you delete your account, your profile data (name, email, tax number) is permanently deleted from our database within 30 days.</p>
            <p>Donation records tied to your wallet address may be retained for legal and tax compliance purposes for up to 7 years, as required by applicable law.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>The Platform is not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, please contact us immediately.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify users of material changes by updating the "Last updated" date at the top of this page. Your continued use of the Platform constitutes acceptance of the revised policy.</p>
          </Section>

          <Section title="10. Contact">
            <p>For any privacy-related questions or to exercise your rights, please contact us through the Platform.</p>
          </Section>
        </div>

        <div className="flex gap-4 mt-8">
          <Link to="/terms" className="btn-secondary text-sm">Terms of Service →</Link>
          <Link to="/refund-policy" className="btn-secondary text-sm">Refund Policy →</Link>
          <Link to="/" className="text-sm flex items-center" style={{ color: 'rgba(255,255,255,0.35)' }}>← Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
