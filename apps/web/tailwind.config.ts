import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF8F3',
        champagne: '#E7D3A1',
        gold: {
          DEFAULT: '#C7A14A',
          dark: '#A6842F',
        },
        forest: '#2F4733',
        ink: '#2A2621',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(42, 38, 33, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
