import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ChatMessage {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const AI_GREETING: ChatMessage = {
    id: "greeting",
    text: "Hi there! I'm your MindCalm AI companion. 🧠\n\nHow are you feeling today? I'm here to listen, offer coping strategies, or just chat.",
    sender: "ai",
    timestamp: new Date(),
};

// Simple local AI responses (fallback when no backend is connected)
const LOCAL_RESPONSES: Record<string, string[]> = {
    stress: [
        "It sounds like you're dealing with a lot of pressure. Let's break this down — what's the biggest source of stress right now?",
        "Stress is your body's alarm system. Try: 4-7-8 breathing — inhale 4s, hold 7s, exhale 8s. How does your body feel right now?",
        "When stress feels overwhelming, grounding helps. Name 5 things you can see right now.",
    ],
    sleep: [
        "Sleep struggles are so common. Are you having trouble falling asleep, staying asleep, or both?",
        "Here's a tip: try the 'military sleep method' — relax your body from head to toe, then clear your mind for 10 seconds.",
        "Blue light from screens suppresses melatonin. Try switching to dim, warm lighting 1 hour before bed.",
    ],
    sad: [
        "I hear you, and your feelings are valid. Sometimes just acknowledging sadness is the first step.",
        "When you feel low, gentle self-care helps. What's one small thing that usually brings you comfort?",
        "Would you like to try a guided breathing exercise? It can help shift your emotional state gently.",
    ],
    anxious: [
        "Anxiety can feel like a tight knot. Let's try the 5-4-3-2-1 grounding technique together.",
        "Your thoughts aren't facts — they're mental events. Can you observe this worry without judging it?",
        "When anxiety spikes, try pressing your feet firmly into the floor. Feel that connection to the ground.",
    ],
    default: [
        "Thank you for sharing that with me. Can you tell me a bit more about what's on your mind?",
        "I appreciate your honesty. Let's explore this further — what would feel most helpful right now?",
        "That's a great observation. Self-awareness is powerful. How long have you been feeling this way?",
        "Remember, reaching out is a sign of strength, not weakness. What support do you need right now?",
        "Every feeling is a signal. What is this feeling trying to tell you?",
    ],
};

function getAIResponse(userText: string): string {
    const lower = userText.toLowerCase();

    if (/stress|overwhelm|pressure|busy|work/.test(lower)) {
        const arr = LOCAL_RESPONSES.stress;
        return arr[Math.floor(Math.random() * arr.length)];
    }
    if (/sleep|insomnia|tired|exhausted|rest/.test(lower)) {
        const arr = LOCAL_RESPONSES.sleep;
        return arr[Math.floor(Math.random() * arr.length)];
    }
    if (/sad|depress|down|lonely|cry/.test(lower)) {
        const arr = LOCAL_RESPONSES.sad;
        return arr[Math.floor(Math.random() * arr.length)];
    }
    if (/anxi|worry|panic|nervous|fear|scared/.test(lower)) {
        const arr = LOCAL_RESPONSES.anxious;
        return arr[Math.floor(Math.random() * arr.length)];
    }
    const arr = LOCAL_RESPONSES.default;
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([AI_GREETING]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            text,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI thinking (1-2s delay)
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: `ai-${Date.now()}`,
                text: getAIResponse(text),
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.sender === "user";
        return (
            <Animated.View
                entering={FadeInDown.springify()}
                style={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    marginBottom: 12,
                }}
            >
                <View
                    style={{
                        backgroundColor: isUser
                            ? "#6282E3"
                            : "rgba(255,255,255,0.08)",
                        borderRadius: 18,
                        borderTopRightRadius: isUser ? 4 : 18,
                        borderTopLeftRadius: isUser ? 18 : 4,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: isUser ? 0 : 1,
                        borderColor: "rgba(255,255,255,0.06)",
                    }}
                >
                    <Text
                        style={{
                            color: isUser ? "#fff" : "rgba(255,255,255,0.85)",
                            fontSize: 14,
                            lineHeight: 20,
                        }}
                    >
                        {item.text}
                    </Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <LinearGradient colors={["#1B2250", "#0F1535"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={0}
            >
                {/* Header */}
                <View
                    style={{
                        paddingTop: 60,
                        paddingHorizontal: 24,
                        paddingBottom: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(255,255,255,0.06)",
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 16 }}>
                        <View
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 19,
                                backgroundColor: "#34D39930",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>🧠</Text>
                        </View>
                        <View>
                            <Text className="text-white text-base font-bold">MindCalm AI</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "#34D399",
                                        marginRight: 6,
                                    }}
                                />
                                <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                                    Online
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    ListFooterComponent={
                        isTyping ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignSelf: "flex-start",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    borderRadius: 18,
                                    borderTopLeftRadius: 4,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    marginBottom: 12,
                                    gap: 4,
                                }}
                            >
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                    }}
                                />
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                    }}
                                />
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                    }}
                                />
                            </View>
                        ) : null
                    }
                />

                {/* Input */}
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        paddingBottom: 36,
                        borderTopWidth: 1,
                        borderTopColor: "rgba(255,255,255,0.06)",
                        backgroundColor: "rgba(255,255,255,0.02)",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.2)",
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.08)",
                            paddingHorizontal: 16,
                        }}
                    >
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type a message..."
                            placeholderTextColor="rgba(255,255,255,0.25)"
                            style={{
                                flex: 1,
                                color: "#fff",
                                fontSize: 14,
                                paddingVertical: 14,
                            }}
                            multiline
                            returnKeyType="send"
                            onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!input.trim()}
                            activeOpacity={0.7}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: input.trim()
                                    ? "#6282E3"
                                    : "rgba(255,255,255,0.06)",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: 8,
                            }}
                        >
                            <Ionicons
                                name="send"
                                size={16}
                                color={input.trim() ? "#fff" : "rgba(255,255,255,0.3)"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
