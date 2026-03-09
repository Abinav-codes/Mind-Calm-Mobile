// ─────────────────────────────────────────────────────────────
// MoodCheckin — Enhanced mood check-in component
// ─────────────────────────────────────────────────────────────
// Multi-step flow:
//   1. Mood selection (emoji grid)
//   2. Intensity slider + optional journal note
//   3. Affirmation / contextual feedback
//
// If already checked in today, shows "Today's mood" summary
// with an "Edit" option.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    SlideInDown
} from "react-native-reanimated";
import { Colors, FontSize, Radius, Spacing } from "../../constants/theme";
import { MOODS } from "../../data/moods";
import { selectMoodHistory, useAppStore } from "../../stores/appStore";
import { GlassCard } from "./GlassCard";
import { PressableScale } from "./PressableScale";

// ── Constants ──────────────────────────────────────────────


/** Post-mood affirmation/tip per mood — warm-clinical tone */
const MOOD_FEEDBACK: Record<string, { message: string; tip: string }> = {
    Happy: {
        message: "Wonderful! Savoring happy moments builds resilience. 🌟",
        tip: "Try to name 3 things that made you feel this way.",
    },
    Calm: {
        message: "Being calm is a superpower. Notice how it feels in your body. 🍃",
        tip: "Carry this feeling with you — it's always available.",
    },
    Meh: {
        message: "Neutral is totally valid. Not every day needs to be a highlight. 🌤️",
        tip: "Sometimes just noticing 'meh' is the most honest thing you can do.",
    },
    Anxious: {
        message: "Anxiety often means you care deeply. That's not a weakness. 💙",
        tip: "Try the breathing exercise — even 2 minutes can shift your nervous system.",
    },
    Sad: {
        message: "It's okay to feel sad. Emotions are visitors, not permanent residents. 🫂",
        tip: "Be gentle with yourself today. You're doing better than you think.",
    },
    Stressed: {
        message: "Stress is a signal, not a sentence. Let's address it together. 🌿",
        tip: "Try the 5-4-3-2-1 grounding exercise in SOS mode.",
    },
};

const INTENSITY_LABELS = ["Barely", "A little", "Moderate", "Strong", "Very strong"];

// ── Types ──────────────────────────────────────────────────

type CheckinStep = "pick" | "detail" | "done";

interface MoodCheckinProps {
    userId: string;
}

// ── Component ──────────────────────────────────────────────

