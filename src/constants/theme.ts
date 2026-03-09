// ─────────────────────────────────────────────────────────────
// MindCalm Mobile — Design Tokens (Single Source of Truth)
// ─────────────────────────────────────────────────────────────
// Every color, spacing, radius, font-size, and shadow used in
// the app should reference these constants. This avoids magic
// numbers scattered across screens and ensures visual consistency.
// ─────────────────────────────────────────────────────────────

// ── Brand Palette ──────────────────────────────────────────
export const Colors = {
    // Core brand
    primary: "#1B2250",
    primaryLight: "#2A3370",
    primaryDark: "#0F1535",
    accent: "#6282E3",
    accentLight: "#7D9BEF",
    glow: "#8B5CF6",
    glowLight: "#A78BFA",

    // Semantic
    success: "#34D399",
    successLight: "#6EE7B7",
    warning: "#FB923C",
    warningLight: "#FDBA74",
    danger: "#EF4444",
    dangerLight: "#FCA5A5",
    info: "#38BDF8",
    infoLight: "#7DD3FC",

    // Surfaces (glass morphism layers)
    surface: {
        base: "rgba(255,255,255,0.05)",
        elevated: "rgba(255,255,255,0.08)",
        hover: "rgba(255,255,255,0.10)",
        pressed: "rgba(255,255,255,0.12)",
        overlay: "rgba(0,0,0,0.4)",
    },

    // Borders
    border: {
        subtle: "rgba(255,255,255,0.06)",
        default: "rgba(255,255,255,0.10)",
        strong: "rgba(255,255,255,0.15)",
    },

    // Text hierarchy
    text: {
        primary: "#FFFFFF",
        secondary: "rgba(255,255,255,0.85)",
        muted: "rgba(255,255,255,0.6)",
        dim: "rgba(255,255,255,0.4)",
        disabled: "rgba(255,255,255,0.25)",
    },

    // Category-specific (used in quizzes, badges, charts)
    category: {
        stress: { main: "#34D399", faded: "#34D39920", text: "#34D399" },
        sleep: { main: "#6282E3", faded: "#6282E320", text: "#6282E3" },
        mindfulness: { main: "#8B5CF6", faded: "#8B5CF620", text: "#8B5CF6" },
        mood: { main: "#FB923C", faded: "#FB923C20", text: "#FB923C" },
        breathing: { main: "#38BDF8", faded: "#38BDF820", text: "#38BDF8" },
    },

    // Banner colors (inspired by SilentMoon)
    banner: {
        purple: "#8E97FD",
        purpleGradient: ["#8E97FD", "#6282E3"],
        gold: "#FFDB9D",
        goldGradient: ["#FFDB9D", "#FB923C"],
        dark: "#333242",
        darkGradient: ["#333242", "#1B2250"],
    },
} as const;

// ── Gradients ──────────────────────────────────────────────
export const Gradients = {
    // Screen backgrounds
    screenPrimary: ["#1B2250", "#0F1535"] as const,
    screenDark: ["#0F1535", "#080C1F"] as const,

    // Card overlays
    cardAccent: ["#6282E320", "#6282E308"] as const,
    cardGlow: ["#8B5CF620", "#8B5CF608"] as const,
    cardSuccess: ["#34D39920", "#34D39908"] as const,
    cardWarning: ["#FB923C20", "#FB923C08"] as const,
    cardDanger: ["#EF444420", "#EF444408"] as const,

    // SOS / alert
    sosGradient: ["#EF444420", "#8B5CF620"] as const,

    // Button shimmer
    accentButton: ["#6282E3", "#8B5CF6"] as const,
} as const;

// ── Spacing ────────────────────────────────────────────────
// 4pt grid system (aligns with Tailwind's default scale)
export const Spacing = {
    "2xs": 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
    "3xl": 40,
    "4xl": 48,
    "5xl": 64,
} as const;

// ── Border Radius ──────────────────────────────────────────
export const Radius = {
    none: 0,
    sm: 6,
    md: 10,
    base: 14,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    full: 9999,
} as const;

// ── Font Sizes ─────────────────────────────────────────────
// Each entry: [fontSize, lineHeight]
export const FontSize = {
    xs: [10, 14] as const,
    sm: [12, 16] as const,
    base: [14, 20] as const,
    md: [16, 22] as const,
    lg: [18, 26] as const,
    xl: [20, 28] as const,
    "2xl": [24, 32] as const,
    "3xl": [30, 38] as const,
    "4xl": [36, 44] as const,
} as const;

// ── Font Weights ───────────────────────────────────────────
export const FontWeight = {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
};

// ── Shadows (iOS + Android) ───────────────────────────────
export const Shadows = {
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    glow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    }),
} as const;

// ── Animation Durations ────────────────────────────────────
export const Duration = {
    fast: 150,
    normal: 250,
    slow: 400,
    entrance: 600,
} as const;

// ── Icon Sizes ─────────────────────────────────────────────
export const IconSize = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
    "2xl": 48,
} as const;

// ── Hit Slop (minimum tap targets — 44pt per Apple HIG) ───
export const HitSlop = {
    default: { top: 10, bottom: 10, left: 10, right: 10 },
    large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;
