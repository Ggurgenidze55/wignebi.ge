import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#F8FAFC',
          raised: '#FFFFFF',
          surface: '#F1F5F9',
        },
        fg: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          faint: '#94A3B8',
        },
        line: '#E2E8F0',
        brand: {
          indigo: '#4F46E5',
          violet: '#7C3AED',
          cyan: '#0891B2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '72rem',
      },
      boxShadow: {
        cover: '0 20px 40px -12px rgba(15, 23, 42, 0.12)',
        soft: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)',
        'glow-indigo': '0 0 24px rgba(79, 70, 229, 0.35)',
        'glow-cyan': '0 0 24px rgba(8, 145, 178, 0.3)',
        'glow-violet': '0 0 24px rgba(124, 58, 237, 0.28)',
      },
      animation: {
        shimmer: 'shimmer 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'hero-rise': 'hero-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'hero-rise': {
          from: { opacity: '0', transform: 'translateY(1.25rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
