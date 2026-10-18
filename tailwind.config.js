/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          terracotta: '#E07A5F',
          peach: '#F4A261',
          charcoal: '#2B2D42',
          ivory: '#FDFBF7',
          cream: '#F4F1DE'
        },
        terracotta: '#E07A5F',
        peach: '#F4A261',
        charcoal: '#2B2D42',
        ivory: '#FDFBF7',
        cream: '#F4F1DE',
        salon: {
          50: '#fbf8f5',
          100: '#f5efe9',
          200: '#ebdcd1',
          300: '#dec2b1',
          400: '#cfa18c',
          500: '#bd7e66',
          600: '#a86149',
          700: '#8c4e3a',
          800: '#734133',
          900: '#5e372c',
          950: '#331c16'
        },
        luxe: {
          dark: '#0e1117',
          card: '#161b24',
          border: '#262f3f',
          gold: '#dfb76c',
          rose: '#e58092'
        }
      }
    },
  },
  plugins: [],
}
