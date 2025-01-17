/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        snake: {
          purple: '#560bad',
          white: '#ffffff',
          pink: '#f72585',
        },
      },
    },
  },
  plugins: [],
}

// :root {
//   --purple: #560bad;
//   --pink: #f72585;
//   --white: #ffffff;
// }
