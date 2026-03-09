import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Badge } from "../../src/components/ui/Badge";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { ScreenWrapper } from "../../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Spacing } from "../../src/constants/theme";
import { blogCategories, blogPosts } from "../../src/data/blogData";

export default function BlogListScreen() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts =
        activeCategory === "All"
            ? blogPosts
            : blogPosts.filter((p) => p.category === activeCategory);

    return (
        <ScreenWrapper scroll>
            {/* Header */}
            <View className="px-6 mb-4" style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold ml-4">Wellness Blog</Text>
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 8, marginBottom: 20 }}
            >
                {blogCategories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => {
                            setActiveCategory(cat);
                        }}
                        activeOpacity={0.7}
                        style={{
                            paddingHorizontal: Spacing.md,
                            paddingVertical: Spacing.sm,
                            borderRadius: 20,
                            backgroundColor:
                                activeCategory === cat
                                    ? Colors.accent
                                    : Colors.surface.base,
                            borderWidth: 1,
                            borderColor:
                                activeCategory === cat
                                    ? Colors.accent
                                    : Colors.border.subtle,
                        }}
                    >
                        <Text
                            style={{
                                color: activeCategory === cat ? "#fff" : Colors.text.secondary,
                                fontSize: FontSize.xs[0],
                                fontWeight: "600",
                            }}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Blog Cards */}
            <View className="px-6" style={{ gap: 16 }}>
                {filteredPosts.map((post, index) => (
                    <Animated.View
                        key={post.id}
                        entering={FadeInDown.delay(100 + index * 80).springify()}
                    >
                        <TouchableOpacity
                            onPress={() => router.push(`/blog/${post.id}` as any)}
                            activeOpacity={0.8}
                        >
                            <GlassCard variant="default" size="lg" style={{ padding: 0, overflow: "hidden" }}>
                                {/* Image */}
                                <Image
                                    source={{ uri: post.image }}
                                    style={{ width: "100%", height: 160 }}
                                    resizeMode="cover"
                                />

                                {/* Content */}
                                <View style={{ padding: Spacing.md }}>
                                    <Badge
                                        label={post.category}
                                        category={post.category}
                                        size="sm"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <Text
                                        className="text-white text-base font-bold"
                                        numberOfLines={2}
                                    >
                                        {post.title}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            marginTop: 10,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Ionicons
                                            name="time-outline"
                                            size={13}
                                            color={Colors.text.dim}
                                        />
                                        <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginLeft: 4 }}>
                                            {post.readTime} read
                                        </Text>
                                        <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginHorizontal: 8 }}>·</Text>
                                        <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>{post.date}</Text>
                                    </View>
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </ScreenWrapper>
    );
}
