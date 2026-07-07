import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ["'Inter'", 'sans-serif'],
        display: ["'Instrument Serif'", 'serif'],
      },
      colors: {
        bg: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        'text-primary': 'hsl(var(--text))',
        muted: 'hsl(var(--muted))',
        stroke: 'hsl(var(--stroke))',
        purple: '#7B2FF7',
        violet: '#9D4EDD',
        blood: '#C41E3A',
        kawaii: '#F2A6C1',
      },
    },
  },
  plugins: [animate],
}
