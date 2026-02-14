/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    variants: {
      extend: {
        display: ["print"],
        textColor: ["print"],
        fontSize: ["print"],
        backgroundColor: ["print"],
      },

      plugins: [],
    },
  },
};
