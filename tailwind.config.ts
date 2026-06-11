import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: {
          50: '#f8f3ff',
          100: '#f0e6ff',
          200: '#e1ceff',
          300: '#d1b3ff',
          400: '#bb8cff',
          500: '#a561ff',
          600: '#9332ff',
          700: '#7e1aff',
          800: '#6600dd',
          900: '#4d00aa',
        },
        secondary: {
          50: '#fef5f5',
          100: '#fdebeb',
          200: '#fad7d7',
          300: '#f7c3c3',
          400: '#f1959b',
          500: '#ea6b78',
          600: '#d946ef',
          700: '#c2185b',
          800: '#a01548',
          900: '#7e0e35',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
