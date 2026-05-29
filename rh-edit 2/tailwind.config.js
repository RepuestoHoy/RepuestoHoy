/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Repuesto Hoy
        'rh-red': {
          DEFAULT: '#E10600',
          hover: '#B00500',
        },
        'rh-black': '#111111',
        'rh-gray': '#2A2A2A',
        'rh-white': '#FFFFFF',
        'rh-gray-light': '#F5F5F5',
        'rh-border': '#E0E0E0',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}