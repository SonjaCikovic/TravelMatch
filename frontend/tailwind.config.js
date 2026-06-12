/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
          display: ['Pacifico', 'cursive'],
      },
      colors: {
          primary: '#6D28D9',
          dark: '#1E1633',
          body: '#473F59',
          muted: '#7A7390',
          light: '#F7F5FC',
          surface: '#FFFFFF',
          secondary: '#EFEAFB',
          accent: '#E4DEF0',
          elegantbg: '#F2F5FF',
          primaryDark: '#4C1D95',
      }
    },
  },
  plugins: [],
}

