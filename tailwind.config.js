/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warehouse: {
          bg: '#060913',
          card: '#0f172a',
          surface: '#131d31',
          border: '#1e293b',
          borderHover: '#334155',
          accent: '#00f0ff',
          accentHover: '#38bdf8',
          cyanGlow: 'rgba(0, 240, 255, 0.15)',
        },
        cyan: {
          400: '#38bdf8',
          500: '#00f0ff',
          600: '#0284c7',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Space Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 240, 255, 0.25)',
        'cyan-glow-lg': '0 0 35px rgba(0, 240, 255, 0.4)',
        'rose-glow': '0 0 20px rgba(244, 63, 94, 0.3)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanline 2.5s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
