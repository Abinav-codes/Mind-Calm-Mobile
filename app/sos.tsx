import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Easing,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const GROUNDING_STEPS = [
    {
        number: 5,
        sense: "SEE",
        emoji: "👀",
        prompt: "Name 5 things you can SEE right now",
        examples: "Look around slowly. Notice colors, shapes, textures...",
        color: "#6282E3",
    },
    {
        number: 4,
        sense: "TOUCH",
        emoji: "✋",
        prompt: "Name 4 things you can TOUCH",
        examples: "Feel the texture of your clothes, the surface beneath you...",
        color: "#8B5CF6",
    },
    {
        number: 3,
        sense: "HEAR",
        emoji: "👂",
        prompt: "Name 3 things you can HEAR",
        examples: "Listen carefully. Traffic, birds, your own breathing...",
        color: "#34D399",
    },
    {
        number: 2,
        sense: "SMELL",
        emoji: "👃",
        prompt: "Name 2 things you can SMELL",
        examples: "Fresh air, food, coffee, your own scent...",
        color: "#FB923C",
    },
    {
        number: 1,
        sense: "TASTE",
        emoji: "👅",
        prompt: "Name 1 thing you can TASTE",
        examples: "Even the inside of your mouth has a taste...",
        color: "#F472B6",
    },
];

export default function SOSScreen() {
    const [step, setStep] = useState(-1); // -1 = intro
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));

    const handleNext = () => {
        if (step < GROUNDING_STEPS.length - 1) {
            setStep((prev) => prev + 1);
        } else {
            setStep(GROUNDING_STEPS.length); // completion
        }
    };

    const currentStep = step >= 0 && step < GROUNDING_STEPS.length ? GROUNDING_STEPS[step] : null;
    const isComplete = step >= GROUNDING_STEPS.length;

    return (
        <LinearGradient colors={["#1B2250", "#0F1535"]} style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingTop: 60 }}>
                {/* Header */}
                <View className="px-6 mb-6" style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold ml-4">SOS — Instant Calm</Text>
                </View>

                {/* Intro */}
                {step === -1 && (
                    <Animated.View
                        entering={FadeInDown.springify()}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 32,
                        }}
                    >
                        <Animated.View style={pulseStyle}>
                            <View
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 60,
                                    backgroundColor: "rgba(239,68,68,0.15)",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 32,
                                }}
                            >
                                <Text style={{ fontSize: 48 }}>🆘</Text>
                            </View>
                        </Animated.View>

                        <Text className="text-white text-2xl font-bold text-center mb-3">
                            You're Safe Here
                        </Text>
                        <Text
                            className="text-text-muted text-center text-sm leading-5 mb-10"
                        >
                            Let's do a 5-4-3-2-1 grounding exercise together.{"\n"}
                            This technique uses your senses to bring you{"\n"}
                            back to the present moment.
                        </Text>

                        <TouchableOpacity
                            onPress={handleNext}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: "#6282E3",
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                                borderRadius: 16,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "700",
                                    fontSize: 16,
                                }}
                            >
                                Begin Exercise
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Grounding Step */}
                {currentStep && (
                    <Animated.View
                        key={step}
                        entering={FadeInDown.springify()}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 32,
                        }}
                    >
                        {/* Progress dots */}
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 8,
                                marginBottom: 40,
                            }}
                        >
                            {GROUNDING_STEPS.map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: i === step ? 24 : 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor:
                                            i === step
                                                ? currentStep.color
                                                : i < step
                                                    ? `${currentStep.color}60`
                                                    : "rgba(255,255,255,0.1)",
                                    }}
                                />
                            ))}
                        </View>

                        {/* Number */}
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: `${currentStep.color}20`,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 24,
                            }}
                        >
                            <Text style={{ fontSize: 48 }}>{currentStep.emoji}</Text>
                        </View>

                        <Text
                            style={{
                                color: currentStep.color,
                                fontSize: 12,
                                fontWeight: "700",
                                letterSpacing: 3,
                                marginBottom: 8,
                            }}
                        >
                            {currentStep.sense}
                        </Text>

                        <Text className="text-white text-2xl font-bold text-center mb-3 leading-8">
                            {currentStep.prompt}
                        </Text>

                        <Text className="text-text-muted text-center text-sm leading-5 mb-10">
                            {currentStep.examples}
                        </Text>

                        <TouchableOpacity
                            onPress={handleNext}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: currentStep.color,
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                                borderRadius: 16,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                                {step < GROUNDING_STEPS.length - 1 ? "Next Sense →" : "Complete"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Completion */}
                {isComplete && (
                    <Animated.View
                        entering={FadeInDown.springify()}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 32,
                        }}
                    >
                        <Text style={{ fontSize: 64, marginBottom: 24 }}>🌟</Text>
                        <Text className="text-white text-2xl font-bold text-center mb-3">
                            You Did It
                        </Text>
                        <Text className="text-text-muted text-center text-sm leading-5 mb-10">
                            Take a moment to notice how you feel now.{"\n"}
                            You are grounded. You are present.{"\n"}
                            You are safe.
                        </Text>

                        <View style={{ gap: 12, width: "100%" }}>
                            <TouchableOpacity
                                onPress={() => router.replace("/(tabs)/breathe" as any)}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: "#6282E3",
                                    paddingVertical: 16,
                                    borderRadius: 16,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                                    🫧 Continue to Breathing
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                activeOpacity={0.7}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    paddingVertical: 16,
                                    borderRadius: 16,
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "rgba(255,255,255,0.08)",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "rgba(255,255,255,0.7)",
                                        fontWeight: "600",
                                        fontSize: 15,
                                    }}
                                >
                                    I'm Feeling Better
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </View>
        </LinearGradient>
    );
}
