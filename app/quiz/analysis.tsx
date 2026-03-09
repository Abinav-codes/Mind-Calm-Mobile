import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button } from "../../src/components/ui/Button";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { ScreenWrapper } from "../../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Spacing } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { useAppStore } from "../../src/stores/appStore";

// ── Dynamic Content Map ────────────────────────────────────
type ActionCard = { icon: any; title: string; description: string; actionText: string; route: string; color: string; };

const getDynamicContent = (categoryKey: string, score: number) => {
    const isGood = score >= 70;
    const isModerate = score >= 40 && score < 70;

    // Default fallback
    let content = {
        label: "Wellness Check Complete",
        tips: ["Continue building healthy habits", "Take a moment to breathe"],
        actions: [
            { icon: "water", title: "Find Center", description: "Take a moment to ground yourself.", actionText: "Breathe Now", route: "/breathe", color: "#8B5CF6" } as ActionCard
        ]
    };

    if (categoryKey === "stress") {
        if (isGood) {
            content.label = "You're managing stress well!";
            content.tips = ["Keep up your current routines", "Reflect on what's working well"];
            content.actions = [{ icon: "leaf", title: "Daily Check-in", description: "Log your mood to maintain your streak.", actionText: "Log Mood", route: "/(tabs)", color: Colors.success }];
        } else if (isModerate) {
            content.label = "Showing some signs of stress";
            content.tips = ["Pace yourself throughout the day", "Take short micro-breaks"];
            content.actions = [
                { icon: "water", title: "Quick Reset", description: "Try a 2-minute box breathing session.", actionText: "Breathe", route: "/breathe", color: Colors.accent },
                { icon: "book", title: "Journal It", description: "Write down what's on your mind.", actionText: "Log Thoughts", route: "/(tabs)", color: "#10B981" }
            ];
        } else {
            content.label = "High stress — let's work on this";
            content.tips = ["Step away for 5 minutes right now", "Focus only on immediate priorities"];
            content.actions = [{ icon: "warning", title: "SOS Grounding", description: "Immediate panic/anxiety relief exercise.", actionText: "Start SOS", route: "/breathe", color: Colors.warning }];
        }
    } else if (categoryKey === "sleep") {
        if (isGood) {
            content.label = "Great sleep habits!";
            content.tips = ["Maintain your consistent bedtime", "Keep your evening wind-down routine"];
            content.actions = [{ icon: "moon", title: "Sleep Stats", description: "Log how you felt waking up.", actionText: "Check In", route: "/(tabs)", color: Colors.accent }];
        } else {
            content.label = "Your sleep needs attention";
            content.tips = ["Avoid screens 1 hour before bed", "Try a body scan meditation tonight"];
            content.actions = [{ icon: "water", title: "Wind Down", description: "A gentle breathing exercise for sleep.", actionText: "Start", route: "/breathe", color: "#8B5CF6" }];
        }
    } else if (categoryKey === "mindfulness") {
        if (isGood) {
            content.label = "Highly present and aware";
            content.tips = ["Notice the small details today", "Share your calm energy"];
            content.actions = [{ icon: "eye", title: "Mindful Moment", description: "Continue your streak.", actionText: "Home", route: "/(tabs)", color: Colors.success }];
        } else {
            content.label = "Feeling a bit disconnected";
            content.tips = ["Do one thing at a time today", "Focus on your physical senses"];
            content.actions = [{ icon: "water", title: "Return to Center", description: "Use breathing to anchor yourself.", actionText: "Breathe", route: "/breathe", color: Colors.accent }];
        }
    }

    return content;
};

