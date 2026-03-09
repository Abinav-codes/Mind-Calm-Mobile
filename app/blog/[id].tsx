import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { blogPosts } from "../../src/data/blogData";

export default function BlogPostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const post = blogPosts.find((p) => p.id === parseInt(id || "0", 10));

    if (!post) {
        return (
            <LinearGradient colors={["#1B2250", "#0F1535"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text className="text-white text-lg">Post not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text className="text-accent">Go back</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    // Simple markdown-like renderer for our content
    const renderContent = (content: string) => {
        const lines = content.split("\n");
        return lines.map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <View key={i} style={{ height: 12 }} />;

            // Bold headers **text**
            if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return (
                    <Text
                        key={i}
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                            marginTop: 16,
                            marginBottom: 4,
                        }}
                    >
                        {trimmed.replace(/\*\*/g, "")}
                    </Text>
                );
            }

            // List items starting with - or numbered
            if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
                return (
                    <View key={i} style={{ flexDirection: "row", marginTop: 4, paddingLeft: 8 }}>
                        <Text style={{ color: "#6282E3", marginRight: 8 }}>•</Text>
                        <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 22, flex: 1 }}>
                            {trimmed.replace(/^[-•] /, "")}
                        </Text>
                    </View>
                );
            }

            // Numbered items like **1.** text
            if (/^\*\*\d+\.?\*\*/.test(trimmed)) {
                return (
                    <Text
                        key={i}
                        style={{
                            color: "rgba(255,255,255,0.75)",
                            fontSize: 14,
                            lineHeight: 22,
                            marginTop: 6,
                        }}
                    >
                        <Text style={{ color: "#6282E3", fontWeight: "700" }}>
                            {trimmed.match(/\*\*(\d+\.?)\*\*/)?.[1]}{" "}
                        </Text>
                        {trimmed.replace(/^\*\*\d+\.?\*\*\s*/, "").replace(/\*\*/g, "")}
                    </Text>
                );
            }

            // Regular paragraph
            return (
                <Text
                    key={i}
                    style={{
                        color: "rgba(255,255,255,0.75)",
                        fontSize: 14,
                        lineHeight: 22,
                        marginTop: 2,
                    }}
                >
                    {trimmed.replace(/\*\*/g, "")}
                </Text>
            );
        });
    };

    return (
        <LinearGradient colors={["#1B2250", "#0F1535"]} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Image */}
                <View>
                    <Image
                        source={{ uri: post.image }}
                        style={{ width: "100%", height: 240 }}
                        resizeMode="cover"
                    />
                    {/* Back button overlay */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        style={{
                            position: "absolute",
                            top: 50,
                            left: 20,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Article Content */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    className="px-6"
                    style={{ marginTop: -20 }}
                >
                    <View
                        style={{
                            backgroundColor: "#1B2250",
                            borderRadius: 20,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.08)",
                        }}
                    >
                        {/* Category + Meta */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                            <View
                                style={{
                                    backgroundColor: "rgba(98,130,227,0.15)",
                                    paddingHorizontal: 10,
                                    paddingVertical: 3,
                                    borderRadius: 6,
                                }}
                            >
                                <Text style={{ color: "#6282E3", fontSize: 10, fontWeight: "700" }}>
                                    {post.category}
                                </Text>
                            </View>
                            <Text className="text-text-dim text-xs ml-3">{post.readTime} read</Text>
                            <Text className="text-text-dim text-xs mx-1">·</Text>
                            <Text className="text-text-dim text-xs">{post.date}</Text>
                        </View>

                        {/* Title */}
                        <Text className="text-white text-xl font-bold leading-7 mb-4">
                            {post.title}
                        </Text>

                        {/* Content */}
                        {renderContent(post.content)}
                    </View>
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
}
