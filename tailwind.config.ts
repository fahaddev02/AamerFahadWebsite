import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f8f6',
          100: '#e5efe9',
          200: '#cddfce',
          300: '#a3c7aa',
          400: '#73a97f',
          500: '#4e8c5c',
          600: '#3a7046',
          700: '#2f5938',
          800: '#1b3d24',
          900: '#132c1b',
          950: '#09170e',
        },
        gold: {
          400: '#f6d365',
          500: '#fda085',
          600: '#d4af37',
          700: '#aa8c2c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;

