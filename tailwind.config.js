/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#f8f9fe",
        background: "#121624",
        primary: "#7d97f4",
        secondary: "#0a0161",
        accent: "#e2eafd",
        border: "hsl(230, 75%, 98%, 10%)",
        border5: "hsl(230, 75%, 98%, 5%)",
      },
      boxShadow: {
        "primary-lg": "0 0 25px -5px #7d97f4", // primary color shadow
      },
    },
  },
  plugins: [],
};
