import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9E75',
          light: '#E1F5EE',
          dark: '#0F6E56',
        },
        accent: '#378ADD',
        warning: '#BA7517',
        danger: '#A32D2D',
        surface: '#FFFFFF',
        page: '#F5F6F8',
        secondary: '#F1F2F4',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "'Inter'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      fontSize: {
        h1: ['28px', { fontWeight: '600' }],
        h2: ['22px', { fontWeight: '600' }],
        h3: ['18px', { fontWeight: '500' }],
        h4: ['16px', { fontWeight: '500' }],
        body: ['15px', { lineHeight: '1.7' }],
        small: ['13px', {}],
        caption: ['11px', { letterSpacing: '0.3px' }],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        modal: '0 8px 24px rgba(0,0,0,0.12)',
        tooltip: '0 4px 12px rgba(0,0,0,0.08)',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [typography],
}

export default config
