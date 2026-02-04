/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        'ink-subtle': 'var(--color-ink-subtle)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-strong': 'var(--color-accent-strong)',
        'accent-soft': 'var(--color-accent-soft)',
        muted: 'var(--color-surface)',
        'primary-text': 'var(--color-ink)',
        'primary-accent': 'var(--color-ink)',
        'micro-accent': 'var(--color-accent)',
        'bg-main': 'var(--color-surface-2)',
        'bg-muted': 'var(--color-surface)',
        'bg-soft': 'var(--color-surface-3)',
        'text-primary': 'var(--color-ink)',
        'text-muted': 'var(--color-ink-muted)',
        'ghaimuae-primary': 'var(--color-ink)',
        'ghaimuae-white': 'var(--color-surface-2)',
        'ghaimuae-dark-gray': 'var(--color-ink-muted)',
        'ghaimuae-light-gray': 'var(--color-ink-subtle)',
        'logo-blue': 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'scrape': 'scrape 0.7s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scrape: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
