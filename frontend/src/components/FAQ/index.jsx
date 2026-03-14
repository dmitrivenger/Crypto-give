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

        <h2 className="font-serif text-3xl font-bold text-center mb-12" style={{ color: '#2d2416' }}>
          {t('faqTitle')}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                background: open === i
                  ? 'linear-gradient(135deg, #ffffff 0%, #f4e8d8 100%)'
                  : 'rgba(255, 255, 255, 0.70)',
                border: open === i ? '2px solid #8b6f47' : '2px solid #d4af8f',
                boxShadow: open === i ? '0 8px 24px rgba(139, 111, 71, 0.14)' : 'none',
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="font-bold text-sm pr-4" style={{ color: open === i ? '#8b6f47' : '#2d2416' }}>
                  {faq.q}
                </h3>
                <span
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: open === i ? '#8b6f47' : 'rgba(90, 82, 70, 0.45)',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  ▾
                </span>
              </div>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed font-light" style={{ color: '#5a5246' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
