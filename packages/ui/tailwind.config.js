/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005ab3',
          700: '#004280',
          800: '#00294d',
          900: '#00101a',
        },
        success: {
          light: '#d4edda',
          DEFAULT: '#28a745',
          dark: '#1e7e34',
        },
        warning: {
          light: '#fff3cd',
          DEFAULT: '#ffc107',
          dark: '#d39e00',
        },
        danger: {
          light: '#f8d7da',
          DEFAULT: '#dc3545',
          dark: '#bd2130',
        },
      },
    },
  },
  plugins: [],
};
