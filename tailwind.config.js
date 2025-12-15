/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF6FA7",    // main theme color (pink)
          secondary: "#FF92C5",  // lighter shade
          accent: "#FFD1E8",     // soft pastel
          dark: "#B4346C",       // darker shade for contrast
        },
        surface: {
          light: "#FFFFFF",
          muted: "#F8F8FA",
          dark: "#1A1A1A",
        },
      },

      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        fancy: ["Quicksand", "cursive"],
      },

      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
        card: "0 6px 25px rgba(0,0,0,0.08)",
        glow: "0 0 15px rgba(255, 111, 167, 0.5)",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },

      animation: {
        float: "float 3s ease-in-out infinite",
        pop: "pop .25s ease-out",
      },
    },
  },
  plugins: [],
};
