import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { Button } from "../../../src/components/ui/Button";
import { GlassCard } from "../../../src/components/ui/GlassCard";
import { ScreenWrapper } from "../../../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Spacing } from "../../../src/constants/theme";
import { selectQuizHistory, useAppStore } from "../../../src/stores/appStore";

const { width } = Dimensions.get("window");

// ── Content Configuration ─────────────────────────────────────
const CATEGORY_CONTENT: Record<string, { title: string; subtitle: string; icon: any; color: string; duration: string }> = {
    stress: {
        title: "Stress Assessment",
        subtitle: "Check in on your stress levels and identify your triggers to find better balance.",
        icon: "leaf",
        color: "#34D399",
        duration: "1 min",
    },
    sleep: {
        title: "Sleep Quality",
        subtitle: "Evaluate your recent rest and get actionable tips for a better night's sleep.",
        icon: "moon",
        color: "#6282E3",
        duration: "1 min",
    },
    mindfulness: {
        title: "Mindfulness Check",
        subtitle: "See how present and grounded you've been feeling lately.",
        icon: "eye",
        color: "#8B5CF6",
        duration: "1.5 mins",
    },
};

export default function QuizIntroScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const quizHistory = useAppStore(selectQuizHistory);

    // Normalize category (e.g., 'Stress' -> 'stress')
    const categoryKey = (category || "stress").toLowerCase();
    const content = CATEGORY_CONTENT[categoryKey] || CATEGORY_CONTENT.stress;

    // Filter history for THIS specific category and sort by newest first
    const categoryHistory = useMemo(() => {
        return quizHistory
            .filter((q) => q.category.toLowerCase() === categoryKey)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [quizHistory, categoryKey]);

    const latestResult = categoryHistory.length > 0 ? categoryHistory[0] : null;

    return (
        <ScreenWrapper scroll>
            {/* Header */}
            <View className="px-6 mb-8" style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
            </View>

            <View className="px-6" style={{ flex: 1, paddingBottom: Spacing["4xl"] }}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 20,
                            backgroundColor: `${content.color}25`,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: Spacing.xl,
                        }}
                    >
                        <Ionicons name={content.icon} size={32} color={content.color} />
                    </View>

                    <Text style={{ color: "white", fontSize: FontSize["3xl"][0], fontWeight: "700", marginBottom: Spacing.sm }}>
                        {content.title}
                    </Text>
                    <Text style={{ color: Colors.text.secondary, fontSize: FontSize.lg[0], lineHeight: FontSize.lg[1], marginBottom: Spacing["2xl"] }}>
                        {content.subtitle}
                    </Text>
                </Animated.View>

                {/* History Section */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: Spacing["4xl"] }}>
                    <Text style={{ color: "white", fontSize: FontSize.xl[0], fontWeight: "600", marginBottom: Spacing.md }}>
                        Your Progress
                    </Text>

                    {categoryHistory.length === 0 ? (
                        <GlassCard variant="outlined" style={{ alignItems: "center", paddingVertical: Spacing.xl }}>
                            <Ionicons name="calendar-outline" size={32} color={Colors.text.dim} style={{ marginBottom: Spacing.sm }} />
                            <Text style={{ color: Colors.text.dim, textAlign: "center" }}>
                                Note: You haven't taken this assessment yet. Take it to establish your baseline!
                            </Text>
                        </GlassCard>
                    ) : (
                        <View style={{ gap: Spacing.md }}>
                            {categoryHistory.slice(0, 3).map((result, index) => {
                                const date = new Date(result.created_at);
                                const isLatest = index === 0;

                                return (
                                    <Animated.View key={result.id || index} entering={FadeInRight.delay(300 + index * 100).springify()}>
                                        <GlassCard
                                            variant={isLatest ? "default" : "outlined"}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: Spacing.lg,
                                                borderColor: isLatest ? Colors.accent : "rgba(255,255,255,0.05)",
                                                borderWidth: 1,
                                            }}
                                        >
                                            <View>
                                                <Text style={{ color: isLatest ? "white" : Colors.text.secondary, fontSize: FontSize.md[0], fontWeight: "600", marginBottom: 4 }}>
                                                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    {isLatest ? " (Latest)" : ""}
                                                </Text>
                                                <Text style={{ color: Colors.text.dim, fontSize: FontSize.sm[0] }}>
                                                    Score: {result.score || "--"} / 100
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: result.summary?.includes("High stress") || (result.score && result.score < 50) ? `${Colors.warning}20` : `${Colors.success}20`,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 12,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: result.summary?.includes("High stress") || (result.score && result.score < 50) ? Colors.warning : Colors.success,
                                                        fontSize: FontSize.xs[0],
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {result.summary || "Completed"}
                                                </Text>
                                            </View>
                                        </GlassCard>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    )}
                </Animated.View>

                {/* Info Pills */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={{ flexDirection: "row", gap: Spacing.md, marginBottom: Spacing["4xl"] }}>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}>
                        <Ionicons name="time-outline" size={16} color={Colors.text.dim} />
                        <Text style={{ color: Colors.text.secondary, marginLeft: 6, fontSize: FontSize.sm[0] }}>{content.duration}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}>
                        <Ionicons name="list-outline" size={16} color={Colors.text.dim} />
                        <Text style={{ color: Colors.text.secondary, marginLeft: 6, fontSize: FontSize.sm[0] }}>5 Questions</Text>
                    </View>
                </Animated.View>

                {/* Start Action */}
                <Animated.View entering={FadeInDown.delay(500).springify()} style={{ marginTop: "auto" }}>
                    <Button
                        title={latestResult ? "Retake Assessment" : "Start Assessment"}
                        onPress={() => router.replace(`/quiz/${categoryKey}` as any)}
                        variant="primary"
                        size="xl"
                        fullWidth
                        icon="arrow-forward"
                        iconPosition="right"
                    />
                </Animated.View>
            </View>
        </ScreenWrapper>
    );
}
