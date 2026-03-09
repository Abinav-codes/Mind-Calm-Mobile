// ─────────────────────────────────────────────────────────────
// AppStore — Zustand store with slices
// ─────────────────────────────────────────────────────────────
// From react-state-management skill: Zustand for apps at this
// scale — simpler than Redux, no boilerplate, with persistence.
//
// 3 slices:
//   MoodSlice  — mood history, saveMood, streak
//   QuizSlice  — quiz history, saveQuizResult
//   UISlice    — loading, onboarding, modals
// ─────────────────────────────────────────────────────────────

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../services/supabase";

// ── Types ──────────────────────────────────────────────────

export interface MoodEntry {
    id?: number;
    mood: string;
    intensity?: number;
    note?: string;
    created_at: string;
}

export interface QuizResult {
    id?: number;
    category: string;
    score?: number;
    summary?: string;
    plan?: any;
    raw_result?: any;
    created_at: string;
}

// ── Mood Slice ─────────────────────────────────────────────

interface MoodSlice {
    moodHistory: MoodEntry[];
    streak: number;

    /** Compute streak from mood history */
    _computeStreak: () => void;

    /** Save a mood entry (optimistic update + Supabase) */
    saveMood: (
        userId: string,
        mood: string,
        intensity?: number,
        note?: string
    ) => Promise<void>;

    /** Set mood history from fetch */
    setMoodHistory: (entries: MoodEntry[]) => void;
}

// ── Quiz Slice ─────────────────────────────────────────────

interface QuizSlice {
    quizHistory: QuizResult[];
    totalSessions: number;

    /** Save a quiz result (optimistic update + Supabase) */
    saveQuizResult: (
        userId: string,
        category: string,
        result: any
    ) => Promise<void>;

    /** Set quiz history from fetch */
    setQuizHistory: (entries: QuizResult[]) => void;
}

// ── UI Slice ───────────────────────────────────────────────

interface UISlice {
    isLoading: boolean;
    isRefreshing: boolean;
    /** Last error message for user-facing display */
    lastError: string | null;

    setLoading: (loading: boolean) => void;
    setRefreshing: (refreshing: boolean) => void;
    clearError: () => void;
}

// ── Preferences Slice ─────────────────────────────────────

interface PreferencesSlice {
    notificationsEnabled: boolean;
    reminderTime: { hour: number; minute: number } | null;

    setNotificationsEnabled: (enabled: boolean) => void;
    setReminderTime: (time: { hour: number; minute: number } | null) => void;
}

// ── Profile Slice ─────────────────────────────────────────

export interface UserProfile {
    displayName: string | null;
    avatarEmoji: string;
    goals: string[];
    profileLoaded: boolean;
    hasCompletedProfileSetup: boolean;
}

interface ProfileSlice extends UserProfile {
    /** Fetch user profile from Supabase */
    fetchProfile: (userId: string) => Promise<void>;
    /** Save or update the user's profile */
    saveProfile: (userId: string, data: { displayName?: string; avatarEmoji?: string }) => Promise<void>;
    /** Save onboarding goals to Supabase */
    saveGoals: (userId: string, goals: string[]) => Promise<void>;
    /** Mark profile setup as complete */
    setProfileSetupComplete: () => void;
}

// ── Combined Store ─────────────────────────────────────────

export type AppStore = MoodSlice & QuizSlice & UISlice & PreferencesSlice & ProfileSlice & {
    /** Fetch all user data from Supabase */
    fetchUserData: (userId: string) => Promise<void>;
    /** Clear all data on sign out */
    reset: () => void;
};

// ── Streak Calculator ──────────────────────────────────────

