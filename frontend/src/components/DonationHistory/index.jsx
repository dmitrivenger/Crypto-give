import { useState, useEffect } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import useDonations from '../../hooks/useDonations'
import useTaxReport from '../../hooks/useTaxReport'
import { formatDate, formatUSD, formatAmount, formatTxHash, getTxLink } from '../../utils/formatters'
import { BLOCKCHAIN_LABELS } from '../../utils/constants'
import LoadingSpinner from '../LoadingSpinner'
import { useLanguage } from '../../contexts/LanguageContext'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

export default function DonationHistory() {
  const { address } = useWallet()
  const { donations, loading, error, totalUsd, totalCount, fetchDonations } = useDonations()
  const { downloading, error: downloadError, downloadReport } = useTaxReport()
  const { t } = useLanguage()

  const STATUS = {
    confirmed: { label: t('statusConfirmed'), bg: 'rgba(22,101,52,0.12)',  color: '#166534', border: 'rgba(22,101,52,0.25)' },
    pending:   { label: t('statusPending'),   bg: 'rgba(120,53,15,0.12)',  color: '#92400e', border: 'rgba(120,53,15,0.25)' },
    failed:    { label: t('statusFailed'),    bg: 'rgba(127,29,29,0.12)',  color: '#991b1b', border: 'rgba(127,29,29,0.25)' },
  }

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
    background: 'rgba(255, 255, 255, 0.80)',
    border: '2px solid #d4af8f',
    color: '#2d2416',
    borderRadius: '12px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    outline: 'none',
  }

  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('totalDonations'), value: totalCount, color: '#8b6f47' },
          { label: t('totalValueUsd'),  value: formatUSD(totalUsd), color: '#166534' },
          { label: t('taxYear'),        value: year, color: '#8b6f47' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 text-center"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
              border: '2px solid #d4af8f',
              boxShadow: '0 8px 24px rgba(139, 111, 71, 0.10)',
            }}
          >
            <p className="text-2xl font-bold font-serif" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1 font-light" style={{ color: '#5a5246' }}>{stat.label}</p>
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
            {[
              { key: 'all',       label: t('filterAll') },
              { key: 'confirmed', label: t('filterConfirmed') },
              { key: 'pending',   label: t('filterPending') },
              { key: 'failed',    label: t('filterFailed') },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 uppercase tracking-wide"
                style={{
                  background: statusFilter === s.key ? 'linear-gradient(135deg, #d4af8f, #8b6f47)' : 'rgba(255,255,255,0.80)',
                  color: statusFilter === s.key ? '#ffffff' : '#5a5246',
                  border: statusFilter === s.key ? '2px solid rgba(255,255,255,0.25)' : '1px solid #d4af8f',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <select value={blockchainFilter} onChange={e => setBlockchainFilter(e.target.value)} style={inputStyle}>
            <option value="all">{t('allChains')}</option>
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
        <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(254, 226, 226, 0.60)', color: '#b91c1c', border: '1px solid rgba(239, 68, 68, 0.30)' }}>
          {downloadError || error}
        </div>
      )}

      {/* Table */}
      {donations.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
            border: '2px solid #d4af8f',
          }}
        >
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold" style={{ color: '#2d2416' }}>{t('noDonationsFound')} {year}.</p>
          <p className="text-sm mt-1 font-light" style={{ color: '#5a5246' }}>{t('makeDonationPrompt')}</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
            border: '2px solid #d4af8f',
            boxShadow: '0 12px 36px rgba(139, 111, 71, 0.10)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(212, 175, 143, 0.20)', borderBottom: '2px solid #d4af8f' }}>
                  {[t('colDate'), t('colOrganization'), t('colAmount'), t('colUsdValue'), t('colChain'), t('colTxHash'), t('colStatus')].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-[11px] uppercase tracking-widest" style={{ color: '#2d2416' }}>
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
                      style={{ borderBottom: i < donations.length - 1 ? '1px solid rgba(212, 175, 143, 0.30)' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(212, 175, 143, 0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-light" style={{ color: '#5a5246' }}>{formatDate(d.date)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#2d2416' }}>{d.organization}</td>
                      <td className="px-4 py-3 font-mono whitespace-nowrap font-bold" style={{ color: '#2d2416' }}>{formatAmount(d.amount, d.token)}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold" style={{ color: '#166534' }}>{d.amountUsd ? formatUSD(d.amountUsd) : '—'}</td>
                      <td className="px-4 py-3 font-light" style={{ color: '#5a5246' }}>{BLOCKCHAIN_LABELS[d.blockchain] || d.blockchain}</td>
                      <td className="px-4 py-3">
                        {txLink
                          ? <a href={txLink} target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-bold hover:underline" style={{ color: '#8b6f47' }}>{formatTxHash(d.txHash)}</a>
                          : <span className="font-mono text-xs font-light" style={{ color: 'rgba(90, 82, 70, 0.50)' }}>{formatTxHash(d.txHash)}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                          style={{ background: s?.bg || 'rgba(212, 175, 143, 0.15)', color: s?.color || '#5a5246', border: `1px solid ${s?.border || 'rgba(212, 175, 143, 0.40)'}` }}
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
