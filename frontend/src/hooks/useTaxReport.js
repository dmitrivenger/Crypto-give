import { useState, useCallback } from 'react'
import { downloadTaxReport } from '../services/api'

export default function useTaxReport() {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const downloadReport = useCallback(async (walletAddress, year, format = 'pdf') => {
    setDownloading(true)
    setError(null)
    try {
      const data = await downloadTaxReport(walletAddress, year, format)
      const filename = `tax_report_${walletAddress.slice(0, 10)}_${year}.${format}`

      if (format === 'pdf') {
        const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const url = URL.createObjectURL(new Blob([data], { type: 'text/csv' }))
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setDownloading(false)
    }
  }, [])

  return { downloading, error, downloadReport }
}
