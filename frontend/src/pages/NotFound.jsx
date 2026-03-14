import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <p className="text-8xl font-bold text-gray-800 mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
          <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">← Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
