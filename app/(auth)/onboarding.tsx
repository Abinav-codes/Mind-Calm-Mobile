import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAppStore } from "../../src/stores/appStore";

const GOALS = [
    { id: "stress", label: "Reduce Stress", icon: "leaf-outline", color: "#34D399" },
    { id: "sleep", label: "Sleep Better", icon: "moon-outline", color: "#6282E3" },
    { id: "mindfulness", label: "Be More Mindful", icon: "eye-outline", color: "#8B5CF6" },
    { id: "self", label: "Self-Improvement", icon: "trending-up-outline", color: "#FB923C" },
    { id: "anxiety", label: "Manage Anxiety", icon: "heart-outline", color: "#F472B6" },
    { id: "focus", label: "Improve Focus", icon: "bulb-outline", color: "#FBBF24" },
];

export default function OnboardingScreen() {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleGoal = (id: string) => {
        setSelectedGoals((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        // Store goals locally — they'll be saved to Supabase after signup
        useAppStore.setState({
            goals: selectedGoals.map(id => {
                const goal = GOALS.find(g => g.id === id);
                return goal?.label || id;
            })
        });
        router.replace("/(auth)/login");
    };

    return (
        <LinearGradient
            colors={["#1B2250", "#0F1535", "#1B2250"]}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 80 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Text className="text-white text-4xl font-bold text-center mb-2">
                        Welcome to{"\n"}MindCalm
                    </Text>
                    <Text className="text-text-muted text-center text-base mb-10 leading-6">
                        What brings you here today?{"\n"}Pick all that apply.
                    </Text>
                </Animated.View>

                {/* Goal Cards */}
                <View className="gap-3 mb-8">
                    {GOALS.map((goal, index) => {
                        const isSelected = selectedGoals.includes(goal.id);
                        return (
                            <Animated.View
                                key={goal.id}
                                entering={FadeInDown.delay(300 + index * 80).springify()}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleGoal(goal.id)}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 16,
                                        paddingHorizontal: 20,
                                        borderRadius: 16,
                                        backgroundColor: isSelected
                                            ? `${goal.color}20`
                                            : "rgba(255,255,255,0.05)",
                                        borderWidth: 1.5,
                                        borderColor: isSelected ? goal.color : "rgba(255,255,255,0.08)",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 22,
                                            backgroundColor: `${goal.color}25`,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Ionicons
                                            name={goal.icon as any}
                                            size={22}
                                            color={goal.color}
                                        />
                                    </View>
                                    <Text
                                        className="flex-1 text-white text-base"
                                        style={{ fontWeight: isSelected ? "700" : "500" }}
                                    >
                                        {goal.label}
                                    </Text>
                                    <View
                                        style={{
                                            width: 26,
                                            height: 26,
                                            borderRadius: 13,
                                            borderWidth: 2,
                                            borderColor: isSelected ? goal.color : "rgba(255,255,255,0.2)",
                                            backgroundColor: isSelected ? goal.color : "transparent",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Continue Button */}
                <Animated.View entering={FadeInUp.delay(800).springify()}>
                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={selectedGoals.length === 0}
                        activeOpacity={0.8}
                        style={{
                            paddingVertical: 18,
                            borderRadius: 16,
                            backgroundColor:
                                selectedGoals.length > 0 ? "#6282E3" : "rgba(255,255,255,0.1)",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Text
                            className="text-white text-lg"
                            style={{ fontWeight: "700" }}
                        >
                            Continue
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.replace("/(auth)/login")}
                        activeOpacity={0.6}
                    >
                        <Text className="text-text-muted text-center text-sm">
                            Already have an account? Sign in
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </LinearGradient>
    );
}
