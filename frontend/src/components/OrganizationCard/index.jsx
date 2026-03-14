import { useNavigate } from 'react-router-dom'
import { BLOCKCHAIN_LABELS } from '../../utils/constants'

export default function OrganizationCard({ organization }) {
  const navigate = useNavigate()
  const { id, name, description, taxId, taxIdCountry, website, blockchains = [] } = organization

  return (
    <div className="card hover:border-indigo-700/50 transition-all duration-200 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="h-12 w-12 rounded-xl bg-indigo-900/50 border border-indigo-800/50 flex items-center justify-center text-2xl flex-shrink-0">
          🏛️
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg">{name}</h3>
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:underline truncate block">
              {website.replace('https://', '')}
            </a>
          )}
        </div>
      </div>

      {description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
      )}

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Tax ID ({taxIdCountry || 'US'})</p>
        <p className="text-sm font-mono text-gray-300">{taxId}</p>
      </div>

      {blockchains.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blockchains.map(b => (
            <span key={b.name} className="badge bg-gray-800 text-gray-300 border border-gray-700">
              {BLOCKCHAIN_LABELS[b.name] || b.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2">
        <button
          onClick={() => navigate(`/donate/${id}`)}
          className="btn-primary w-full"
        >
          Donate Now
        </button>
      </div>
    </div>
  )
}
