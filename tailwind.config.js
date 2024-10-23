/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        ping: {
          '10%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'ping-slow': 'ping 2s  infinite',
      },
    },
  },
  plugins: [],
}

