import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInDown,
    FadeInRight,
} from "react-native-reanimated";
import { mindfulnessQuestions } from "../../src/data/mindfulnessQuestions";
import { sleepQuestions } from "../../src/data/sleepQuestions";

const { width } = Dimensions.get("window");

// Stress questions (inline, same as before)
const STRESS_QUESTIONS = [
    {
        id: "overwhelm",
        text: "How often do you feel overwhelmed by tasks?",
        options: [
            { text: "Rarely", emoji: "🛋️", value: 1 },
            { text: "Sometimes", emoji: "⏳", value: 2 },
            { text: "Often", emoji: "📚", value: 3 },
        ],
    },
    {
        id: "sleep",
        text: "How well do you sleep at night?",
        options: [
            { text: "Very well", emoji: "😴", value: 1 },
            { text: "Sometimes poorly", emoji: "😐", value: 2 },
            { text: "Struggle a lot", emoji: "😵", value: 3 },
        ],
    },
    {
        id: "physical",
        text: "Do you experience physical symptoms of stress?",
        options: [
            { text: "Never", emoji: "💪", value: 1 },
            { text: "Occasionally", emoji: "🤕", value: 2 },
            { text: "Frequently", emoji: "😰", value: 3 },
        ],
    },
    {
        id: "balance",
        text: "How would you describe your work-life balance?",
        options: [
            { text: "Well balanced", emoji: "⚖️", value: 1 },
            { text: "Could improve", emoji: "📊", value: 2 },
            { text: "Always working", emoji: "🏃", value: 3 },
        ],
    },
    {
        id: "coping",
        text: "How do you typically cope with stress?",
        options: [
            { text: "Healthy habits", emoji: "🧘", value: 1 },
            { text: "Distraction", emoji: "📱", value: 2 },
            { text: "I don't cope", emoji: "😶", value: 3 },
        ],
    },
    {
        id: "support",
        text: "Do you feel supported by people around you?",
        options: [
            { text: "Very supported", emoji: "🤗", value: 1 },
            { text: "Somewhat", emoji: "🤝", value: 2 },
            { text: "Not really", emoji: "😔", value: 3 },
        ],
    },
    {
        id: "breaks",
        text: "How often do you take breaks during the day?",
        options: [
            { text: "Regularly", emoji: "☕", value: 1 },
            { text: "When I remember", emoji: "⏰", value: 2 },
            { text: "Almost never", emoji: "💻", value: 3 },
        ],
    },
];

// Category metadata
const CATEGORY_META: Record<string, { title: string; color: string; icon: string }> = {
    stress: { title: "Stress Assessment", color: "#34D399", icon: "leaf-outline" },
    sleep: { title: "Sleep Quality", color: "#6282E3", icon: "moon-outline" },
    mindfulness: { title: "Mindfulness Check", color: "#8B5CF6", icon: "eye-outline" },
};

function getQuestionsForCategory(category: string) {
    switch (category.toLowerCase()) {
        case "sleep":
            return sleepQuestions;
        case "mindfulness":
            return mindfulnessQuestions;
        case "stress":
        default:
            return STRESS_QUESTIONS;
    }
}

// Fisher-Yates shuffle for variety
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function QuizScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const catKey = (category || "stress").toLowerCase();
    const meta = CATEGORY_META[catKey] || CATEGORY_META.stress;

    const questions = useMemo(
        () => (catKey === "stress" ? getQuestionsForCategory(catKey) : shuffleArray(getQuestionsForCategory(catKey))),
        [catKey]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ question: string; answer: string; value: number }[]>([]);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (answer: { text: string; value: number }) => {
        const questionText = currentQuestion.text || (currentQuestion as any).question;
        const newAnswers = [
            ...answers,
            { question: questionText, answer: answer.text, value: answer.value },
        ];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            // Calculate score — higher value = better wellness
            const totalScore = newAnswers.reduce((sum, a) => sum + a.value, 0);
            const maxScore = questions.length * 4; // max value per question
            const percentage = Math.round((totalScore / maxScore) * 100);

            router.replace({
                pathname: "/quiz/analysis",
                params: {
                    category: meta.title,
                    score: percentage.toString(),
                    answers: JSON.stringify(newAnswers),
                },
            });
        }
    };

    // Normalize question format (stress uses different shape)
    const questionText = currentQuestion.text || (currentQuestion as any).question;
    const options = currentQuestion.options || (currentQuestion as any).answers;

    return (
        <LinearGradient colors={["#1B2250", "#0F1535"]} style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingTop: 60 }}>
                {/* Top Bar */}
                <View
                    className="px-6 mb-6"
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginHorizontal: 16 }}>
                        {/* Progress Bar */}
                        <View
                            style={{
                                height: 4,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: 2,
                            }}
                        >
                            <Animated.View
                                style={{
                                    height: "100%",
                                    width: `${progress}%`,
                                    backgroundColor: meta.color,
                                    borderRadius: 2,
                                }}
                            />
                        </View>
                    </View>
                    <Text className="text-text-muted text-sm">
                        {currentIndex + 1}/{questions.length}
                    </Text>
                </View>

                {/* Category Badge */}
                <View className="px-6 mb-3">
                    <View
                        style={{
                            backgroundColor: `${meta.color}20`,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 8,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Text style={{ color: meta.color, fontSize: 11, fontWeight: "700" }}>
                            {meta.title}
                        </Text>
                    </View>
                </View>

                {/* Question */}
                <Animated.View
                    key={currentIndex}
                    entering={FadeInRight.springify()}
                    className="px-6 mb-8"
                >
                    <Text className="text-white text-2xl font-bold leading-8">
                        {questionText}
                    </Text>
                </Animated.View>

                {/* Answer Options */}
                <View className="px-6" style={{ gap: 14 }}>
                    {options.map((answer: any, index: number) => (
                        <Animated.View
                            key={`${currentIndex}-${index}`}
                            entering={FadeInDown.delay(200 + index * 100).springify()}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    handleAnswer({
                                        text: answer.text,
                                        value: answer.value,
                                    })
                                }
                                activeOpacity={0.7}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    borderRadius: 16,
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: "rgba(255,255,255,0.08)",
                                }}
                            >
                                <Text style={{ fontSize: 28, marginRight: 16 }}>
                                    {answer.emoji || answer.icon}
                                </Text>
                                <Text className="text-white text-base font-medium flex-1">
                                    {answer.text}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="rgba(255,255,255,0.2)"
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </View>
        </LinearGradient>
    );
}
