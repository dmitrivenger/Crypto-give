import { useState, useEffect } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import useDonations from '../../hooks/useDonations'
import useTaxReport from '../../hooks/useTaxReport'
import { formatDate, formatUSD, formatAmount, formatTxHash, getTxLink } from '../../utils/formatters'
import { BLOCKCHAIN_LABELS } from '../../utils/constants'
import LoadingSpinner from '../LoadingSpinner'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

const STATUS = {
  confirmed: { label: 'Confirmed', bg: 'rgba(22,101,52,0.40)', color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  pending:   { label: 'Pending',   bg: 'rgba(120,53,15,0.40)',  color: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  failed:    { label: 'Failed',    bg: 'rgba(127,29,29,0.40)',  color: '#fca5a5', border: 'rgba(252,165,165,0.25)' },
}

export default function DonationHistory() {
  const { address } = useWallet()
  const { donations, loading, error, totalUsd, totalCount, fetchDonations } = useDonations()
  const { downloading, error: downloadError, downloadReport } = useTaxReport()

  const [year, setYear] = useState(CURRENT_YEAR)
  const [statusFilter, setStatusFilter] = useState('all')
  const [blockchainFilter, setBlockchainFilter] = useState('all')

  useEffect(() => {
    if (address) {
      const filters = {}
      if (year) filters.year = year
      if (blockchainFilter !== 'all') filters.blockchain = blockchainFilter
      if (statusFilter !== 'all') filters.status = statusFilter
      fetchDonations(address, filters)
    }
  }, [address, year, statusFilter, blockchainFilter, fetchDonations])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
  }

  const inputStyle = {
    background: '#1E2435',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.75)',
    borderRadius: '12px',
    padding: '8px 14px',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Donations', value: totalCount, color: '#E2B96F' },
          { label: 'Total Value (USD)', value: formatUSD(totalUsd), color: '#4ade80' },
          { label: 'Tax Year', value: year, color: '#E2B96F' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 text-center"
            style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-2xl font-bold font-serif" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Download */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} style={inputStyle}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <div className="flex gap-1">
            {['all', 'confirmed', 'pending', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-150"
                style={{
                  background: statusFilter === s ? 'linear-gradient(135deg, #C9A84C, #E2B96F)' : '#1E2435',
                  color: statusFilter === s ? '#0D1117' : 'rgba(255,255,255,0.50)',
                  border: statusFilter === s ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <select value={blockchainFilter} onChange={e => setBlockchainFilter(e.target.value)} style={inputStyle}>
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="bsc">BNB Chain</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="tron">Tron</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadReport(address, year, 'pdf')}
            disabled={downloading || !donations.length}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            {downloading ? <LoadingSpinner size="sm" /> : '↓'} PDF
          </button>
          <button
            onClick={() => downloadReport(address, year, 'csv')}
            disabled={downloading || !donations.length}
            className="btn-secondary text-sm py-2 px-4"
          >
            ↓ CSV
          </button>
        </div>
      </div>

      {(downloadError || error) && (
        <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(127,29,29,0.35)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}>
          {downloadError || error}
        </div>
      )}

      {/* Table */}
      {donations.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium" style={{ color: 'rgba(255,255,255,0.50)' }}>No donations found for {year}.</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Make a donation to see it appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Date', 'Organization', 'Amount', 'USD Value', 'Chain', 'TX Hash', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.30)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => {
                  const txLink = getTxLink(d.blockchain, d.txHash)
                  const s = STATUS[d.status]
                  return (
                    <tr
                      key={d.id}
                      className="transition-colors"
                      style={{ borderBottom: i < donations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.55)' }}>{formatDate(d.date)}</td>
                      <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.75)' }}>{d.organization}</td>
                      <td className="px-4 py-3 font-mono whitespace-nowrap text-white">{formatAmount(d.amount, d.token)}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#4ade80' }}>{d.amountUsd ? formatUSD(d.amountUsd) : '—'}</td>
                      <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{BLOCKCHAIN_LABELS[d.blockchain] || d.blockchain}</td>
                      <td className="px-4 py-3">
                        {txLink
                          ? <a href={txLink} target="_blank" rel="noopener noreferrer" className="font-mono text-xs hover:underline" style={{ color: '#E2B96F' }}>{formatTxHash(d.txHash)}</a>
                          : <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{formatTxHash(d.txHash)}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: s?.bg || 'rgba(255,255,255,0.08)', color: s?.color || 'rgba(255,255,255,0.50)', border: `1px solid ${s?.border || 'rgba(255,255,255,0.15)'}` }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {s?.label || d.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
