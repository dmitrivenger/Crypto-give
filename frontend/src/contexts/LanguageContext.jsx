import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../locales/translations'

const RTL_LANGS = ['he']

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
  }, [lang])

  function t(key) {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: RTL_LANGS.includes(lang) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
