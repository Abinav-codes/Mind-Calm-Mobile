import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "../../src/components/ui/Button";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { ScreenWrapper } from "../../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Spacing } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { selectAvatarEmoji, selectDisplayName, selectGoals, selectMoodHistory, selectStreak, selectTotalSessions, useAppStore } from "../../src/stores/appStore";

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const streak = useAppStore(selectStreak);
    const totalSessions = useAppStore(selectTotalSessions);
    const moodHistory = useAppStore(selectMoodHistory);
    const displayName = useAppStore(selectDisplayName);
    const avatarEmoji = useAppStore(selectAvatarEmoji);
    const goals = useAppStore(selectGoals);

    const profileName = displayName || user?.email?.split("@")[0] || "MindCalm User";
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : null;

    const handleLogout = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/(auth)/login");
                    },
                },
            ]
        );
    };

    const MENU_ITEMS = [
        { icon: "settings-outline", label: "Settings", onPress: () => router.push("/settings" as any) },
        { icon: "notifications-outline", label: "Notifications", onPress: () => router.push("/settings" as any) },
        { icon: "shield-outline", label: "Privacy Policy", onPress: () => { } },
        { icon: "document-text-outline", label: "Terms of Service", onPress: () => { } },
    ];

    return (
        <ScreenWrapper scroll>
            {/* Profile Card */}
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="px-6 mb-6"
            >
                <GlassCard variant="elevated" size="lg" style={{ alignItems: "center" }}>
                    {/* Avatar */}
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: `${Colors.accent}20`,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: Spacing.md,
                            borderWidth: 2,
                            borderColor: `${Colors.accent}30`,
                        }}
                    >
                        <Text style={{ fontSize: 36 }}>{avatarEmoji}</Text>
                    </View>
                    <Text className="text-white text-xl font-bold">
                        {profileName}
                    </Text>
                    <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], marginTop: 4 }}>
                        {user?.email || ""}
                    </Text>
                    {memberSince && (
                        <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginTop: 2 }}>
                            Member since {memberSince}
                        </Text>
                    )}

                    {/* Mini Stats */}
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: Spacing.xl,
                            gap: Spacing.xl,
                        }}
                    >
                        {[
                            { label: "Streak", value: streak },
                            { label: "Sessions", value: totalSessions },
                            { label: "Check-ins", value: moodHistory.length },
                        ].map((stat, i, arr) => (
                            <View key={stat.label} style={{ flexDirection: "row", alignItems: "center", gap: Spacing.xl }}>
                                <View style={{ alignItems: "center" }}>
                                    <Text className="text-white text-lg font-bold">{stat.value}</Text>
                                    <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>
                                        {stat.label}
                                    </Text>
                                </View>
                                {i < arr.length - 1 && (
                                    <View style={{ width: 1, height: 28, backgroundColor: Colors.border.default }} />
                                )}
                            </View>
                        ))}
                    </View>
                </GlassCard>
            </Animated.View>

            {/* Goals Section */}
            {goals.length > 0 && (
                <Animated.View
                    entering={FadeInDown.delay(150).springify()}
                    className="px-6 mb-6"
                >
                    <Text className="text-white text-sm font-semibold mb-3" style={{ opacity: 0.7 }}>
                        Your Goals
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {goals.map((goal) => (
                            <View
                                key={goal}
                                style={{
                                    backgroundColor: `${Colors.accent}12`,
                                    paddingHorizontal: 14,
                                    paddingVertical: 7,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: `${Colors.accent}25`,
                                }}
                            >
                                <Text style={{
                                    color: Colors.accent,
                                    fontSize: FontSize.xs[0],
                                    fontWeight: "600",
                                }}>
                                    {goal}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>
            )}

            {/* Menu Items */}
            <Animated.View
                entering={FadeInDown.delay(200).springify()}
                className="px-6 mb-6"
            >
                <GlassCard variant="default" size="lg" style={{ padding: 0, overflow: "hidden" }}>
                    {MENU_ITEMS.map((item, i) => (
                        <TouchableOpacity
                            key={item.label}
                            onPress={item.onPress}
                            activeOpacity={0.6}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: Spacing.md,
                                borderBottomWidth: i < MENU_ITEMS.length - 1 ? 0.5 : 0,
                                borderBottomColor: Colors.border.subtle,
                            }}
                        >
                            <Ionicons
                                name={item.icon as any}
                                size={22}
                                color={Colors.text.secondary}
                                style={{ marginRight: Spacing.sm + 2 }}
                            />
                            <Text className="text-white text-sm flex-1">
                                {item.label}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={Colors.border.default}
                            />
                        </TouchableOpacity>
                    ))}
                </GlassCard>
            </Animated.View>

            {/* Sign Out */}
            <Animated.View
                entering={FadeInDown.delay(300).springify()}
                className="px-6"
            >
                <Button
                    title="Sign Out"
                    onPress={handleLogout}
                    variant="outline"
                    size="lg"
                    fullWidth
                    icon="log-out-outline"
                    style={{ marginTop: Spacing.xl }}
                />
            </Animated.View>
        </ScreenWrapper>
    );
}
