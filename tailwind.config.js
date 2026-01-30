/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-text': 'rgb(78, 79, 104)',      // Primary text color
        'primary-accent': 'rgb(45, 46, 64)',    // Soft charcoal for CTAs
        'micro-accent': 'rgb(225, 145, 188)',    // Pink for micro-elements only
        'bg-main': '#ffffff',                   // Main white background
        'bg-muted': '#f6f7f9',                  // Alternate sections
        'bg-soft': '#fafafa',                   // Soft contrast sections
        'text-primary': 'rgb(78, 79, 104)',      // Primary text
        'text-muted': '#6B7280',                 // Muted text
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
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
      },
    },
  },
  plugins: [],
}