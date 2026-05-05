import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        metal: {
          light: "hsl(var(--metal-light))",
          DEFAULT: "hsl(var(--metal))",
          dark: "hsl(var(--metal-dark))",
        },
        shop: {
          blue: "hsl(var(--shop-blue))",
          orange: "hsl(var(--shop-orange))",
          yellow: "hsl(var(--shop-yellow))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        industrial: "var(--shadow-md)",
        "industrial-lg": "var(--shadow-lg)",
        pressed: "var(--shadow-pressed)",
        "glow-success": "var(--shadow-glow-success)",
        "glow-orange": "var(--shadow-glow-orange)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "shake-x": {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        "bounce-success": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.08)" },
          "60%": { transform: "scale(0.97)" },
          "100%": { transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%,100%": { boxShadow: "0 0 0 hsl(var(--success-glow) / 0)" },
          "50%": { boxShadow: "0 0 24px hsl(var(--success-glow) / 0.7)" },
        },
        "wrench-spin": {
          "0%": { transform: "rotate(-15deg)" },
          "50%": { transform: "rotate(20deg)" },
          "100%": { transform: "rotate(-15deg)" },
        },
        "money-pop": {
          "0%": { transform: "translateY(20px) scale(0.5)", opacity: "0" },
          "50%": { transform: "translateY(-8px) scale(1.15)", opacity: "1" },
          "100%": { transform: "translateY(-30px) scale(1)", opacity: "0" },
        },
        "slide-up-fade": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shake-x": "shake-x 0.4s ease-in-out",
        "bounce-success": "bounce-success 0.5s cubic-bezier(.2,.8,.2,1)",
        "glow-pulse": "glow-pulse 1.6s ease-in-out infinite",
        "wrench-spin": "wrench-spin 1.2s ease-in-out infinite",
        "money-pop": "money-pop 1.2s ease-out forwards",
        "slide-up-fade": "slide-up-fade 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
