/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manhwa: {
          bg: '#F5F2EB',          // Background utama: ivory hangat
          card: '#FFFEFA',        // Background kartu
          text: '#292820',        // Teks utama
          muted: '#77746B',       // Teks sekunder
          accent: '#795044',      // Aksen utama (cokelat kemerahan)
          'accent-hover': '#653F34',
          secondary: '#8B896E',   // Aksen sekunder (olive muted)
          'secondary-hover': '#747259',
          border: '#E5E0D6',      // Garis tepi / border
          surface: '#EFECE3',     // Permukaan abu/krem halus
          highlight: '#E6DCCE'
        }
      },
      fontFamily: {
        serif: ['Literata', 'Merriweather', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(41, 40, 32, 0.05), 0 1px 4px -1px rgba(41, 40, 32, 0.03)',
        'elevated': '0 8px 20px -4px rgba(41, 40, 32, 0.08), 0 4px 8px -2px rgba(41, 40, 32, 0.04)',
      }
    },
  },
  plugins: [],
}
