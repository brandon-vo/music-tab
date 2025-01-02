import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        spotify: "var(--spotify)",
        spotifyHover: "var(--spotify-hover)",
        bvDarkBlack: "var(--bv-dark-black)",
        bvLightGrey: "var(--bv-light-grey)",
        bvGrey: "var(--bv-grey)",
        bvDarkGrey: "var(--bv-dark-grey)",
      },
    },
  },
  plugins: [],
} satisfies Config;
