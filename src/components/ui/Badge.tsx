// ─────────────────────────────────────────────────────────────
// Badge — Category badge component
// ─────────────────────────────────────────────────────────────
// Used in quiz cards, blog posts, explore screen, and progress.
// Automatically maps category names to colors from theme tokens.
// ─────────────────────────────────────────────────────────────

import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../constants/theme";

// ── Category → Color mapping ───────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    stress: { bg: Colors.category.stress.faded, text: Colors.category.stress.text },
    sleep: { bg: Colors.category.sleep.faded, text: Colors.category.sleep.text },
    mindfulness: { bg: Colors.category.mindfulness.faded, text: Colors.category.mindfulness.text },
    mood: { bg: Colors.category.mood.faded, text: Colors.category.mood.text },
    breathing: { bg: Colors.category.breathing.faded, text: Colors.category.breathing.text },
    success: { bg: "#34D39920", text: Colors.success },
    warning: { bg: "#FB923C20", text: Colors.warning },
    danger: { bg: "#EF444420", text: Colors.danger },
    info: { bg: "#38BDF820", text: Colors.info },
    accent: { bg: "#6282E320", text: Colors.accent },
};

// ── Sizes ──────────────────────────────────────────────────
const SIZE_STYLES = {
    sm: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.sm,
        fontSize: FontSize.xs[0],
        lineHeight: FontSize.xs[1],
    },
    md: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: Radius.sm,
        fontSize: FontSize.sm[0],
        lineHeight: FontSize.sm[1],
    },
    lg: {
        paddingHorizontal: Spacing.base,
        paddingVertical: 6,
        borderRadius: Radius.md,
        fontSize: FontSize.base[0],
        lineHeight: FontSize.base[1],
    },
} as const;

type BadgeSize = keyof typeof SIZE_STYLES;

// ── Props ──────────────────────────────────────────────────
interface BadgeProps {
    /** The text to display */
    label: string;
    /** Category key for automatic color mapping, or custom color */
    category?: string;
    /** Override background color */
    bgColor?: string;
    /** Override text color */
    textColor?: string;
    /** Size variant */
    size?: BadgeSize;
    /** Custom style */
    style?: ViewStyle;
}

export function Badge({
    label,
    category,
    bgColor,
    textColor,
    size = "md",
    style,
}: BadgeProps) {
    // Resolve colors from category or custom props
    const catKey = category?.toLowerCase();
    const catColors = catKey && CATEGORY_COLORS[catKey]
        ? CATEGORY_COLORS[catKey]
        : CATEGORY_COLORS.accent;

    const resolvedBg = bgColor || catColors.bg;
    const resolvedText = textColor || catColors.text;
    const s = SIZE_STYLES[size];

    const containerStyle: ViewStyle = {
        backgroundColor: resolvedBg,
        paddingHorizontal: s.paddingHorizontal,
        paddingVertical: s.paddingVertical,
        borderRadius: s.borderRadius,
        alignSelf: "flex-start",
    };

    const labelStyle: TextStyle = {
        color: resolvedText,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: FontWeight.bold,
    };

    return (
        <View style={[containerStyle, style]}>
            <Text style={labelStyle}>{label}</Text>
        </View>
    );
}
