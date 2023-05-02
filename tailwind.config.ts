import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(0deg, rgba(2,0,36,1) 59%, rgba(120,15,13,1) 100%);",
      },
      colors: {
        "off-white": "#F7F7F7",
      },
      spacing: {
        "navigation-height": "var(--navigation-height)",
      },
    },
  },
  plugins: [],
} satisfies Config;
