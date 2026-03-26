import { useState, useEffect, useCallback } from 'react'

const API = `${import.meta.env.VITE_API_URL || '/v1'}/admin`

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(n) || 0)
}

function formatCrypto(n, token) {
  return `${parseFloat(n).toFixed(6)} ${token}`
}

function StatCard({ label, value, sub }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
        border: '2px solid #d4af8f',
        boxShadow: '0 8px 24px rgba(139, 111, 71, 0.10)',
      }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(139,111,71,0.65)' }}>{label}</p>
      <p className="font-serif text-3xl font-bold" style={{ color: '#2d2416' }}>{value}</p>
      {sub && <p className="text-xs mt-1 font-light" style={{ color: '#5a5246' }}>{sub}</p>}
    </div>
  )
}

export default function Admin() {
  const [key, setKey] = useState(() => localStorage.getItem('adminKey') || '')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)

  const [filter, setFilter] = useState({ year: '', month: '', day: '' })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const buildQuery = useCallback((f = filter) => {
    const p = new URLSearchParams()
    if (f.year)  p.set('year',  f.year)
    if (f.month) p.set('month', f.month)
    if (f.day)   p.set('day',   f.day)
    return p.toString()
  }, [filter])

  const fetchStats = useCallback(async (adminKey = key, f = filter) => {
    setLoading(true)
    setError(null)
    try {
      const qs = buildQuery(f)
      const res = await fetch(`${API}/stats${qs ? `?${qs}` : ''}`, {
        headers: { 'X-Admin-Key': adminKey },
      })
      if (res.status === 401) { setAuthError(true); return }
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      setData(json)
      setAuthed(true)
      setAuthError(false)
    } catch {
      setError('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [key, buildQuery, filter])

  async function handleLogin(e) {
    e.preventDefault()
    localStorage.setItem('adminKey', key)
    await fetchStats(key)
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const qs = buildQuery()
      const res = await fetch(`${API}/report${qs ? `?${qs}` : ''}`, {
        headers: { 'X-Admin-Key': key },
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cryptogive-report-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download report')
    } finally {
      setDownloading(false)
    }
  }

  function applyFilter() {
    fetchStats(key, filter)
  }

  function clearFilter() {
    const f = { year: '', month: '', day: '' }
    setFilter(f)
    fetchStats(key, f)
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(180deg, #faf6f0 0%, #f4e8d8 100%)' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
            border: '2px solid #d4af8f',
            boxShadow: '0 24px 64px rgba(139,111,71,0.18)',
          }}
        >
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #d4af8f, #8b6f47, #d4af8f)', borderRadius: '2px', marginBottom: '24px' }} />
          <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: '#2d2416' }}>Admin Panel</h1>
          <p className="text-sm font-light mb-6" style={{ color: '#5a5246' }}>Enter your admin key to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin key"
              value={key}
              onChange={e => { setKey(e.target.value); setAuthError(false) }}
              className="input w-full"
            />
            {authError && (
              <p className="text-sm" style={{ color: '#b91c1c' }}>Invalid admin key</p>
            )}
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const cardStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)',
    border: '2px solid #d4af8f',
    boxShadow: '0 8px 24px rgba(139, 111, 71, 0.10)',
  }

  const thStyle = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#8b6f47',
    borderBottom: '2px solid #d4af8f',
    whiteSpace: 'nowrap',
  }

  const tdStyle = (i) => ({
    padding: '10px 14px',
    fontSize: '13px',
    color: '#2d2416',
    background: i % 2 === 0 ? 'rgba(212,175,143,0.07)' : 'transparent',
    borderBottom: '1px solid rgba(212,175,143,0.25)',
  })

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: 'linear-gradient(180deg, #faf6f0 0%, #f4e8d8 100%)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold" style={{ color: '#2d2416' }}>Admin Dashboard</h1>
            <p className="text-sm font-light mt-1" style={{ color: '#5a5246' }}>CryptoGive donation analytics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary px-5"
            >
              {downloading ? 'Downloading…' : '⬇ Download CSV'}
            </button>
            <button
              onClick={() => { setAuthed(false); localStorage.removeItem('adminKey') }}
              className="btn-secondary px-5"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div
          className="rounded-2xl p-5 mb-8 flex flex-wrap items-end gap-4"
          style={cardStyle}
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: '#5a5246' }}>Year</label>
            <input
              type="number"
              placeholder="e.g. 2025"
              value={filter.year}
              onChange={e => setFilter(f => ({ ...f, year: e.target.value }))}
              className="input"
              style={{ width: '120px' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: '#5a5246' }}>Month</label>
            <select
              value={filter.month}
              onChange={e => setFilter(f => ({ ...f, month: e.target.value }))}
              className="input"
              style={{ width: '140px' }}
            >
              <option value="">All months</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December']
                .map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: '#5a5246' }}>Day</label>
            <input
              type="number"
              placeholder="1–31"
              min="1"
              max="31"
              value={filter.day}
              onChange={e => setFilter(f => ({ ...f, day: e.target.value }))}
              className="input"
              style={{ width: '90px' }}
            />
          </div>
          <button onClick={applyFilter} className="btn-primary px-6">Apply</button>
          <button onClick={clearFilter} className="btn-secondary px-5">Clear</button>
        </div>

        {loading && (
          <p className="text-center py-16 font-light" style={{ color: '#5a5246' }}>Loading…</p>
        )}
        {error && (
          <p className="text-center py-8 text-red-600">{error}</p>
        )}

        {data && !loading && (
          <>
            {/* Overview stat cards */}
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
              <StatCard label="Total Donations" value={data.overview.total_count} />
              <StatCard label="Total Value" value={formatUSD(data.overview.total_usd)} />
              <StatCard label="Unique Donors" value={data.overview.unique_donors} />
            </div>

            {/* By Organization */}
            <div className="rounded-2xl overflow-hidden mb-8" style={cardStyle}>
              <div className="px-6 py-4" style={{ borderBottom: '2px solid #d4af8f' }}>
                <h2 className="font-serif font-bold text-lg" style={{ color: '#2d2416' }}>By Organization</h2>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Organization', 'Tax ID', 'Donations', 'Total USD'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data.byOrg || []).length === 0 ? (
                      <tr><td colSpan={4} style={{ ...tdStyle(0), textAlign: 'center', color: '#5a5246' }}>No data</td></tr>
                    ) : (data.byOrg || []).map((r, i) => (
                      <tr key={r.org_id}>
                        <td style={tdStyle(i)}><span className="font-bold">{r.org_name}</span></td>
                        <td style={tdStyle(i)}>{r.org_tax_id}</td>
                        <td style={tdStyle(i)}>{r.donation_count}</td>
                        <td style={{ ...tdStyle(i), fontWeight: '700', color: '#166534' }}>{formatUSD(r.total_usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* By Crypto Address */}
            <div className="rounded-2xl overflow-hidden" style={cardStyle}>
              <div className="px-6 py-4" style={{ borderBottom: '2px solid #d4af8f' }}>
                <h2 className="font-serif font-bold text-lg" style={{ color: '#2d2416' }}>By Crypto Address</h2>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Organization', 'Blockchain', 'Token', 'Address', 'Donations', 'Total Crypto', 'Total USD'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data.byAddress || []).length === 0 ? (
                      <tr><td colSpan={7} style={{ ...tdStyle(0), textAlign: 'center', color: '#5a5246' }}>No data</td></tr>
                    ) : (data.byAddress || []).map((r, i) => (
                      <tr key={`${r.org_id}-${r.to_address}`}>
                        <td style={tdStyle(i)}>{r.org_name}</td>
                        <td style={tdStyle(i)}><span className="badge-chain">{r.blockchain}</span></td>
                        <td style={{ ...tdStyle(i), fontWeight: '700' }}>{r.token}</td>
                        <td style={tdStyle(i)}>
                          <span className="font-mono text-xs" style={{ color: '#5a5246' }}>
                            {r.to_address.slice(0, 10)}…{r.to_address.slice(-8)}
                          </span>
                        </td>
                        <td style={tdStyle(i)}>{r.donation_count}</td>
                        <td style={tdStyle(i)}>{formatCrypto(r.total_crypto, r.token)}</td>
                        <td style={{ ...tdStyle(i), fontWeight: '700', color: '#166534' }}>{formatUSD(r.total_usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
