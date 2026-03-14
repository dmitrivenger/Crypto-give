import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const { t } = useLanguage()

  const faqs = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
    { q: t('faq6q'), a: t('faq6a') },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="star-divider text-xs">
          <svg width="14" height="16" viewBox="0 0 100 115" fill="currentColor">
            <polygon points="50,5 95,82 5,82" /><polygon points="50,110 5,33 95,33" />
          </svg>
        </div>

        <h2 className="font-serif text-3xl font-bold text-center mb-12" style={{ color: '#F5D78E' }}>
          {t('faqTitle')}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                background: open === i ? 'rgba(42,53,96,0.45)' : '#1E2435',
                border: open === i ? '1px solid rgba(201,168,76,0.30)' : '1px solid rgba(255,255,255,0.07)',
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="font-semibold text-sm pr-4" style={{ color: open === i ? '#E2B96F' : 'rgba(255,255,255,0.85)' }}>
                  {faq.q}
                </h3>
                <span
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: open === i ? '#E2B96F' : 'rgba(255,255,255,0.30)',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  ▾
                </span>
              </div>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
