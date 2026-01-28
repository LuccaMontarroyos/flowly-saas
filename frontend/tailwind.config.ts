import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5b2bee",
          hover: "#4a22c5",
        },
        background: {
          light: "#f6f6f8",
          dark: "#151022",
        },
        border: {
          subtle: "#e5e7eb",
        },
        text: {
          main: "#110d1b",
          muted: "#6b7280",
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
};
export default config;