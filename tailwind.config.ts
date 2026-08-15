import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#09090b",
          900: "#111113",
          800: "#1c1c1f"
        },
        accent: {
          400: "#a78bfa",
          500: "#8b5cf6"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
