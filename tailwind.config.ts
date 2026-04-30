import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        matte: '#0a0a0a',
        copper: '#b56a3f',
        beige: '#d8c3a8',
        ember: '#8f4f2d'
      }
    },
  },
  plugins: [],
} satisfies Config;
