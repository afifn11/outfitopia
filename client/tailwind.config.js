/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black:   '#0a0a0a',
        white:   '#ffffff',
        gray: {
          50:  '#fafafa', 100: '#f4f4f4', 200: '#e8e8e8',
          300: '#d0d0d0', 400: '#a0a0a0', 500: '#808080',
          600: '#6b6b6b', 700: '#444444', 800: '#2a2a2a',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      letterSpacing: { ultra: '0.22em', wider: '0.12em', wide: '0.06em' },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
        xs:    ['11px', { lineHeight: '1.5' }],
        sm:    ['12px', { lineHeight: '1.5' }],
        base:  ['13px', { lineHeight: '1.6' }],
        md:    ['14px', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
};
