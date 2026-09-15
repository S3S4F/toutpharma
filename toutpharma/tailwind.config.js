/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // Sky blue - reliable/medical
        secondary: '#f0f9ff', // Light sky - background
        accent: '#f43f5e', // Rose - alerts/ctas
        'giphar-green': {
          DEFAULT: '#004b38', // Deep Forest Green
          light: '#96c11f',   // Lime Green Accent
          dark: '#003326'
        },
        'giphar-orange': {
          DEFAULT: '#f89a1c', // CTA Orange
          hover: '#e08815'
        }
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Ombres douces « médical premium » — jamais de noir dur.
        soft: '0 2px 12px -2px rgb(0 75 56 / 0.08), 0 1px 3px rgb(15 23 42 / 0.04)',
        lift: '0 12px 32px -8px rgb(0 75 56 / 0.18), 0 4px 12px -4px rgb(15 23 42 / 0.06)',
        glow: '0 0 0 1px rgb(150 193 31 / 0.25), 0 8px 24px -6px rgb(150 193 31 / 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.4)' },
          '60%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slide-in-right 0.38s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 5s ease-in-out infinite',
        pop: 'pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
