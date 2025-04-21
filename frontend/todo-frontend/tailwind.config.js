/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#6C63FF",
          accent: "#FFD166",
          bg: "#F5F5F5",
          darkBg: "#1A202C",
        },
      },
    },
    plugins: [],
  };
  