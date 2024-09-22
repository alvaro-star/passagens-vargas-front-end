/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueGray: `rgba(51, 65, 85, 1)`,
        customGray: {
          light: '#f7fafc',
          DEFAULT: '#a0aec0',
          dark: '#4a5568',
        },
      },
    },
  },
  plugins: [],
}

