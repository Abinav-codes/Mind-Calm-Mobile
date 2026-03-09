// ─────────────────────────────────────────────────────────────
// GlassCard — Core glassmorphism card component
// ─────────────────────────────────────────────────────────────
// Replaces the inline glass-style cards duplicated across 6+
// screens. Uses design tokens for consistent styling.
// ─────────────────────────────────────────────────────────────

import React from "react";
import { View, ViewStyle } from "react-native";
import { Colors, Radius, Shadows, Spacing } from "../../constants/theme";

// ── Variants ───────────────────────────────────────────────
const VARIANTS = {
    default: {
        backgroundColor: Colors.surface.base,
        borderWidth: 1,
        borderTopColor: "rgba(255,255,255,0.15)",
        borderLeftColor: "rgba(255,255,255,0.1)",
        borderRightColor: "rgba(255,255,255,0.05)",
        borderBottomColor: "rgba(255,255,255,0.03)",
    },
    elevated: {
        backgroundColor: Colors.surface.elevated,
        borderWidth: 1,
        borderTopColor: "rgba(255,255,255,0.25)",
        borderLeftColor: "rgba(255,255,255,0.15)",
        borderRightColor: "rgba(255,255,255,0.08)",
        borderBottomColor: "rgba(255,255,255,0.05)",
        ...Shadows.md,
    },
    outlined: {
        backgroundColor: "transparent",
        borderColor: Colors.border.strong,
        borderWidth: 1,
    },
    solid: {
        backgroundColor: Colors.surface.pressed,
        borderColor: "transparent",
        borderWidth: 0,
    },
} as const;

type GlassVariant = keyof typeof VARIANTS;

// ── Sizes ──────────────────────────────────────────────────
const SIZES = {
    sm: {
        padding: Spacing.md,
        borderRadius: Radius.md,
    },
    md: {
        padding: Spacing.base,
        borderRadius: Radius.lg,
    },
    lg: {
        padding: Spacing.xl,
        borderRadius: Radius.xl,
    },
} as const;

type GlassSize = keyof typeof SIZES;

// ── Props ──────────────────────────────────────────────────
interface GlassCardProps {
    children: React.ReactNode;
    variant?: GlassVariant;
    size?: GlassSize;
    style?: ViewStyle;
    /** Override border radius */
    radius?: number;
    /** Disable padding (for custom internal layout) */
    noPadding?: boolean;
}

export function GlassCard({
    children,
    variant = "default",
    size = "md",
    style,
    radius,
    noPadding = false,
}: GlassCardProps) {
    const variantStyle = VARIANTS[variant];
    const sizeStyle = SIZES[size];

    return (
        <View
            style={[
                variantStyle,
                {
                    borderRadius: radius ?? sizeStyle.borderRadius,
                    padding: noPadding ? 0 : sizeStyle.padding,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}
