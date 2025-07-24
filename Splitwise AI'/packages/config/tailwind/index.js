/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brazilian brand colors
        brazil: {
          green: '#009C3B',
          yellow: '#FFDF00',
          blue: '#002776'
        },
        // Financial colors for expenses
        expense: {
          food: '#10B981',
          transport: '#3B82F6',
          accommodation: '#8B5CF6',
          entertainment: '#F59E0B',
          shopping: '#EF4444',
          utilities: '#6B7280',
          other: '#64748B'
        },
        // LGPD compliance colors
        privacy: {
          consent: '#059669',
          required: '#DC2626',
          optional: '#6B7280'
        }
      },
      fontFamily: {
        // Brazilian-friendly fonts
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        // Brazilian currency display sizes
        'currency-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
        'currency-base': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'currency-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'currency-xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'currency-2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '800' }]
      },
      spacing: {
        // Brazilian mobile-first spacing
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        // Brazilian design preferences
        'brazilian': '0.75rem'
      },
      animation: {
        // Smooth animations for Brazilian UX
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' }
        }
      },
      gridTemplateColumns: {
        // Expense splitting layouts
        'expense-split': 'auto 1fr auto',
        'group-member': '40px 1fr auto'
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Custom Brazilian utility classes
    function({ addUtilities }) {
      const newUtilities = {
        '.currency-brl': {
          '&::before': {
            content: '"R$ "',
            fontWeight: '600'
          }
        },
        '.phone-brazil': {
          direction: 'ltr',
          textAlign: 'left'
        },
        '.cep-format': {
          letterSpacing: '0.05em'
        }
      }
      addUtilities(newUtilities)
    }
  ],
  darkMode: 'class'
} 