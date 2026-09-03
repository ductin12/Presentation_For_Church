/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './live.html',
    './edit-song.html',
    './src/**/*.{js,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5048e5',
        'background-light': '#f6f6f8',
        'background-dark': '#121121',
        'win-gray': '#f0f0f0',
        'win-border': '#a0a0a0',
        'win-dark-gray': '#808080',
        'win-blue': '#005a9e',
        'win-light-blue': '#cce4f7',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        win: ['Tahoma', 'Segoe UI', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      }
    }
  },
  plugins: []
};
