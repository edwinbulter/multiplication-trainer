/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}', './index.html'],
  theme: {
    extend: {
      width: {
        '15': '3.75rem', // 60px for large mobile keyboards
        '12': '3rem',    // 48px for medium mobile keyboards  
        '10': '2.5rem',  // 40px for small mobile keyboards
      },
      height: {
        '15': '3.75rem', // 60px for large mobile keyboards
        '12': '3rem',    // 48px for medium mobile keyboards
        '10': '2.5rem',  // 40px for small mobile keyboards
      },
      screens: {
        'xs': '320px', // Extra small screens
        'small-mobile': '360px', // Samsung S8, iPhone SE (360-389px)
        'medium-mobile': '390px', // iPhone 12/13/14 (390-429px)
        'large-mobile': '430px', // iPhone 14 Pro Max and larger (430px+)
      },
    }
  },
  plugins: [],
};