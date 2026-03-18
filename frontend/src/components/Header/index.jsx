import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ConnectWalletButton from '../ConnectWalletButton'
import { useLanguage } from '../../contexts/LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'English',  short: 'EN' },
  { code: 'ru', label: 'Русский',  short: 'RU' },
  { code: 'he', label: 'עברית',    short: 'HE' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch',  short: 'DE' },
  { code: 'es', label: 'Español',  short: 'ES' },
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
      className="text-sm font-bold uppercase tracking-wide transition-all duration-150"
      style={{
        color: pathname === to ? '#8b6f47' : '#5a5246',
        borderBottom: pathname === to ? '2px solid #8b6f47' : '2px solid transparent',
        paddingBottom: '2px',
        letterSpacing: '0.08em',
      }}
      onMouseEnter={e => { if (pathname !== to) e.currentTarget.style.color = '#8b6f47' }}
      onMouseLeave={e => { if (pathname !== to) e.currentTarget.style.color = '#5a5246' }}
    >
      {label}
    </Link>
  )

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(250, 246, 240, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '2px solid #d4af8f',
        boxShadow: '0 8px 24px rgba(139, 111, 71, 0.12)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/img3.png"
            alt="CryptoGive"
            className="h-9 w-9 rounded-xl object-cover flex-shrink-0"
            style={{ boxShadow: '0 6px 16px rgba(139, 111, 71, 0.30)' }}
          />
          <span className="font-serif font-bold text-base tracking-tight" style={{ color: '#2d2416' }}>
            Crypto<span style={{ color: '#8b6f47' }}>Give</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-8">
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
              style={{ color: langOpen ? '#8b6f47' : '#5a5246' }}
            >
              <GlobeIcon />
              <span className="font-bold hidden sm:inline" style={{ letterSpacing: '0.05em' }}>{currentLang.short}</span>
            </button>

            {langOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-2xl z-50 overflow-hidden animate-scale-in"
                style={{
                  background: '#faf6f0',
                  border: '2px solid #d4af8f',
                  boxShadow: '0 16px 48px rgba(139, 111, 71, 0.20)',
                }}
              >
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{
                      background: lang === l.code ? 'rgba(212, 175, 143, 0.25)' : 'transparent',
                      color: lang === l.code ? '#8b6f47' : '#5a5246',
                    }}
                    onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(212, 175, 143, 0.12)' }}
                    onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span className="text-xs font-bold w-6 text-center" style={{ opacity: 0.55 }}>{l.short}</span>
                    <span className={lang === l.code ? 'font-bold' : ''}>{l.label}</span>
                    {lang === l.code && <span className="ml-auto" style={{ color: '#8b6f47' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 mx-1" style={{ background: 'rgba(212, 175, 143, 0.50)' }} />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
