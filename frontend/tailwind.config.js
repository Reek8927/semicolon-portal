/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ethereal: {
          bg: '#0b0f19',       // True midnight canvas tone
          card: '#161b26',     // Translucent deep card background
          neonGreen: '#a3e635',// Vibrant lime accent indicator
          neonPurple: '#c084fc',// Soft purple accent highlight
          textMuted: '#94a3b8'  // Crisp slate-gray subtext
        }
      }
    },
  },
  plugins: [],
}