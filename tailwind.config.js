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
        gold: {
          DEFAULT: '#c9a84c',
          bright: '#ffd700',
        },
        navy: {
          dark: '#05051e',
          mid: '#0a0a2e',
          light: '#0d0d3b',
          border: '#1a1a5e',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 0 30px rgba(201, 168, 76, 0.5)',
        'gold-lg': '0 0 60px rgba(255, 215, 0, 0.7)',
        green: '0 0 20px rgba(74, 222, 128, 0.5)',
        red: '0 0 20px rgba(248, 113, 113, 0.5)',
        blue: '0 0 20px rgba(96, 165, 250, 0.6)',
      },
      animation: {
        'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-in': 'glowIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
