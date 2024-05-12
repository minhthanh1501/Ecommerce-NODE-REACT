/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif;']
    },
    extend: {
      width: {
        main : '1220px',
      },
      backgroundColor: {
      
      },
      colors:{
        main : 'red'
      },
 
    },
  },
  plugins: [
    "@tailwindcss/line-clamp"
  ],
}