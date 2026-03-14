/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0D1117',
          900: '#161B27',
          800: '#1E2435',
          700: '#252D42',
          600: '#2E3A5E',
        },
        violet: {
          950: '#1A2050',
          900: '#2A3560',
          800: '#3B4A8A',
          700: '#4D5FA3',
        },
        gold: {
          100: '#FDF5DC',
          200: '#FAE8A8',
          300: '#F5D78E',
          400: '#E2B96F',
          500: '#C9A84C',
          600: '#A87A2D',
          700: '#8A5E1A',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold:    '0 0 24px rgba(201,168,76,0.30)',
        'gold-sm': '0 0 12px rgba(201,168,76,0.18)',
        navy:    '0 8px 32px rgba(0,0,0,0.55)',
        glass:   '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease-out',
        'scale-in':  'scaleIn 0.25s ease-out',
        shimmer:     'shimmer 2.5s linear infinite',
        pulse_gold:  'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400% center' },
          '100%': { backgroundPosition: '400% center' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(201,168,76,0.18)' },
          '50%':      { boxShadow: '0 0 28px rgba(201,168,76,0.40)' },
        },
      },
    },
  },
  plugins: [],
}
