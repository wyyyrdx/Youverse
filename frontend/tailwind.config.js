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
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatXY: {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(3px, -5px) rotate(0.4deg)' },
          '66%': { transform: 'translate(-2px, -3px) rotate(-0.3deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.75' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.98)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
      },
      animation: {
        floatY: 'floatY 7s ease-in-out infinite',
        floatXY: 'floatXY 11s ease-in-out infinite',
        breathe: 'breathe 8s ease-in-out infinite',
        glowPulse: 'glowPulse 6s ease-in-out infinite',
        fadeUp: 'fadeUp 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}
