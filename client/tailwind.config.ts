import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-source-sans)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"], // Make serif use Playfair
      },
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        card: "oklch(var(--card))",
        cardForeground: "oklch(var(--card-foreground))",
        popover: "oklch(var(--popover))",
        popoverForeground: "oklch(var(--popover-foreground))",
        primary: "oklch(var(--primary))",
        primaryForeground: "oklch(var(--primary-foreground))",
        secondary: "oklch(var(--secondary))",
        secondaryForeground: "oklch(var(--secondary-foreground))",
        muted: "oklch(var(--muted))",
        mutedForeground: "oklch(var(--muted-foreground))",
        accent: "oklch(var(--accent))",
        accentForeground: "oklch(var(--accent-foreground))",
        destructive: "oklch(var(--destructive))",
        destructiveForeground: "oklch(var(--destructive-foreground))",
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        sidebar: "oklch(var(--sidebar))",
        sidebarForeground: "oklch(var(--sidebar-foreground))",
        sidebarPrimary: "oklch(var(--sidebar-primary))",
        sidebarPrimaryForeground: "oklch(var(--sidebar-primary-foreground))",
        sidebarAccent: "oklch(var(--sidebar-accent))",
        sidebarAccentForeground: "oklch(var(--sidebar-accent-foreground))",
        sidebarBorder: "oklch(var(--sidebar-border))",
        sidebarRing: "oklch(var(--sidebar-ring))",
        // Chart colors
        chart1: "oklch(var(--chart-1))",
        chart2: "oklch(var(--chart-2))",
        chart3: "oklch(var(--chart-3))",
        chart4: "oklch(var(--chart-4))",
        chart5: "oklch(var(--chart-5))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
