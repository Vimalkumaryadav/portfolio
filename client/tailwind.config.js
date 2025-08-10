/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border-color)",
        primary: {
          DEFAULT: "var(--primary-color)",
          hover: "var(--primary-color-hover)",
        },
        secondary: "var(--text-secondary)",
        surface: "var(--surface-color)",
        background: "var(--background-color)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
