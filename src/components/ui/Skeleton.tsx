// ─────────────────────────────────────────────────────────────
// Skeleton — Shimmer loading placeholder
// ─────────────────────────────────────────────────────────────
// Displays a pulsing placeholder while content is loading.
// Matches the glassmorphism aesthetic with subtle shimmer.
//
// Usage:
//   <Skeleton width={120} height={20} />           // text line
//   <Skeleton width={60} height={60} radius={30} /> // avatar
//   <Skeleton height={140} />                       // full-width card
// ─────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { Radius } from "../../constants/theme";

interface SkeletonProps {
    /** Width (default: 100%) */
    width?: number | `${number}%`;
    /** Height in px */
    height: number;
    /** Border radius (default: Radius.base = 12) */
    radius?: number;
    /** Custom style */
    style?: ViewStyle;
}

export function Skeleton({
    width,
    height,
    radius = Radius.base,
    style,
}: SkeletonProps) {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width: width ?? "100%",
                    height,
                    borderRadius: radius,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                animatedStyle,
                style,
            ]}
        />
    );
}

// ── Preset Layouts ─────────────────────────────────────────

/** Skeleton placeholder for a stat card (used on Home/Progress) */
export function SkeletonStatCard({ style }: { style?: ViewStyle }) {
    return (
        <View
            style={[
                {
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: Radius.lg,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.06)",
                    gap: 8,
                },
                style,
            ]}
        >
            <Skeleton width={32} height={32} radius={16} />
            <Skeleton width={40} height={22} radius={6} />
            <Skeleton width={50} height={12} radius={4} />
        </View>
    );
}

/** Skeleton placeholder for a list item card */
export function SkeletonListCard({ style }: { style?: ViewStyle }) {
    return (
        <View
            style={[
                {
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: Radius.lg,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.06)",
                },
                style,
            ]}
        >
            <Skeleton width={40} height={40} radius={20} />
            <View style={{ flex: 1, gap: 6 }}>
                <Skeleton width="60%" height={14} radius={4} />
                <Skeleton width="40%" height={10} radius={4} />
            </View>
            <Skeleton width={36} height={18} radius={4} />
        </View>
    );
}
