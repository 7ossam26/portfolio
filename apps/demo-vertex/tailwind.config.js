/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6F4E37',
        'primary-hover': '#5D4037',
        'background-light': '#F5F5F0',
        'background-dark': '#1F1B18',
        'surface-light': '#FFFFFF',
        'surface-dark': '#2C2522',
        'text-light': '#3E2723',
        'text-dark': '#EFEBE9',
        'border-light': '#E7E5E4',
        'border-dark': '#44403C',
      },
      fontFamily: {
        display: ['Cairo', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
      },
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
    },
  },
  plugins: [],
};
