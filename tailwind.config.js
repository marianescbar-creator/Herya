/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        herya: {
          blue: '#4A6CF7',
          violet: '#7B3FE4',
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          text: '#1A1A2E',
          muted: '#6B7280',
          success: '#10B981',
          warning: '#F59E0B',
          severe: '#EF4444',
        },
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
