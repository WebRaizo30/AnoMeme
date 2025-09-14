/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out',
        'stagger-1': 'fadeInUp 1s ease-out 0.1s both',
        'stagger-2': 'fadeInUp 1s ease-out 0.2s both',
        'stagger-3': 'fadeInUp 1s ease-out 0.3s both',
        'stagger-4': 'fadeInUp 1s ease-out 0.4s both',
        'status-blink': 'statusBlink 2s ease-in-out infinite',
        'subtle-glow': 'subtleGlow 3s ease-in-out infinite',
        'data-flicker': 'dataFlicker 2s ease-in-out infinite',
        'grid-scan': 'gridScan 8s ease-in-out infinite',
        'terminal-cursor': 'terminalCursor 1s ease-in-out infinite alternate',
        'progress-fill': 'progressFill 2s ease-in-out infinite',
        'intent-pulse': 'intentPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        statusBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        subtleGlow: {
          '0%, 100%': { textShadow: '0 0 5px rgba(239, 68, 68, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(239, 68, 68, 0.8)' },
        },
        dataFlicker: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        gridScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        terminalCursor: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        progressFill: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        intentPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
}
