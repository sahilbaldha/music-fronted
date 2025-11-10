/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '350px',
      },
      fontFamily: {
        tiktok: ['"TikTok Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

