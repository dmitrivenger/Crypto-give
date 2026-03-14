import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/v1'

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach wallet address header to every request if present
client.interceptors.request.use(config => {
  const wallet = localStorage.getItem('walletAddress')
  if (wallet) config.headers['X-Wallet-Address'] = wallet
  return config
})

client.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'An error occurred'
    const code = err.response?.data?.code || 'NETWORK_ERROR'
    const error = new Error(message)
    error.code = code
    error.status = err.response?.status
    error.data = err.response?.data
    throw error
  }
)

export async function getOrganizations() {
  const res = await client.get('/organizations')
  return res.data.data
}

export async function getOrganizationById(id) {
  const res = await client.get(`/organizations/${id}`)
  return res.data.data
}

export async function initiateDonation(walletAddress, orgId, amount, token, blockchain) {
  const res = await client.post('/donations/initiate', { orgId, amount, token, blockchain }, {
    headers: { 'X-Wallet-Address': walletAddress },
  })
  return res.data.data
}

export async function confirmDonation(walletAddress, txHash, orgId, blockchain, token, amount) {
  const res = await client.post('/donations/confirm', { txHash, orgId, blockchain, token, amount }, {
    headers: { 'X-Wallet-Address': walletAddress },
  })
  return res.data.data
}

export async function getDonations(walletAddress, filters = {}) {
  const params = {}
  if (filters.year) params.year = filters.year
  if (filters.orgId) params.orgId = filters.orgId
  if (filters.blockchain) params.blockchain = filters.blockchain
  if (filters.status) params.status = filters.status

  const res = await client.get(`/donations/${walletAddress}`, { params })
  return res.data.data
}

export async function downloadTaxReport(walletAddress, year, format = 'pdf') {
  const res = await client.get(`/tax-report/${walletAddress}`, {
    params: { year, format },
    responseType: format === 'pdf' ? 'blob' : 'text',
  })
  return res.data
}

export async function getHealth() {
  const res = await client.get('/health')
  return res.data
}
