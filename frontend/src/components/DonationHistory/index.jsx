import { useState, useEffect } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import useDonations from '../../hooks/useDonations'
import useTaxReport from '../../hooks/useTaxReport'
import { formatDate, formatUSD, formatAmount, formatTxHash, getTxLink } from '../../utils/formatters'
import { BLOCKCHAIN_LABELS } from '../../utils/constants'
import LoadingSpinner from '../LoadingSpinner'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)
const STATUS_STYLES = {
  confirmed: 'bg-green-900/50 text-green-400 border-green-800',
  pending: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
  failed: 'bg-red-900/50 text-red-400 border-red-800',
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

  const filteredDonations = donations

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Loading donations..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-white">{totalCount}</p>
          <p className="text-sm text-gray-500">Total Donations</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-400">{formatUSD(totalUsd)}</p>
          <p className="text-sm text-gray-500">Total Value (USD)</p>
        </div>
        <div className="card text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-indigo-400">{year}</p>
          <p className="text-sm text-gray-500">Tax Year</p>
        </div>
      </div>

      {/* Filters & Download */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Year */}
          <select
            value={year}
            onChange={e => setYear(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Status */}
          {['all', 'confirmed', 'pending', 'failed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm capitalize transition-colors ${
                statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}

          {/* Blockchain */}
          <select
            value={blockchainFilter}
            onChange={e => setBlockchainFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
          </select>
        </div>

        {/* Download */}
        <div className="flex gap-2">
          <button
            onClick={() => downloadReport(address, year, 'pdf')}
            disabled={downloading || !donations.length}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            {downloading ? <LoadingSpinner size="sm" /> : '↓'} PDF Report
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

      {downloadError && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-3 text-sm text-red-400">{downloadError}</div>
      )}

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-3 text-sm text-red-400">{error}</div>
      )}

      {/* Table */}
      {filteredDonations.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">No donations found for {year}.</p>
          <p className="text-gray-600 text-sm mt-1">Make a donation to see it appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/50">
                <tr className="text-left text-gray-400">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">USD Value</th>
                  <th className="px-4 py-3 font-medium">Chain</th>
                  <th className="px-4 py-3 font-medium">TX Hash</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDonations.map(d => {
                  const txLink = getTxLink(d.blockchain, d.txHash)
                  return (
                    <tr key={d.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{formatDate(d.date)}</td>
                      <td className="px-4 py-3 text-gray-300">{d.organization}</td>
                      <td className="px-4 py-3 text-gray-200 font-mono whitespace-nowrap">{formatAmount(d.amount, d.token)}</td>
                      <td className="px-4 py-3 text-green-400 whitespace-nowrap">{d.amountUsd ? formatUSD(d.amountUsd) : '—'}</td>
                      <td className="px-4 py-3 text-gray-400">{BLOCKCHAIN_LABELS[d.blockchain] || d.blockchain}</td>
                      <td className="px-4 py-3">
                        {txLink ? (
                          <a href={txLink} target="_blank" rel="noopener noreferrer" className="font-mono text-indigo-400 hover:underline">
                            {formatTxHash(d.txHash)}
                          </a>
                        ) : (
                          <span className="font-mono text-gray-500">{formatTxHash(d.txHash)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge border ${STATUS_STYLES[d.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                          {d.status}
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
