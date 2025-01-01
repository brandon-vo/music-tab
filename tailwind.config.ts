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
        bvLightGrey: "var(--bv-light-grey)",
        bvDarkGrey: "var(--bv-dark-grey)",
      },
      boxShadow: {
        album: "5px 5px 7px rgba(33, 33, 33, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