export default function AnalysisScreen() {
    const { category, score, answers } = useLocalSearchParams<{
        category: string;
        score: string;
        answers: string;
    }>();

    const saveQuizResult = useAppStore((s) => s.saveQuizResult);
    const { user } = useAuth();

    const numericScore = parseInt(score || "0", 10);
    const categoryKey = (category || "stress").toLowerCase();
    const dynamicContent = getDynamicContent(categoryKey, numericScore);

    useEffect(() => {
        if (user?.id) {
            saveQuizResult(user.id, categoryKey, {
                score: numericScore,
                summary: dynamicContent.label,
                plan: dynamicContent.tips,
            });
        }
    }, []);

    const getScoreColor = () => {
        if (numericScore >= 70) return Colors.success;
        if (numericScore >= 40) return Colors.accent;
        return Colors.warning;
    };

    return (
        <ScreenWrapper scroll>
            {/* Header / Nav */}
            <View className="px-6 mb-6" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => router.replace("/(tabs)")} activeOpacity={0.7}>
                    <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={{ color: Colors.text.secondary, fontSize: FontSize.md[0], fontWeight: "600" }}>Analysis</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Score Circle */}
            <Animated.View
                entering={FadeInDown.delay(200).springify()}
                style={{ alignItems: "center", marginBottom: Spacing["4xl"] }}
            >
                <View
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 80,
                        borderWidth: 6,
                        borderColor: getScoreColor(),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: `${getScoreColor()}15`,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 56,
                            fontWeight: "800",
                            color: getScoreColor(),
                        }}
                    >
                        {numericScore}
                    </Text>
                    <Text style={{ color: Colors.text.muted, fontSize: FontSize.xs[0], textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                        {categoryKey} Score
                    </Text>
                </View>
            </Animated.View>

            {/* Summary Text */}
            <Animated.View
                entering={FadeInDown.delay(300).springify()}
                className="px-6 mb-8"
            >
                <Text style={{ color: "white", fontSize: FontSize["2xl"][0], fontWeight: "bold", textAlign: "center", marginBottom: Spacing.sm }}>
                    {dynamicContent.label}
                </Text>
                <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], textAlign: "center", lineHeight: 22 }}>
                    Based on your responses, here is a personalized action plan to help you improve or maintain your current state.
                </Text>
            </Animated.View>

            {/* Action Cards */}
            <Animated.View
                entering={FadeInDown.delay(400).springify()}
                className="px-6 mb-8"
            >
                <Text style={{ color: "white", fontSize: FontSize.lg[0], fontWeight: "bold", marginBottom: Spacing.md }}>
                    Recommended Actions
                </Text>
                <View style={{ gap: Spacing.md }}>
                    {dynamicContent.actions.map((action, i) => (
                        <GlassCard key={i} variant="default" style={{ padding: 0, overflow: "hidden", borderColor: `${action.color}40`, borderWidth: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: Spacing.lg }}>
                                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${action.color}20`, justifyContent: "center", alignItems: "center", marginRight: Spacing.md }}>
                                    <Ionicons name={action.icon} size={24} color={action.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: "white", fontSize: FontSize.base[0], fontWeight: "bold", marginBottom: 2 }}>{action.title}</Text>
                                    <Text style={{ color: Colors.text.secondary, fontSize: FontSize.sm[0], lineHeight: 18 }}>{action.description}</Text>
                                </View>
                            </View>
                            {/* Card Footer Button */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => router.replace(action.route as any)}
                                style={{ backgroundColor: action.color, paddingVertical: Spacing.sm, alignItems: "center" }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "700", fontSize: FontSize.sm[0] }}>
                                    {action.actionText} →
                                </Text>
                            </TouchableOpacity>
                        </GlassCard>
                    ))}
                </View>
            </Animated.View>

            {/* Quick Tips */}
            <Animated.View
                entering={FadeInDown.delay(500).springify()}
                className="px-6 mb-10"
            >
                <Text style={{ color: "white", fontSize: FontSize.lg[0], fontWeight: "bold", marginBottom: Spacing.md }}>
                    Quick Tips
                </Text>
                <GlassCard variant="outlined" style={{ gap: Spacing.sm }}>
                    {dynamicContent.tips.map((tip, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            <Ionicons name="checkmark-circle" size={18} color={getScoreColor()} style={{ marginRight: Spacing.sm, marginTop: 2 }} />
                            <Text style={{ color: Colors.text.secondary, fontSize: FontSize.sm[0], lineHeight: 22, flex: 1 }}>
                                {tip}
                            </Text>
                        </View>
                    ))}
                </GlassCard>
            </Animated.View>

            {/* Done Button */}
            <Animated.View
                entering={FadeInUp.delay(700).springify()}
                className="px-6"
                style={{ paddingBottom: Spacing["4xl"] }}
            >
                <Button
                    title="Done"
                    onPress={() => router.replace("/(tabs)")}
                    variant="outline"
                    size="xl"
                    fullWidth
                />
            </Animated.View>
        </ScreenWrapper>
    );
}
