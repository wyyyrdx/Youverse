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
          card: '#0f0f1e',
        },
        magenta: {
          DEFAULT: '#e63cff',
          dim: '#8a2ea3',
          glow: 'rgba(230, 60, 255, 0.55)',
        },
        cyan: {
          DEFAULT: '#2fe4ff',
          dim: '#1a7f8f',
          glow: 'rgba(47, 228, 255, 0.55)',
        },
        mint: {
          DEFAULT: '#7bffb0',
          dim: '#3ba368',
          glow: 'rgba(123, 255, 176, 0.5)',
        },
        amber: {
          DEFAULT: '#ffd166',
          dim: '#b38f32',
          glow: 'rgba(255, 209, 102, 0.5)',
        },
        coral: {
          DEFAULT: '#ff6b6b',
          dim: '#b33d3d',
          glow: 'rgba(255, 107, 107, 0.5)',
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
          '50%': { transform: 'translateY(-8px)' },
        },
        floatXY: {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(4px, -6px) rotate(0.6deg)' },
          '66%': { transform: 'translate(-3px, -4px) rotate(-0.5deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        floatXY: 'floatXY 10s ease-in-out infinite',
        breathe: 'breathe 7s ease-in-out infinite',
        glowPulse: 'glowPulse 5s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
        shimmer: 'shimmer 2.5s infinite',
      },
    },
  },
  plugins: [],
}
