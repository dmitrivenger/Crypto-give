import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ConnectWalletButton from '../ConnectWalletButton'
import { useLanguage } from '../../contexts/LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'he', label: 'עברית',   short: 'HE' },
  { code: 'fr', label: 'Français',short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'es', label: 'Español', short: 'ES' },
]

function StarOfDavid({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 115" fill="currentColor">
      <polygon points="50,5 95,82 5,82" fillOpacity="0.85" />
      <polygon points="50,110 5,33 95,33" fillOpacity="0.85" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const { lang, setLang, t } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  const navLink = (to, label) => (
    <Link
      to={to}
      className="text-sm font-medium transition-colors duration-150"
      style={{ color: pathname === to ? '#E2B96F' : 'rgba(255,255,255,0.55)' }}
      onMouseEnter={e => { if (pathname !== to) e.currentTarget.style.color = 'rgba(226,185,111,0.85)' }}
      onMouseLeave={e => { if (pathname !== to) e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
    >
      {label}
    </Link>
  )

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(10,13,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #A87A2D, #E2B96F)', color: '#0D1117' }}
          >
            <StarOfDavid size={16} />
          </div>
          <span className="font-bold text-base tracking-tight">
            <span className="text-white">Crypto</span>
            <span style={{ color: '#E2B96F' }}>Give</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLink('/', t('home'))}
          {navLink('/my-donations', t('myDonations'))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5">

          {/* Language picker */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="btn-ghost text-xs gap-1.5 px-2.5 py-2"
              style={{ color: langOpen ? '#E2B96F' : undefined }}
            >
              <GlobeIcon />
              <span className="font-semibold hidden sm:inline">{currentLang.short}</span>
            </button>

            {langOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-2xl z-50 overflow-hidden animate-scale-in"
                style={{
                  background: '#161B27',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                }}
              >
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{
                      background: lang === l.code ? 'rgba(201,168,76,0.10)' : 'transparent',
                      color: lang === l.code ? '#E2B96F' : 'rgba(255,255,255,0.65)',
                    }}
                    onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span className="text-xs font-bold w-6 text-center opacity-60">{l.short}</span>
                    <span className={lang === l.code ? 'font-semibold' : ''}>{l.label}</span>
                    {lang === l.code && <span className="ml-auto" style={{ color: '#E2B96F' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.10)' }} />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
