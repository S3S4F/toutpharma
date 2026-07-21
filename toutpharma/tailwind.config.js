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
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
