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
        "card-dark": "#182c1c",
        "text-light": "#102214",
        "text-dark": "#f5f8f6",
        "text-muted-light": "#4b9b5f",
        "text-muted-dark": "#a0d1aa",
        "border-light": "#e7f3ea",
        "border-dark": "#2a4a31",
        // "success": "#078827",
        "danger": "#e72608",
        "success": "#0ff047",
        "error": "#ff4d4f",
        "warning": "#faad14",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}