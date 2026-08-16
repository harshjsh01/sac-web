import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sac: {
          orange: {
            DEFAULT: "#F05A28",
            light: "#F9B122",
            dark: "#C04820",
          },
          blue: {
            DEFAULT: "#0284C7",
            light: "#38BDF8",
            dark: "#0369A1",
          },
          navy: {
            DEFAULT: "#0F172A",
            light: "#1E293B",
            dark: "#020617",
          },
          surface: {
            DEFAULT: "#FFFFFF",
            muted: "#F8FAFC",
            border: "#E2E8F0",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],
        'xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      animation: {
        "marquee-infinite": "marquee 30s linear infinite",
        "tilt-card": "tilt 10s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        }
      },
      boxShadow: {
        "soft": "0 10px 40px -10px rgba(0,0,0,0.08)",
        "card": "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        "hover": "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
