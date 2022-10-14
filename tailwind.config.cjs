const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "apex-red": "#CD3333",
        "apex-red-light": "#F53D3D",
      },
    },
  },
  plugins: [],
};
