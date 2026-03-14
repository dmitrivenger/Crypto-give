import { Link, useLocation } from 'react-router-dom'
import ConnectWalletButton from '../ConnectWalletButton'

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <span className="text-2xl">₿</span>
          <span className="text-indigo-400">Crypto</span>Give
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors ${pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Home
          </Link>
          <Link
            to="/my-donations"
            className={`transition-colors ${pathname === '/my-donations' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            My Donations
          </Link>
        </nav>

        <ConnectWalletButton />
      </div>
    </header>
  )
}
