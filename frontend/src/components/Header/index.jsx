import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ConnectWalletButton from '../ConnectWalletButton'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'English',  short: 'EN' },
  { code: 'he', label: 'עברית',    short: 'HE' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch',  short: 'DE' },
  { code: 'es', label: 'Español',  short: 'ES' },
]

function GlobeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
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
    <Link to={to} className={`text-sm font-medium transition-colors ${
      pathname === to
        ? 'text-slate-900 dark:text-white'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
    }`}>
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/80"
      style={{ backgroundColor: 'rgb(var(--header-bg, 255 255 255) / 0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">₿</div>
          <span className="text-slate-900 dark:text-white">Crypto<span className="text-indigo-600 dark:text-indigo-400">Give</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLink('/', t('home'))}
          {navLink('/my-donations', t('myDonations'))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Theme */}
          <button onClick={toggleTheme} className="btn-ghost" title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Language */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setLangOpen(o => !o)} className="btn-ghost" title="Language">
              <GlobeIcon />
              <span className="text-xs font-semibold hidden sm:inline">{currentLang.short}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden z-50">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                      ${lang === l.code
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <span className="text-xs font-bold w-6 text-center text-slate-500 dark:text-slate-400">{l.short}</span>
                    <span>{l.label}</span>
                    {lang === l.code && <span className="ml-auto text-indigo-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
