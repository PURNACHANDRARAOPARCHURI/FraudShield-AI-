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
        fintech: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0265d6',
          900: '#0b132b',
          dark: '#0a0f1d',
          card: '#111827',
          border: '#1f2937'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(2, 132, 199, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(2, 132, 199, 0.9), 0 0 30px rgba(99, 102, 241, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
