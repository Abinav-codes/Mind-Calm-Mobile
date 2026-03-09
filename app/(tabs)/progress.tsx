import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Badge } from "../../src/components/ui/Badge";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { MoodTrendChart } from "../../src/components/ui/MoodTrendChart";
import { ScreenWrapper } from "../../src/components/ui/ScreenWrapper";
import { SkeletonListCard, SkeletonStatCard } from "../../src/components/ui/Skeleton";
import { StreakCalendar } from "../../src/components/ui/StreakCalendar";
import { Colors, FontSize, Spacing } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { ACHIEVEMENTS, calculateUnlockedAchievements } from "../../src/data/achievements";
import { getMoodEmoji } from "../../src/data/moods";
import {
    selectIsLoading,
    selectIsRefreshing,
    selectLastError,
    selectMoodHistory,
    selectQuizHistory,
    selectStreak,
    selectTotalSessions,
    useAppStore,
} from "../../src/stores/appStore";

export default function ProgressScreen() {
    const { user } = useAuth();
    const streak = useAppStore(selectStreak);
    const totalSessions = useAppStore(selectTotalSessions);
    const quizHistory = useAppStore(selectQuizHistory);
    const moodHistory = useAppStore(selectMoodHistory);
    const fetchUserData = useAppStore((s) => s.fetchUserData);
    const clearError = useAppStore((s) => s.clearError);
    const isRefreshing = useAppStore(selectIsRefreshing);
    const lastError = useAppStore(selectLastError);
    const isLoading = useAppStore(selectIsLoading);

    // Show skeletons on very first load (no data yet, still refreshing)
    const showSkeleton = isRefreshing && moodHistory.length === 0 && quizHistory.length === 0;

    const handleRefresh = useCallback(() => {
        if (user?.id) fetchUserData(user.id);
    }, [user?.id, fetchUserData]);

    // --- Derived Data for UI ---

    // Dates for Streak Calendar
    const moodDates = moodHistory.map((m) => m.created_at);

    // Calculate Last 7 Days Trend
    const trendData = (() => {
        const data = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const entry = moodHistory.find((m) => m.created_at.split("T")[0] === dateStr);

            let val = 0;
            if (entry) {
                if (entry.intensity !== undefined) {
                    val = entry.intensity;
                } else {
                    val = 3; // Default middle
                }
            }

            data.push({ day: dayName, intensity: val });
        }
        return data;
    })();

    // Calculate Weekly Summary
    const weeklySummary = (() => {
        const checkins = trendData.filter(d => d.intensity > 0).length;
        if (checkins === 0) return "No check-ins yet this week.";
        if (checkins === 7) return "Perfect week! You checked in every day. 🌟";
        return `You checked in ${checkins} out of the last 7 days. Keep it up! 💪`;
    })();

    // Calculate Unlocked Achievements
    const unlockedAchievementIds = calculateUnlockedAchievements(moodHistory, quizHistory, streak);

    const screenWidth = Dimensions.get("window").width;

    return (
        <ScreenWrapper scroll refreshing={isRefreshing} onRefresh={handleRefresh} error={lastError} onDismissError={clearError}>

            {/* Header */}
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="px-6 mb-6"
            >
                <Text className="text-white text-2xl font-bold">Progress</Text>
                <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0] }}>
                    Your wellness journey
                </Text>
            </Animated.View>

            {/* Stats Row */}
            <Animated.View
                entering={FadeInDown.delay(200).springify()}
                className="px-6 mb-8"
            >
                {showSkeleton ? (
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </View>
                ) : (
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        {[
                            { label: "Streak", value: `${streak}`, emoji: "🔥" },
                            { label: "Sessions", value: `${totalSessions}`, emoji: "🧘" },
                            { label: "Moods", value: `${moodHistory.length}`, emoji: "💭" },
                        ].map((stat) => (
                            <GlassCard key={stat.label} variant="default" size="md" style={{ flex: 1, alignItems: "center" }}>
                                <Text style={{ fontSize: 24 }}>{stat.emoji}</Text>
                                <Text className="text-white text-xl font-bold mt-1">
                                    {stat.value}
                                </Text>
                                <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>
                                    {stat.label}
                                </Text>
                            </GlassCard>
                        ))}
                    </View>
                )}
            </Animated.View>

            {/* --- 1. Weekly Nudge Summary --- */}
            <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6 mb-8">
                <GlassCard variant="elevated" style={{ backgroundColor: `${Colors.accent}15`, borderColor: `${Colors.accent}40` }}>
                    <Text style={{ color: "white", fontSize: FontSize.base[0], fontWeight: "600", marginBottom: 4 }}>
                        This Week's Snapshot
                    </Text>
                    <Text style={{ color: Colors.text.dim, fontSize: FontSize.sm[0] }}>
                        {weeklySummary}
                    </Text>
                </GlassCard>
            </Animated.View>

            {/* --- 2. Mood Trend Chart --- */}
            <Animated.View entering={FadeInDown.delay(200).springify()} className="px-6 mb-8">
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: Spacing.sm }}>
                    <Text className="text-white text-lg font-bold">Mood Trend</Text>
                    <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>Last 7 Days</Text>
                </View>
                <GlassCard variant="default" style={{ padding: 0, paddingTop: Spacing.md, overflow: "hidden" }}>
                    <MoodTrendChart data={trendData} width={screenWidth - 48} height={180} />
                    {/* X-Axis Labels */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, paddingTop: 4 }}>
                        {trendData.map((d, i) => (
                            <Text key={i} style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], width: 30, textAlign: "center" }}>
                                {d.day.charAt(0)}
                            </Text>
                        ))}
                    </View>
                </GlassCard>
            </Animated.View>

            {/* --- 3. Streak Calendar (Contribution Graph) --- */}
            <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-8">
                <View className="px-6 mb-2">
                    <Text className="text-white text-lg font-bold">Check-in Activity</Text>
                    <Text style={{ color: Colors.text.dim, fontSize: FontSize.sm[0] }}>Consistency builds habits.</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}>
                    <GlassCard variant="default" style={{ padding: Spacing.sm }}>
                        <StreakCalendar dates={moodDates} />
                    </GlassCard>
                </ScrollView>
            </Animated.View>

            {/* --- 4. Badges & Achievements --- */}
            <Animated.View entering={FadeInDown.delay(400).springify()} className="px-6 mb-10">
                <Text className="text-white text-lg font-bold mb-4">Milestones</Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.md }}>
                    {Object.values(ACHIEVEMENTS).map((achievement: any) => {
                        const isUnlocked = unlockedAchievementIds.includes(achievement.id);
                        return (
                            <View key={achievement.id} style={{ width: "47%" }}>
                                <GlassCard
                                    variant={isUnlocked ? "elevated" : "outlined"}
                                    style={{
                                        alignItems: "center",
                                        padding: Spacing.md,
                                        borderColor: isUnlocked ? achievement.color : "rgba(255,255,255,0.05)",
                                        opacity: isUnlocked ? 1 : 0.5
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: isUnlocked ? `${achievement.color}20` : "rgba(255,255,255,0.05)",
                                        padding: 12,
                                        borderRadius: 24,
                                        marginBottom: Spacing.sm
                                    }}>
                                        <Ionicons
                                            name={achievement.icon as any}
                                            size={24}
                                            color={isUnlocked ? achievement.color : Colors.text.dim}
                                        />
                                    </View>
                                    <Text style={{ color: "white", fontSize: FontSize.sm[0], fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                                        {achievement.title}
                                    </Text>
                                    <Text style={{ color: Colors.text.dim, fontSize: 10, textAlign: "center", lineHeight: 14 }}>
                                        {isUnlocked ? "Unlocked!" : "Keep going to unlock"}
                                    </Text>
                                </GlassCard>
                            </View>
                        );
                    })}
                </View>
            </Animated.View>

            {/* Recent Quiz Results */}
            <Animated.View
                entering={FadeInDown.delay(300).springify()}
                className="px-6 mb-8"
            >
                <Text className="text-white text-lg font-bold mb-4">
                    Recent Assessments
                </Text>
                {showSkeleton ? (
                    <View style={{ gap: 10 }}>
                        <SkeletonListCard />
                        <SkeletonListCard />
                        <SkeletonListCard />
                    </View>
                ) : quizHistory.length === 0 ? (
                    <GlassCard variant="default" size="lg" style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 40, marginBottom: 8 }}>📝</Text>
                        <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], textAlign: "center" }}>
                            No assessments yet.{"\n"}Take your first quiz to see results here!
                        </Text>
                    </GlassCard>
                ) : (
                    <View style={{ gap: 10 }}>
                        {quizHistory.slice(0, 5).map((result, i) => (
                            <GlassCard key={i} variant="default" size="md">
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.sm }}>
                                            <Badge
                                                label={result.category}
                                                category={result.category}
                                                size="sm"
                                            />
                                        </View>
                                        <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginTop: 4 }}>
                                            {new Date(result.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    {result.score !== undefined && (
                                        <Text style={{ color: Colors.accent, fontWeight: "700", fontSize: FontSize.lg[0] }}>
                                            {result.score}%
                                        </Text>
                                    )}
                                </View>
                            </GlassCard>
                        ))}
                    </View>
                )}
            </Animated.View>

            {/* Recent Mood Logs */}
            <Animated.View
                entering={FadeInDown.delay(400).springify()}
                className="px-6"
            >
                <Text className="text-white text-lg font-bold mb-4">
                    Mood History
                </Text>
                {moodHistory.length === 0 ? (
                    <GlassCard variant="default" size="lg" style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 40, marginBottom: 8 }}>💭</Text>
                        <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], textAlign: "center" }}>
                            No moods logged yet.{"\n"}Check in from the Home screen!
                        </Text>
                    </GlassCard>
                ) : (
                    <View style={{ gap: 8 }}>
                        {moodHistory.slice(0, 7).map((entry, i) => (
                            <GlassCard key={i} variant="default" size="sm">
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 24, marginRight: 12 }}>
                                        {getMoodEmoji(entry.mood)}
                                    </Text>
                                    <View style={{ flex: 1 }}>
                                        <Text className="text-white font-medium text-sm">
                                            {entry.mood}
                                        </Text>
                                        {entry.note && (
                                            <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginTop: 2 }}>
                                                {entry.note}
                                            </Text>
                                        )}
                                    </View>
                                    <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>
                                        {new Date(entry.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                            </GlassCard>
                        ))}
                    </View>
                )}
            </Animated.View>
        </ScreenWrapper>
    );
}
