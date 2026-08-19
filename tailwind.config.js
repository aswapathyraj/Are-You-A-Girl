/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        blush: {
          50: '#FFF6F9',
          100: '#FFE9F1',
          200: '#FCD4E2',
          300: '#F8B4CB',
          400: '#F291B3',
          500: '#E7749E',
          600: '#D65A88',
        },
        lav: {
          50: '#F8F6FF',
          100: '#F0ECFF',
          200: '#E3DCFB',
          300: '#CFC4F7',
          400: '#B4A4EF',
          500: '#9A86E4',
        },
        peach: {
          50: '#FFF8F3',
          100: '#FFEEE3',
          200: '#FFDCC8',
          300: '#FFC8A9',
        },
        ink: {
          100: '#EFEDF3',
          200: '#DCD8E2',
          300: '#BEB9C7',
          400: '#9B96A6',
          500: '#7B7588',
          600: '#605A6C',
          700: '#4A4553',
          800: '#332F3A',
          900: '#231F28',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(35,31,40,0.04), 0 22px 48px -28px rgba(90,60,110,0.24)',
        soft: '0 1px 2px rgba(35,31,40,0.04), 0 10px 24px -16px rgba(90,60,110,0.28)',
        btn: '0 10px 24px -12px rgba(231,116,158,0.65)',
        glow: '0 0 0 4px rgba(248,180,203,0.35), 0 16px 34px -14px rgba(231,116,158,0.5)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-110%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        stripes: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '24px 0' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        pulseRing: {
          '0%': { opacity: '0.45', transform: 'scale(0.9)' },
          '70%, 100%': { opacity: '0', transform: 'scale(1.2)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.15' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        stripes: 'stripes 0.9s linear infinite',
        'spin-slow': 'spinSlow 3.2s linear infinite',
        'pulse-ring': 'pulseRing 2.6s ease-out infinite',
        blink: 'blink 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
