/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: {
          arrays:  '#22D3EE',
          ll:      '#A78BFA',
          search:  '#34D399',
          sorting: '#F59E0B',
          hashing: '#F472B6',
          stack:   '#60A5FA',
          tree:    '#4ADE80',
          graph:   '#FB923C',
          sched:   '#E879F9',
        }
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      }
    },
  },
  plugins: [],
};