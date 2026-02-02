export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C763B',
          light: '#5A8A47',
          dark: '#3D5F2F',
        },
        secondary: {
          DEFAULT: '#B95E82',
          light: '#C97896',
          dark: '#9A4D6B',
        },
      },
    },
  },
  content: [
    "{srcDir}/components/**/*.{vue,js,jsx,mjs,ts,tsx}",
    "{srcDir}/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}",
  ],
  plugins: [],
};
