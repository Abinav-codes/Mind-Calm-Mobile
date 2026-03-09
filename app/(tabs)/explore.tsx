import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Badge } from "../../src/components/ui/Badge";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { ScreenWrapper } from "../../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Spacing } from "../../src/constants/theme";
import { blogPosts } from "../../src/data/blogData";

const blogPreviews = blogPosts.slice(0, 4);

const CATEGORIES = [
    {
        id: "stress",
        title: "Stress Assessment",
        description: "Understand your stress levels with our guided quiz",
        icon: "leaf-outline",
        color: "#34D399",
        questions: 7,
        duration: "3 min",
        available: true,
    },
    {
        id: "sleep",
        title: "Sleep Quality",
        description: "Evaluate your sleep patterns and get personalized tips",
        icon: "moon-outline",
        color: "#6282E3",
        questions: 8,
        duration: "4 min",
        available: true,
    },
    {
        id: "mindfulness",
        title: "Mindfulness Check",
        description: "Discover your mindfulness level and grow",
        icon: "eye-outline",
        color: "#8B5CF6",
        questions: 6,
        duration: "3 min",
        available: true,
    },
    {
        id: "self-improvement",
        title: "Self-Improvement",
        description: "Actionable insights for personal growth",
        icon: "trending-up-outline",
        color: "#FB923C",
        questions: 10,
        duration: "5 min",
        available: false,
    },
];

const QUICK_ACTIONS = [
    { id: "breathe", title: "Breathe", icon: "water", color: "#8B5CF6" },
    { id: "blog", title: "Blog", icon: "book-outline", color: "#6282E3" },
    { id: "chat", title: "AI Chat", icon: "chatbubble-outline", color: "#34D399" },
    { id: "history", title: "History", icon: "time-outline", color: "#FB923C" },
];

export default function ExploreScreen() {
    const handleCategoryPress = (id: string) => {
        if (["stress", "sleep", "mindfulness"].includes(id)) {
            router.push(`/quiz/intro/${id}` as any);
        }
    };

    const handleQuickAction = (id: string) => {
        switch (id) {
            case "breathe":
                router.push("/(tabs)/breathe");
                break;
            case "blog":
                router.push("/blog" as any);
                break;
            case "chat":
                router.push("/chat");
                break;
            case "history":
                router.push("/(tabs)/progress");
                break;
        }
    };

    return (
        <ScreenWrapper scroll>
            {/* Header */}
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="px-6 mb-6"
            >
                <Text className="text-white text-2xl font-bold">Explore</Text>
                <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], marginTop: 4 }}>
                    Discover tools for your well-being
                </Text>
            </Animated.View>

            {/* Quick Actions */}
            <Animated.View
                entering={FadeInDown.delay(200).springify()}
                className="px-6 mb-8"
            >
                <View style={{ flexDirection: "row", gap: 12 }}>
                    {QUICK_ACTIONS.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            onPress={() => handleQuickAction(action.id)}
                            activeOpacity={0.7}
                            style={{ flex: 1 }}
                        >
                            <GlassCard variant="default" size="md" style={{ alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        backgroundColor: `${action.color}20`,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: Spacing.sm,
                                    }}
                                >
                                    <Ionicons
                                        name={action.icon as any}
                                        size={20}
                                        color={action.color}
                                    />
                                </View>
                                <Text style={{ color: Colors.text.secondary, fontSize: FontSize.xs[0], fontWeight: "500" }}>
                                    {action.title}
                                </Text>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            {/* Assessment Categories */}
            <Animated.View
                entering={FadeInDown.delay(300).springify()}
                className="px-6"
            >
                <Text className="text-white text-lg font-bold mb-4">
                    Assessments
                </Text>
                <View style={{ gap: 14 }}>
                    {CATEGORIES.map((cat, index) => (
                        <Animated.View
                            key={cat.id}
                            entering={FadeInDown.delay(400 + index * 100).springify()}
                        >
                            <TouchableOpacity
                                onPress={() => handleCategoryPress(cat.id)}
                                disabled={!cat.available}
                                activeOpacity={0.8}
                            >
                                <GlassCard
                                    variant="default"
                                    size="lg"
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        opacity: cat.available ? 1 : 0.5,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 16,
                                            backgroundColor: `${cat.color}20`,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: Spacing.md,
                                        }}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={26}
                                            color={cat.color}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text className="text-white font-bold text-base">
                                            {cat.title}
                                        </Text>
                                        <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], marginTop: 4 }}>
                                            {cat.description}
                                        </Text>
                                        <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Ionicons name="help-circle-outline" size={14} color={Colors.text.dim} />
                                                <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginLeft: 4 }}>
                                                    {cat.questions} questions
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Ionicons name="time-outline" size={14} color={Colors.text.dim} />
                                                <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginLeft: 4 }}>
                                                    {cat.duration}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {cat.available ? (
                                        <Ionicons name="chevron-forward" size={20} color={Colors.border.default} />
                                    ) : (
                                        <Badge label="Soon" size="sm" />
                                    )}
                                </GlassCard>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </Animated.View>

            {/* Wellness Reads */}
            <Animated.View
                entering={FadeInDown.delay(800).springify()}
                className="mt-8"
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: Spacing.md }}>
                    <Text className="text-white text-lg font-bold">
                        Wellness Reads
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/blog" as any)} activeOpacity={0.7}>
                        <Text style={{ color: Colors.accent, fontSize: FontSize.xs[0], fontWeight: "600" }}>See All →</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}
                >
                    {blogPreviews.map((blog) => (
                        <TouchableOpacity
                            key={blog.id}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/blog/${blog.id}` as any)}
                        >
                            <GlassCard variant="default" size="md" style={{ width: 200 }}>
                                <Text style={{ fontSize: 32, marginBottom: 10 }}>
                                    {blog.emoji}
                                </Text>
                                <Badge
                                    label={blog.category}
                                    category={blog.category}
                                    size="sm"
                                    style={{ marginBottom: 8 }}
                                />
                                <Text
                                    className="text-white text-sm font-bold"
                                    numberOfLines={2}
                                >
                                    {blog.title}
                                </Text>
                                <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginTop: 8 }}>
                                    {blog.readTime} read
                                </Text>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>
        </ScreenWrapper>
    );
}
