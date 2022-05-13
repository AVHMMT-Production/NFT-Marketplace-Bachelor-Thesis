module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      maxWidth: {
        '225': '225px',
        '345': '345px',
       },
       maxHeight: {
        '225': '225px',
        '345': '345px',
       },
    },
  },
  plugins: [],
}