/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-card': 'var(--color-bg-card)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
      },
      fontFamily: {
        sans: ['Geist', 'Noto Sans SC', 'sans-serif'],
        serif: ['Instrument Serif', 'Noto Serif SC', 'serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
