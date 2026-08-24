/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#030308',
          soft: '#07070f',
          panel: '#0b0b16',
        },
        magenta: {
          DEFAULT: '#e63cff',
          dim: '#8a2ea3',
        },
        cyan: {
          DEFAULT: '#2fe4ff',
          dim: '#1a7f8f',
        },
        mist: {
          DEFAULT: '#e9e7f5',
          muted: '#8b87a3',
          faint: '#4d4a63',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glowMagenta: '0 0 40px 4px rgba(230, 60, 255, 0.35)',
        glowCyan: '0 0 40px 4px rgba(47, 228, 255, 0.35)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
        drift: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        drift: 'drift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
