/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        noto: ["Noto Sans Lao", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        quattrocento: ["Quattrocento Sans", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        urbanist: ["Urbanist", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        nunito: ["Nunito Sans", "sans-serif"],
      },
      colors: {
        primary: "#CF7500",
        secondary: "#F0A500",
        color3: "#F4F4F4",
      },
    },
  },
  plugins: [],
};
