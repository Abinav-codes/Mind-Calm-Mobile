/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            // ── Colors ─────────────────────────────────────
            colors: {
                // Brand
                primary: {
                    DEFAULT: "#1B2250",
                    light: "#2A3370",
                    dark: "#0F1535",
                },
                accent: {
                    DEFAULT: "#6282E3",
                    light: "#7D9BEF",
                },
                glow: {
                    DEFAULT: "#8B5CF6",
                    light: "#A78BFA",
                },

                // Semantic
                success: {
                    DEFAULT: "#34D399",
                    light: "#6EE7B7",
                },
                warning: {
                    DEFAULT: "#FB923C",
                    light: "#FDBA74",
                },
                danger: {
                    DEFAULT: "#EF4444",
                    light: "#FCA5A5",
                },
                info: {
                    DEFAULT: "#38BDF8",
                    light: "#7DD3FC",
                },

                // Surfaces
                surface: {
                    DEFAULT: "rgba(255,255,255,0.05)",
                    elevated: "rgba(255,255,255,0.08)",
                    hover: "rgba(255,255,255,0.10)",
                    pressed: "rgba(255,255,255,0.12)",
                },

                // Borders
                border: {
                    subtle: "rgba(255,255,255,0.06)",
                    DEFAULT: "rgba(255,255,255,0.10)",
                    strong: "rgba(255,255,255,0.15)",
                },

                // Text
                "text-primary": "#FFFFFF",
                "text-secondary": "rgba(255,255,255,0.85)",
                "text-muted": "rgba(255,255,255,0.6)",
                "text-dim": "rgba(255,255,255,0.4)",
                "text-disabled": "rgba(255,255,255,0.25)",

                // Category
                cat: {
                    stress: "#34D399",
                    sleep: "#6282E3",
                    mindfulness: "#8B5CF6",
                    mood: "#FB923C",
                    breathing: "#38BDF8",
                },
            },

            // ── Border Radius ──────────────────────────────
            borderRadius: {
                sm: "6px",
                md: "10px",
                base: "14px",
                lg: "16px",
                xl: "20px",
                "2xl": "24px",
            },

            // ── Spacing (aligned with 4pt grid) ────────────
            spacing: {
                "2xs": "2px",
                xs: "4px",
                sm: "8px",
                md: "12px",
                base: "16px",
                lg: "20px",
                xl: "24px",
                "2xl": "32px",
                "3xl": "40px",
                "4xl": "48px",
                "5xl": "64px",
            },

            // ── Font Sizes ─────────────────────────────────
            fontSize: {
                xs: ["10px", { lineHeight: "14px" }],
                sm: ["12px", { lineHeight: "16px" }],
                base: ["14px", { lineHeight: "20px" }],
                md: ["16px", { lineHeight: "22px" }],
                lg: ["18px", { lineHeight: "26px" }],
                xl: ["20px", { lineHeight: "28px" }],
                "2xl": ["24px", { lineHeight: "32px" }],
                "3xl": ["30px", { lineHeight: "38px" }],
                "4xl": ["36px", { lineHeight: "44px" }],
            },

            // ── Font Family ────────────────────────────────
            fontFamily: {
                inter: ["Inter"],
                "inter-medium": ["Inter-Medium"],
                "inter-bold": ["Inter-Bold"],
            },

            // ── Opacity ────────────────────────────────────
            opacity: {
                5: "0.05",
                8: "0.08",
                10: "0.10",
                12: "0.12",
                15: "0.15",
                25: "0.25",
                40: "0.40",
                60: "0.60",
                85: "0.85",
            },
        },
    },
    plugins: [],
};