export function MoodCheckin({ userId }: MoodCheckinProps) {
    const saveMood = useAppStore((s) => s.saveMood);
    const moodHistory = useAppStore(selectMoodHistory);

    const [step, setStep] = useState<CheckinStep>("pick");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [intensity, setIntensity] = useState(3); // 1-5 scale
    const [note, setNote] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Check if user already checked in today
    const todaysMood = useMemo(() => {
        if (moodHistory.length === 0) return null;
        const today = new Date().toDateString();
        const latest = moodHistory[0];
        if (new Date(latest.created_at).toDateString() === today) {
            return latest;
        }
        return null;
    }, [moodHistory]);

    // If there's a mood for today and we're not editing, show summary
    useEffect(() => {
        if (todaysMood && !isEditing) {
            setStep("done");
            setSelectedMood(todaysMood.mood);
        }
    }, [todaysMood, isEditing]);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        setStep("detail");
    };

    const handleSubmit = async () => {
        if (!selectedMood) return;
        await saveMood(userId, selectedMood, intensity, note.trim() || undefined);
        setStep("done");
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setStep("pick");
        setSelectedMood(todaysMood?.mood || null);
        setIntensity(todaysMood?.intensity || 3);
        setNote(todaysMood?.note || "");
    };

    const moodData = selectedMood ? MOODS.find((m) => m.label === selectedMood) : null;
    const feedback = selectedMood ? MOOD_FEEDBACK[selectedMood] : null;

    // ── Step: Already Checked In (Done) ─────────────────────
    if (step === "done" && selectedMood && !isEditing) {
        return (
            <Animated.View
                entering={FadeInDown.duration(600).springify()}
                style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing["2xl"] }}
            >
                <GlassCard variant="elevated" size="lg" radius={Radius["2xl"]}>
                    {/* Header */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.md }}>
                        <View>
                            <Text style={{ color: Colors.text.primary, fontSize: FontSize.lg[0], fontWeight: "800" }}>
                                Today's Check-in ✅
                            </Text>
                            <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginTop: 2 }}>
                                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                            </Text>
                        </View>
                        <PressableScale onPress={handleEdit} scale={0.9}>
                            <View style={{
                                backgroundColor: "rgba(255,255,255,0.08)",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.1)",
                            }}>
                                <Text style={{ color: Colors.text.secondary, fontSize: FontSize.xs[0], fontWeight: "600" }}>
                                    Edit
                                </Text>
                            </View>
                        </PressableScale>
                    </View>

                    {/* Mood Summary */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: Spacing.md }}>
                        <View style={{
                            width: 56, height: 56, borderRadius: 28,
                            backgroundColor: `${moodData?.color || Colors.accent}15`,
                            justifyContent: "center", alignItems: "center",
                            borderWidth: 1.5, borderColor: `${moodData?.color || Colors.accent}30`,
                        }}>
                            <Text style={{ fontSize: 28 }}>{moodData?.emoji}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: Colors.text.primary, fontSize: FontSize.base[0], fontWeight: "700" }}>
                                Feeling {selectedMood}
                            </Text>
                            {todaysMood?.intensity && (
                                <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], marginTop: 2 }}>
                                    Intensity: {INTENSITY_LABELS[(todaysMood.intensity || 3) - 1]}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Note (if any) */}
                    {todaysMood?.note && (
                        <View style={{
                            backgroundColor: "rgba(255,255,255,0.04)",
                            padding: 12,
                            borderRadius: Radius.base,
                            borderWidth: 0.5,
                            borderColor: "rgba(255,255,255,0.06)",
                            marginBottom: Spacing.md,
                        }}>
                            <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], fontStyle: "italic", lineHeight: 20 }}>
                                "{todaysMood.note}"
                            </Text>
                        </View>
                    )}

                    {/* Feedback */}
                    {feedback && (
                        <Animated.View entering={FadeIn.delay(300).duration(600)}>
                            <Text style={{ color: Colors.text.secondary, fontSize: FontSize.sm[0], lineHeight: 20 }}>
                                {feedback.message}
                            </Text>
                        </Animated.View>
                    )}
                </GlassCard>
            </Animated.View>
        );
    }

    // ── Step: Detail (Intensity + Note) ─────────────────────
    if (step === "detail" && selectedMood) {
        return (
            <Animated.View
                entering={SlideInDown.duration(500).springify()}
                style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing["2xl"] }}
            >
                <GlassCard variant="elevated" size="lg" radius={Radius["2xl"]}>
                    {/* Selected mood at top */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: Spacing.lg }}>
                        <PressableScale onPress={() => setStep("pick")} scale={0.9}>
                            <View style={{
                                width: 48, height: 48, borderRadius: 24,
                                backgroundColor: `${moodData?.color || Colors.accent}15`,
                                justifyContent: "center", alignItems: "center",
                                borderWidth: 1.5, borderColor: `${moodData?.color || Colors.accent}30`,
                            }}>
                                <Text style={{ fontSize: 24 }}>{moodData?.emoji}</Text>
                            </View>
                        </PressableScale>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: Colors.text.primary, fontSize: FontSize.base[0], fontWeight: "700" }}>
                                Feeling {selectedMood}
                            </Text>
                            <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>
                                Tap emoji to change
                            </Text>
                        </View>
                    </View>

                    {/* Intensity Selector */}
                    <View style={{ marginBottom: Spacing.lg }}>
                        <Text style={{
                            color: Colors.text.secondary,
                            fontSize: FontSize.sm[0],
                            fontWeight: "600",
                            marginBottom: Spacing.sm,
                        }}>
                            How strong is this feeling?
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 6 }}>
                            {INTENSITY_LABELS.map((label, i) => {
                                const level = i + 1;
                                const isActive = intensity === level;
                                return (
                                    <PressableScale
                                        key={label}
                                        onPress={() => {
                                            setIntensity(level);
                                        }}
                                        scale={0.92}
                                        style={{ flex: 1 }}
                                    >
                                        <View style={{
                                            alignItems: "center",
                                            paddingVertical: 10,
                                            borderRadius: Radius.base,
                                            backgroundColor: isActive
                                                ? `${moodData?.color || Colors.accent}20`
                                                : "rgba(255,255,255,0.04)",
                                            borderWidth: isActive ? 1.5 : 0.5,
                                            borderColor: isActive
                                                ? `${moodData?.color || Colors.accent}50`
                                                : "rgba(255,255,255,0.06)",
                                        }}>
                                            <View style={{
                                                width: 8 + level * 4,
                                                height: 8 + level * 4,
                                                borderRadius: (8 + level * 4) / 2,
                                                backgroundColor: isActive
                                                    ? moodData?.color || Colors.accent
                                                    : "rgba(255,255,255,0.15)",
                                                marginBottom: 6,
                                            }} />
                                            <Text style={{
                                                color: isActive ? Colors.text.primary : Colors.text.dim,
                                                fontSize: 9,
                                                fontWeight: isActive ? "700" : "500",
                                            }}>
                                                {label}
                                            </Text>
                                        </View>
                                    </PressableScale>
                                );
                            })}
                        </View>
                    </View>

                    {/* Journal Note */}
                    <View style={{ marginBottom: Spacing.lg }}>
                        <Text style={{
                            color: Colors.text.secondary,
                            fontSize: FontSize.sm[0],
                            fontWeight: "600",
                            marginBottom: Spacing.sm,
                        }}>
                            Add a note{" "}
                            <Text style={{ color: Colors.text.dim, fontWeight: "400" }}>(optional)</Text>
                        </Text>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="What's on your mind?"
                            placeholderTextColor="rgba(255,255,255,0.25)"
                            multiline
                            numberOfLines={3}
                            maxLength={200}
                            textAlignVertical="top"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.05)",
                                borderRadius: Radius.base,
                                padding: 14,
                                color: Colors.text.primary,
                                fontSize: FontSize.sm[0],
                                minHeight: 80,
                                borderWidth: 0.5,
                                borderColor: "rgba(255,255,255,0.08)",
                                lineHeight: 20,
                            }}
                        />
                        <Text style={{
                            color: Colors.text.dim,
                            fontSize: 10,
                            textAlign: "right",
                            marginTop: 4,
                        }}>
                            {note.length}/200
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: moodData?.color || Colors.accent,
                            paddingVertical: 14,
                            borderRadius: Radius.base,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#FFF", fontSize: FontSize.base[0], fontWeight: "700" }}>
                            Save Check-in
                        </Text>
                    </TouchableOpacity>
                </GlassCard>
            </Animated.View>
        );
    }

    // ── Step: Pick Mood (Default) ───────────────────────────
    return (
        <Animated.View
            entering={FadeInDown.delay(550).duration(800).springify().damping(14)}
            style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing["2xl"] }}
        >
            <GlassCard variant="elevated" size="lg" radius={Radius["2xl"]}>
                <Text style={{ color: Colors.text.primary, fontSize: FontSize.lg[0], fontWeight: "800", marginBottom: Spacing["2xs"] }}>
                    {isEditing ? "Change your mood" : "How are you feeling?"}
                </Text>
                <Text style={{ color: Colors.text.muted, fontSize: FontSize.sm[0], marginBottom: Spacing.lg }}>
                    {isEditing ? "Select your updated mood" : "Tap to log your mood today"}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {MOODS.map((mood, i) => (
                        <PressableScale
                            key={mood.label}
                            onPress={() => handleMoodSelect(mood.label)}
                            scale={0.85}
                        >
                            <View style={{ alignItems: "center", gap: 4 }}>
                                <View style={{
                                    width: 44, height: 44, borderRadius: 22,
                                    backgroundColor: `${mood.color}15`,
                                    justifyContent: "center", alignItems: "center",
                                    borderWidth: 1.5,
                                    borderColor: selectedMood === mood.label ? mood.color : `${mood.color}25`,
                                }}>
                                    <Text style={{ fontSize: 22 }}>{mood.emoji}</Text>
                                </View>
                                <Text style={{
                                    color: Colors.text.dim,
                                    fontSize: 10,
                                    fontWeight: "600",
                                }}>
                                    {mood.label}
                                </Text>
                            </View>
                        </PressableScale>
                    ))}
                </View>

                {isEditing && (
                    <TouchableOpacity
                        onPress={() => { setIsEditing(false); setStep("done"); }}
                        style={{ marginTop: Spacing.md, alignItems: "center" }}
                    >
                        <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0] }}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </GlassCard>
        </Animated.View>
    );
}
