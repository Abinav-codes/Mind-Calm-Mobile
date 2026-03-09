// ─────────────────────────────────────────────────────────────
// Button — Animated, haptic-enabled button component
// ─────────────────────────────────────────────────────────────
// Follows react-native-architecture Pattern 5 (animated Pressable)
// and tailwind-design-system CVA variant pattern (adapted for RN).
// ─────────────────────────────────────────────────────────────

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextStyle,
    ViewStyle
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Variants ───────────────────────────────────────────────
const VARIANT_STYLES: Record<string, { bg: string; text: string; border?: string }> = {
    primary: {
        bg: Colors.accent,
        text: "#FFFFFF",
    },
    secondary: {
        bg: Colors.surface.elevated,
        text: Colors.text.primary,
        border: Colors.border.default,
    },
    success: {
        bg: Colors.success,
        text: "#FFFFFF",
    },
    danger: {
        bg: Colors.danger,
        text: "#FFFFFF",
    },
    ghost: {
        bg: "transparent",
        text: Colors.text.secondary,
    },
    outline: {
        bg: "transparent",
        text: Colors.accent,
        border: Colors.accent,
    },
};

type ButtonVariant = keyof typeof VARIANT_STYLES;

// ── Sizes ──────────────────────────────────────────────────
const SIZE_STYLES: Record<string, { height: number; px: number; fontSize: number; lineHeight: number; iconSize: number }> = {
    sm: { height: 36, px: Spacing.md, fontSize: FontSize.sm[0], lineHeight: FontSize.sm[1], iconSize: 16 },
    md: { height: 44, px: Spacing.lg, fontSize: FontSize.base[0], lineHeight: FontSize.base[1], iconSize: 18 },
    lg: { height: 52, px: Spacing.xl, fontSize: FontSize.md[0], lineHeight: FontSize.md[1], iconSize: 22 },
    xl: { height: 56, px: Spacing["2xl"], fontSize: FontSize.lg[0], lineHeight: FontSize.lg[1], iconSize: 24 },
};

type ButtonSize = keyof typeof SIZE_STYLES;

// ── Props ──────────────────────────────────────────────────
interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Full width */
    fullWidth?: boolean;
    /** Disable button */
    disabled?: boolean;
    /** Show loading spinner */
    loading?: boolean;
    /** Icon name (Ionicons) */
    icon?: keyof typeof Ionicons.glyphMap;
    /** Icon position */
    iconPosition?: "left" | "right";
    /** Custom styles */
    style?: ViewStyle;
    /** Custom text styles */
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    icon,
    iconPosition = "left",
    style,
    textStyle,
}: ButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    }, []);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, []);

    const handlePress = useCallback(() => {
        if (!disabled && !loading) onPress();
    }, [disabled, loading, onPress]);

    const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
    const s = SIZE_STYLES[size] || SIZE_STYLES.md;

    const containerStyle: ViewStyle = {
        height: s.height,
        paddingHorizontal: s.px,
        backgroundColor: v.bg,
        borderRadius: Radius.base,
        borderWidth: v.border ? 1 : 0,
        borderColor: v.border || "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.sm,
        opacity: disabled ? 0.5 : 1,
        ...(fullWidth ? { width: "100%" } : { alignSelf: "flex-start" }),
    };

    const labelStyle: TextStyle = {
        color: v.text,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: FontWeight.bold,
    };

    const renderIcon = () => {
        if (!icon) return null;
        return <Ionicons name={icon} size={s.iconSize} color={v.text} />;
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[containerStyle, animatedStyle, style]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={v.text} />
            ) : (
                <>
                    {icon && iconPosition === "left" && renderIcon()}
                    <Text style={[labelStyle, textStyle]}>{title}</Text>
                    {icon && iconPosition === "right" && renderIcon()}
                </>
            )}
        </AnimatedPressable>
    );
}
