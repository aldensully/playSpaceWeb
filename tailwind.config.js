/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      bg: '#000',
      text: '#fff',
      fg: '#222',
    },
    fontFamily: 'Roboto Mono',
    fontWeight: {
      reg: 400,
      med: 500,
      bold: 700
    },
    lineHeight: '2rem',
    fontSize: {
      sm: '1rem',
      md: '1.20rem',
      lg: '2.5rem',
      xl: '3.75rem'
    },
    extend: {
      lineHeight: {
        'tight': '4rem',
        '12': '3rem',
      },
      fontFamily: {
        'Satoshi': ['Satoshi', 'sans-serif']
      },
      opacity: {
        '50': '0.5'
      }
    },
  },
  plugins: [],
}