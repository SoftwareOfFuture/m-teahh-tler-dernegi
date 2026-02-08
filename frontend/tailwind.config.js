/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#8B1538',
        'burgundy-dark': '#6B1030',
        'burgundy-light': '#A91D4A',
        navy: '#0a1628',
        'navy-light': '#132238',
        cream: '#f7f5f2',
        'cream-dark': '#ebe8e3',
        'soft-gray': '#ebe8e3',
        teal: '#0d9488',
        'teal-dark': '#0f766e',
        gold: '#c9a227',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'outline': '0 0 0 2px currentColor',
        'brutal': '4px 4px 0 0 rgba(0,0,0,0.15)',
        'brutal-lg': '6px 6px 0 0 rgba(0,0,0,0.12)',
        'card': '0 1px 3px rgba(10, 22, 40, 0.08)',
        'premium': '0 4px 20px rgba(10, 22, 40, 0.1)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
