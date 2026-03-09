import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
    FadeInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const BUBBLE_SIZE = width * 0.55;

const PATTERNS = [
    { id: "relax", label: "Relax", pattern: "4-7-8", inhale: 4, hold: 7, exhale: 8, color: "#6282E3" },
    { id: "balance", label: "Balance", pattern: "Box", inhale: 4, hold: 4, exhale: 4, color: "#8B5CF6" },
    { id: "focus", label: "Focus", pattern: "4-4", inhale: 4, hold: 0, exhale: 4, color: "#34D399" },
];

export default function BreatheScreen() {
    const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");
    const [countdown, setCountdown] = useState(0);

    const scale = useSharedValue(0.6);
    const opacity = useSharedValue(0.5);

    const animatedBubbleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    useEffect(() => {
        if (!isActive) {
            // Gentle idle pulsing
            scale.value = withRepeat(
                withSequence(
                    withTiming(0.65, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 2000 }),
                    withTiming(0.4, { duration: 2000 })
                ),
                -1,
                true
            );
            return;
        }

        // Active breathing cycle
        const runCycle = () => {
            const { inhale, hold, exhale } = selectedPattern;

            // Inhale
            setPhase("inhale");
            setCountdown(inhale);
            scale.value = withTiming(1, {
                duration: inhale * 1000,
                easing: Easing.inOut(Easing.ease),
            });
            opacity.value = withTiming(0.9, { duration: inhale * 1000 });

            // Hold
            setTimeout(() => {
                if (hold > 0) {
                    setPhase("hold");
                    setCountdown(hold);
                }
            }, inhale * 1000);

            // Exhale
            setTimeout(() => {
                setPhase("exhale");
                setCountdown(exhale);
                scale.value = withTiming(0.6, {
                    duration: exhale * 1000,
                    easing: Easing.inOut(Easing.ease),
                });
                opacity.value = withTiming(0.4, { duration: exhale * 1000 });
            }, (inhale + hold) * 1000);

            // Loop
            const totalTime = (inhale + hold + exhale) * 1000;
            return totalTime;
        };

        const totalTime = runCycle();
        const interval = setInterval(runCycle, totalTime);

        return () => clearInterval(interval);
    }, [isActive, selectedPattern]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const toggleBreathing = () => {
        const newActive = !isActive;
        setIsActive(newActive);
        if (!newActive) {
            setPhase("idle");
            setCountdown(0);
        }
    };

    const getPhaseText = () => {
        switch (phase) {
            case "inhale": return "Breathe In";
            case "hold": return "Hold";
            case "exhale": return "Breathe Out";
            default: return "Tap to Start";
        }
    };

    return (
        <LinearGradient colors={["#1B2250", "#0F1535"]} style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                {/* Phase Text */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    style={{ position: "absolute", top: 80 }}
                >
                    <Text className="text-text-muted text-sm text-center uppercase tracking-widest">
                        {selectedPattern.label} · {selectedPattern.pattern}
                    </Text>
                </Animated.View>

                {/* Breathing Bubble */}
                <TouchableOpacity
                    onPress={toggleBreathing}
                    activeOpacity={0.9}
                >
                    <Animated.View
                        style={[
                            {
                                width: BUBBLE_SIZE,
                                height: BUBBLE_SIZE,
                                borderRadius: BUBBLE_SIZE / 2,
                                justifyContent: "center",
                                alignItems: "center",
                            },
                            animatedBubbleStyle,
                        ]}
                    >
                        <LinearGradient
                            colors={[`${selectedPattern.color}60`, `${selectedPattern.color}20`]}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: BUBBLE_SIZE / 2,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1.5,
                                borderColor: `${selectedPattern.color}40`,
                            }}
                        >
                            <Text className="text-white text-xl font-bold">
                                {getPhaseText()}
                            </Text>
                            {countdown > 0 && (
                                <Text
                                    className="text-text-secondary text-4xl font-bold mt-2"
                                >
                                    {countdown}
                                </Text>
                            )}
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>

                {/* Pattern Selector */}
                <Animated.View
                    entering={FadeInDown.delay(400).springify()}
                    style={{
                        position: "absolute",
                        bottom: 140,
                        flexDirection: "row",
                        gap: 12,
                    }}
                >
                    {PATTERNS.map((pattern) => {
                        const isSelected = selectedPattern.id === pattern.id;
                        return (
                            <TouchableOpacity
                                key={pattern.id}
                                onPress={() => {
                                    setSelectedPattern(pattern);
                                    if (isActive) {
                                        setIsActive(false);
                                        setPhase("idle");
                                    }
                                }}
                                activeOpacity={0.7}
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    borderRadius: 30,
                                    backgroundColor: isSelected
                                        ? `${pattern.color}30`
                                        : "rgba(255,255,255,0.06)",
                                    borderWidth: 1,
                                    borderColor: isSelected
                                        ? `${pattern.color}60`
                                        : "rgba(255,255,255,0.08)",
                                }}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? pattern.color : "rgba(255,255,255,0.5)",
                                        fontWeight: isSelected ? "700" : "500",
                                        fontSize: 13,
                                    }}
                                >
                                    {pattern.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </View>
        </LinearGradient>
    );
}
