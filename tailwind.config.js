/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f', // Very deep navy-black
        surface: '#12121a',    // Elevated surface
        primary: {
          DEFAULT: '#3b82f6', // Electric blue
          hover: '#60a5fa',
        },
        secondary: '#a78bfa', // Linear purple
        slate: {
          950: '#0a0a0f',
          900: '#12121a',
          800: '#1e1e2d',
          700: '#2e2e3f',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
      }
    },
  },
  plugins: [],
}
