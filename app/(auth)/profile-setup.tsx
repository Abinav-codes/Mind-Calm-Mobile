import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors, FontSize, Radius } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { useAppStore } from "../../src/stores/appStore";

const { width } = Dimensions.get("window");

// Emoji avatars organized by category
const AVATAR_EMOJIS = [
    // Mindfulness & Wellness
    "🧘", "🧘‍♀️", "🧘‍♂️", "🌸", "🪷", "🌿", "🍃", "🌊",
    // Nature & Peace
    "🦋", "🌙", "⭐", "🌈", "☀️", "🕊️", "🐚", "🌻",
    // Faces & Vibes
    "😊", "😌", "🥰", "🤗", "😎", "🤩", "🦊", "🐱",
    // Fun & Creative
    "🎨", "🎧", "📚", "🎵", "✨", "💜", "🔮", "🫧",
];

export default function ProfileSetupScreen() {
    const { user } = useAuth();
    const saveProfile = useAppStore((s) => s.saveProfile);
    const goals = useAppStore((s) => s.goals);

    const [name, setName] = useState("");
    const [selectedEmoji, setSelectedEmoji] = useState("🧘");
    const [saving, setSaving] = useState(false);

    const handleContinue = async () => {
        if (!user?.id) return;

        setSaving(true);

        await saveProfile(user.id, {
            displayName: name.trim() || undefined,
            avatarEmoji: selectedEmoji,
        });

        setSaving(false);
        router.replace("/(tabs)");
    };

    const handleSkip = () => {
        // Still persist goals to Supabase even when skipping profile
        if (user?.id) {
            const goals = useAppStore.getState().goals;
            if (goals.length > 0) {
                useAppStore.getState().saveGoals(user.id, goals);
            }
        }
        useAppStore.getState().setProfileSetupComplete();
        router.replace("/(tabs)");
    };

    return (
        <LinearGradient
            colors={["#1B2250", "#0F1535", "#1B2250"]}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingTop: 80,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <Text className="text-white text-3xl font-bold text-center mb-2">
                            Almost there! ✨
                        </Text>
                        <Text
                            style={{
                                color: Colors.text.muted,
                                fontSize: FontSize.base[0],
                                textAlign: "center",
                                lineHeight: 22,
                                marginBottom: 32,
                            }}
                        >
                            Let's personalize your experience.{"\n"}
                            What should we call you?
                        </Text>
                    </Animated.View>

                    {/* Avatar Preview */}
                    <Animated.View
                        entering={FadeInDown.delay(300).springify()}
                        style={{ alignItems: "center", marginBottom: 24 }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: `${Colors.accent}20`,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 2,
                                borderColor: `${Colors.accent}40`,
                            }}
                        >
                            <Text style={{ fontSize: 48 }}>{selectedEmoji}</Text>
                        </View>
                    </Animated.View>

                    {/* Name Input */}
                    <Animated.View entering={FadeInDown.delay(400).springify()}>
                        <Text
                            style={{
                                color: Colors.text.secondary,
                                fontSize: FontSize.sm[0],
                                fontWeight: "600",
                                marginBottom: 8,
                                marginLeft: 4,
                            }}
                        >
                            Your Name
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "rgba(255,255,255,0.06)",
                                borderRadius: Radius.base,
                                paddingHorizontal: 16,
                                marginBottom: 28,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.08)",
                            }}
                        >
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="rgba(255,255,255,0.4)"
                            />
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name (optional)"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                autoCapitalize="words"
                                autoCorrect={false}
                                maxLength={30}
                                style={{
                                    flex: 1,
                                    color: "#FFFFFF",
                                    paddingVertical: 16,
                                    paddingLeft: 12,
                                    fontSize: FontSize.base[0],
                                }}
                            />
                        </View>
                    </Animated.View>

                    {/* Avatar Picker */}
                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <Text
                            style={{
                                color: Colors.text.secondary,
                                fontSize: FontSize.sm[0],
                                fontWeight: "600",
                                marginBottom: 12,
                                marginLeft: 4,
                            }}
                        >
                            Pick Your Avatar
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 10,
                                marginBottom: 32,
                            }}
                        >
                            {AVATAR_EMOJIS.map((emoji) => {
                                const isSelected = selectedEmoji === emoji;
                                return (
                                    <TouchableOpacity
                                        key={emoji}
                                        onPress={() => {
                                            setSelectedEmoji(emoji);
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: (width - 48 - 70) / 8,
                                                aspectRatio: 1,
                                                borderRadius: 12,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: isSelected
                                                    ? `${Colors.accent}25`
                                                    : "rgba(255,255,255,0.04)",
                                                borderWidth: isSelected ? 2 : 1,
                                                borderColor: isSelected
                                                    ? Colors.accent
                                                    : "rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            <Text style={{ fontSize: 22 }}>{emoji}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>

                    {/* Goals Preview (if any were selected in onboarding) */}
                    {goals.length > 0 && (
                        <Animated.View
                            entering={FadeInDown.delay(600).springify()}
                            style={{ marginBottom: 32 }}
                        >
                            <Text
                                style={{
                                    color: Colors.text.secondary,
                                    fontSize: FontSize.sm[0],
                                    fontWeight: "600",
                                    marginBottom: 8,
                                    marginLeft: 4,
                                }}
                            >
                                Your Goals
                            </Text>
                            <View
                                style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                            >
                                {goals.map((goal) => (
                                    <View
                                        key={goal}
                                        style={{
                                            backgroundColor: `${Colors.accent}15`,
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: `${Colors.accent}30`,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: Colors.accent,
                                                fontSize: FontSize.xs[0],
                                                fontWeight: "600",
                                            }}
                                        >
                                            {goal}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Continue Button */}
                    <Animated.View entering={FadeInUp.delay(700).springify()}>
                        <TouchableOpacity
                            onPress={handleContinue}
                            disabled={saving}
                            activeOpacity={0.8}
                            style={{
                                paddingVertical: 18,
                                borderRadius: Radius.base,
                                backgroundColor: Colors.accent,
                                alignItems: "center",
                                marginBottom: 16,
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#FFF",
                                    fontSize: FontSize.lg[0],
                                    fontWeight: "700",
                                }}
                            >
                                {saving ? "Setting up..." : "Let's Go!"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSkip} activeOpacity={0.6}>
                            <Text
                                style={{
                                    color: Colors.text.muted,
                                    textAlign: "center",
                                    fontSize: FontSize.sm[0],
                                }}
                            >
                                Skip for now
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
