// ─────────────────────────────────────────────────────────────
// PressableScale — Tactile press animation wrapper
// ─────────────────────────────────────────────────────────────
// Wraps any child with a spring-based scale-down on press.
// Replaces TouchableOpacity for a more premium 3D feel.
// ─────────────────────────────────────────────────────────────

import React from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    /** Scale factor when pressed (default 0.96) */
    scale?: number;
    disabled?: boolean;
}

export function PressableScale({
    children,
    onPress,
    style,
    scale = 0.96,
    disabled = false,
}: PressableScaleProps) {
    const pressed = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pressed.value }],
    }));

    return (
        <AnimatedPressable
            onPressIn={() => {
                pressed.value = withSpring(scale, { damping: 15, stiffness: 300 });
            }}
            onPressOut={() => {
                pressed.value = withSpring(1, { damping: 12, stiffness: 200 });
            }}
            onPress={onPress}
            disabled={disabled}
            style={[animatedStyle, style]}
        >
            {children}
        </AnimatedPressable>
    );
}
