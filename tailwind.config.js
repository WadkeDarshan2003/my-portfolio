/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'pastel-1': '#F5F5F4', // Stone 100
        'pastel-2': '#F0F9FF', // Sky 50
        'pastel-3': '#FDF4FF', // Fuchsia 50
        'pastel-4': '#FFFBEB', // Amber 50
        'pastel-5': '#ECFEFF', // Cyan 50
        'pastel-6': '#F8FAFC', // Slate 50
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'float-slow': 'float 8s ease-in-out infinite',
        'bounce-slow': 'bounce 4s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 40s linear infinite',
        'spin-slow-reverse': 'spin-reverse 60s linear infinite',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translate(0, -10px)' },
          '100%': { opacity: '1', transform: 'translate(0, 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate(0, 10px)' },
          '100%': { opacity: '1', transform: 'translate(0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
