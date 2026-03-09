// ─────────────────────────────────────────────────────────────
// Mood data — single source of truth
// ─────────────────────────────────────────────────────────────

export interface MoodOption {
    emoji: string;
    label: string;
    color: string;
}

export const MOODS: MoodOption[] = [
    { emoji: "😊", label: "Happy", color: "#34D399" },
    { emoji: "😌", label: "Calm", color: "#6282E3" },
    { emoji: "😐", label: "Meh", color: "#8B5CF6" },
    { emoji: "😟", label: "Anxious", color: "#FB923C" },
    { emoji: "😢", label: "Sad", color: "#F472B6" },
    { emoji: "😤", label: "Stressed", color: "#EF4444" },
];

/** Get emoji for a mood label. Falls back to 😐 */
export function getMoodEmoji(mood: string): string {
    return MOODS.find((m) => m.label === mood)?.emoji || "😐";
}

/** Get color for a mood label */
export function getMoodColor(mood: string): string {
    return MOODS.find((m) => m.label === mood)?.color || "#8B5CF6";
}
