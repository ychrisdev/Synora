import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F6EF7",
          50: "#EEF1FE",
          100: "#D9DFFD",
          500: "#4F6EF7",
          600: "#3A5AF0",
          700: "#2545E8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          50: "#F8F9FC",
          100: "#F1F3F9",
          200: "#E4E7F0",
        },
        text: {
          primary: "#0F1117",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        sidebar: "1px 0 0 #E4E7F0",
      },
    },
  },
  plugins: [],
};
export default config;
