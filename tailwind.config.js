/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF8',
        brand: {
          purple: '#5E8BB0',
          'purple-dark': '#466F92',
          coral: '#E89485',
          yellow: '#F5C84C',
          lavender: '#B69BD8',
          green: '#A4B36F',
          blue: '#8FC4E0',
          pink: '#E89BA8',
          ink: '#3A4A5C',
          muted: '#6B7884'
        }
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Quicksand', 'Nunito', 'sans-serif']
      }
    }
  },
  plugins: []
};
