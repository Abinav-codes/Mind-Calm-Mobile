// ─────────────────────────────────────────────────────────────
// AmbientOrbs — Floating background glow orbs
// ─────────────────────────────────────────────────────────────
// Adds depth and subtle motion to dark screens. Each orb
// drifts slowly with a breathing opacity cycle.
// ─────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OrbConfig {
    color: string;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
}

const ORBS: OrbConfig[] = [
    { color: "#8B5CF6", size: 200, x: -40, y: 60, duration: 8000, delay: 0 },
    { color: "#6282E3", size: 160, x: SCREEN_WIDTH - 80, y: 280, duration: 10000, delay: 500 },
    { color: "#34D399", size: 120, x: 30, y: 520, duration: 7000, delay: 1000 },
    { color: "#FB923C", size: 140, x: SCREEN_WIDTH - 120, y: 700, duration: 9000, delay: 300 },
];

function Orb({ color, size, x, y, duration, delay }: OrbConfig) {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.12);

    useEffect(() => {
        const timeout = setTimeout(() => {
            translateY.value = withRepeat(
                withTiming(30, { duration, easing: Easing.inOut(Easing.sin) }),
                -1,
                true
            );
            opacity.value = withRepeat(
                withTiming(0.2, { duration: duration * 0.8, easing: Easing.inOut(Easing.sin) }),
                -1,
                true
            );
        }, delay);
        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: "absolute",
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                },
                styles.orb,
            ]}
        />
    );
}

export function AmbientOrbs() {
    return (
        <>
            {ORBS.map((orb, i) => (
                <Orb key={i} {...orb} />
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    orb: {
        // The blur is simulated by making the orb large, low-opacity,
        // and relying on the backgroundColor being semi-transparent
    },
});
