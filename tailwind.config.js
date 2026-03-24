/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary)',
        bg:        'var(--color-bg)',
        bgLight:   'var(--color-bg-light)',
        surface:   'var(--color-surface)',
        text:      'var(--color-text)',
        textMid:   'var(--color-text-mid)',
        textMuted: 'var(--color-text-muted)',
        accent1:   'var(--color-accent-1)',
        accent2:   'var(--color-accent-2)',
        accent3:   'var(--color-accent-3)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        heading: 'var(--font-heading)',
        body:    'var(--font-body)',
      },
      boxShadow: {
        light:  'var(--shadow-light)',
        medium: 'var(--shadow-medium)',
        deep:   'var(--shadow-deep)',
        gold:   'var(--shadow-gold)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
};