function calculateStreak(moodHistory: MoodEntry[]): number {
    if (moodHistory.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split("T")[0];

        const hasEntry = moodHistory.some(
            (m) => m.created_at.split("T")[0] === dateStr
        );

        if (hasEntry) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    return streak;
}

// ── Initial State ──────────────────────────────────────────

const initialState = {
    // Mood
    moodHistory: [] as MoodEntry[],
    streak: 0,

    // Quiz
    quizHistory: [] as QuizResult[],
    totalSessions: 0,

    // UI
    isLoading: false,
    isRefreshing: false,
    lastError: null as string | null,

    // Preferences
    notificationsEnabled: false,
    reminderTime: { hour: 20, minute: 0 } as { hour: number; minute: number } | null,

    // Profile
    displayName: null as string | null,
    avatarEmoji: '🧘',
    goals: [] as string[],
    profileLoaded: false,
    hasCompletedProfileSetup: false,
};

// ── Store Definition ───────────────────────────────────────

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // ── Mood Slice Actions ─────────────────────────

            _computeStreak: () => {
                const streak = calculateStreak(get().moodHistory);
                set({ streak });
            },

            setMoodHistory: (entries) => {
                set({ moodHistory: entries });
                // Recompute streak after setting history
                const streak = calculateStreak(entries);
                set({ streak });
            },

            saveMood: async (userId, mood, intensity, note) => {
                const now = new Date();
                const todayStr = now.toDateString();
                const currentHistory = get().moodHistory;

                // Check if there's already an entry for today
                const existingTodayIndex = currentHistory.findIndex(
                    (m) => new Date(m.created_at).toDateString() === todayStr
                );

                const entry = {
                    user_id: userId,
                    mood,
                    intensity,
                    note,
                };

                if (existingTodayIndex >= 0) {
                    // ── UPSERT: Replace today's entry ──
                    const existingEntry = currentHistory[existingTodayIndex];
                    const updatedEntry: MoodEntry = {
                        ...existingEntry,
                        mood,
                        intensity,
                        note,
                    };

                    const updatedHistory = [...currentHistory];
                    updatedHistory[existingTodayIndex] = updatedEntry;

                    // Optimistic update
                    set({
                        moodHistory: updatedHistory,
                        streak: calculateStreak(updatedHistory),
                    });

                    // Update in Supabase (match by user_id + today's date range)
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
                    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

                    const { error } = await supabase
                        .from('mood_logs')
                        .update({ mood, intensity, note })
                        .eq('user_id', userId)
                        .gte('created_at', startOfDay)
                        .lt('created_at', endOfDay);

                    if (error) {
                        console.error('Failed to update mood:', error);
                        // Rollback
                        set({
                            moodHistory: currentHistory,
                            streak: calculateStreak(currentHistory),
                        });
                    }
                } else {
                    // ── INSERT: New entry for today ──
                    const tempEntry: MoodEntry = {
                        ...entry,
                        created_at: now.toISOString(),
                    };

                    const newHistory = [tempEntry, ...currentHistory];
                    set({
                        moodHistory: newHistory,
                        streak: calculateStreak(newHistory),
                    });

                    const { error } = await supabase
                        .from('mood_logs')
                        .insert(entry);

                    if (error) {
                        console.error('Failed to save mood:', error);
                        set({
                            moodHistory: currentHistory,
                            streak: calculateStreak(currentHistory),
                        });
                    }
                }
            },

            // ── Quiz Slice Actions ─────────────────────────

            setQuizHistory: (entries) => {
                set({ quizHistory: entries, totalSessions: entries.length });
            },

            saveQuizResult: async (userId, category, result) => {
                const entry = {
                    user_id: userId,
                    category,
                    score: result.score,
                    summary: result.summary,
                    plan: result.plan,
                    raw_result: result,
                };

                // Optimistic update
                const tempEntry: QuizResult = {
                    ...entry,
                    created_at: new Date().toISOString(),
                };

                const newHistory = [tempEntry, ...get().quizHistory];
                set({
                    quizHistory: newHistory,
                    totalSessions: newHistory.length,
                });

                // Persist to Supabase
                const { error } = await supabase
                    .from("analysis_results")
                    .insert(entry);

                if (error) {
                    // Rollback on failure
                    console.error("Failed to save quiz result:", error);
                    const rolledBack = get().quizHistory.filter(
                        (q) => q !== tempEntry
                    );
                    set({
                        quizHistory: rolledBack,
                        totalSessions: rolledBack.length,
                    });
                }
            },

            // ── Preferences Actions ────────────────────────────

            setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),
            setReminderTime: (time) => set({ reminderTime: time }),

            // ── UI Actions ────────────────────────────────

            setLoading: (loading) => set({ isLoading: loading }),
            setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
            clearError: () => set({ lastError: null }),

            // (empty for now)

            // ── Profile Slice Actions ──────────────────────

            fetchProfile: async (userId) => {
                try {
                    const { data, error } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();

                    if (error && error.code !== 'PGRST116') {
                        // PGRST116 = no rows (profile not created yet)
                        console.error('Failed to fetch profile:', error);
                        return;
                    }

                    if (data) {
                        set({
                            displayName: data.display_name,
                            avatarEmoji: data.avatar_emoji || '🧘',
                            goals: data.goals || [],
                            profileLoaded: true,
                            hasCompletedProfileSetup: !!data.display_name,
                        });
                    } else {
                        set({ profileLoaded: true });
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            },

            saveProfile: async (userId, profileData) => {
                const updates: Record<string, any> = {};
                if (profileData.displayName !== undefined) updates.display_name = profileData.displayName;
                if (profileData.avatarEmoji !== undefined) updates.avatar_emoji = profileData.avatarEmoji;

                // Optimistic update
                const prev = {
                    displayName: get().displayName,
                    avatarEmoji: get().avatarEmoji,
                };
                set({
                    displayName: profileData.displayName ?? prev.displayName,
                    avatarEmoji: profileData.avatarEmoji ?? prev.avatarEmoji,
                    hasCompletedProfileSetup: true,
                });

                const { error } = await supabase
                    .from('user_profiles')
                    .upsert({ id: userId, ...updates }, { onConflict: 'id' });

                if (error) {
                    console.error('Failed to save profile:', error);
                    // Rollback
                    set(prev);
                    set({ lastError: 'Failed to save profile' });
                }
            },

            saveGoals: async (userId, goals) => {
                // Optimistic update
                const prevGoals = get().goals;
                set({ goals });

                const { error } = await supabase
                    .from('user_profiles')
                    .upsert({ id: userId, goals }, { onConflict: 'id' });

                if (error) {
                    console.error('Failed to save goals:', error);
                    set({ goals: prevGoals, lastError: 'Failed to save goals' });
                }
            },

            setProfileSetupComplete: () => set({ hasCompletedProfileSetup: true }),

            // ── Cross-slice Actions ────────────────────────

            fetchUserData: async (userId) => {
                set({ isRefreshing: true, lastError: null });

                try {
                    // Parallel fetch for performance (quiz + mood + profile)
                    const [quizResponse, moodResponse] = await Promise.all([
                        supabase
                            .from('analysis_results')
                            .select('*')
                            .eq('user_id', userId)
                            .order('created_at', { ascending: false }),
                        supabase
                            .from('mood_logs')
                            .select('*')
                            .eq('user_id', userId)
                            .order('created_at', { ascending: false }),
                    ]);

                    // Also fetch profile (don't block on it)
                    get().fetchProfile(userId);

                    // Check for Supabase-level errors
                    if (quizResponse.error || moodResponse.error) {
                        const errMsg = quizResponse.error?.message || moodResponse.error?.message || 'Failed to load data';
                        console.error('Supabase fetch error:', errMsg);
                        set({ lastError: errMsg });
                    }

                    if (quizResponse.data) {
                        set({
                            quizHistory: quizResponse.data,
                            totalSessions: quizResponse.data.length,
                        });
                    }

                    if (moodResponse.data) {
                        set({
                            moodHistory: moodResponse.data,
                            streak: calculateStreak(moodResponse.data),
                        });
                    }
                } catch (error) {
                    const errMsg = error instanceof Error ? error.message : 'Network error — check your connection';
                    console.error('Failed to fetch user data:', error);
                    set({ lastError: errMsg });
                } finally {
                    set({ isRefreshing: false });
                }
            },

            reset: () => set(initialState),
        }),
        {
            name: "mindcalm-app-store",
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist what matters across restarts
            partialize: (state) => ({
                moodHistory: state.moodHistory,
                quizHistory: state.quizHistory,
                streak: state.streak,
                totalSessions: state.totalSessions,
                // Preferences
                notificationsEnabled: state.notificationsEnabled,
                reminderTime: state.reminderTime,
                // Profile
                displayName: state.displayName,
                avatarEmoji: state.avatarEmoji,
                goals: state.goals,
                hasCompletedProfileSetup: state.hasCompletedProfileSetup,
            }),
        }
    )
);

// ── Typed Selectors (for performance — prevents re-renders) ─

export const selectMoodHistory = (state: AppStore) => state.moodHistory;
export const selectQuizHistory = (state: AppStore) => state.quizHistory;
export const selectStreak = (state: AppStore) => state.streak;
export const selectTotalSessions = (state: AppStore) => state.totalSessions;
export const selectIsLoading = (state: AppStore) => state.isLoading;
export const selectIsRefreshing = (state: AppStore) => state.isRefreshing;

export const selectLastError = (state: AppStore) => state.lastError;
export const selectDisplayName = (state: AppStore) => state.displayName;
export const selectAvatarEmoji = (state: AppStore) => state.avatarEmoji;
export const selectGoals = (state: AppStore) => state.goals;
export const selectNotificationsEnabled = (state: AppStore) => state.notificationsEnabled;
export const selectReminderTime = (state: AppStore) => state.reminderTime;
export const selectProfileLoaded = (state: AppStore) => state.profileLoaded;
export const selectHasCompletedProfileSetup = (state: AppStore) => state.hasCompletedProfileSetup;
