/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0ff047",
        "background-light": "#f5f8f6",
        "background-dark": "#102214",
        "card-light": "#ffffff",
        "card-dark": "#1a2c1e",
        "text-light-primary": "#0d1c11",
        "text-dark-primary": "#e1e3e1",
        "text-light-secondary": "#4b9b5f",
        "text-dark-secondary": "#a5d1b0",
        "border-light": "#cfe8d5",
        "border-dark": "#3a4a3f",
        "brand-red": "#d32f2f"
      },
    },
  },
  plugins: [],
}