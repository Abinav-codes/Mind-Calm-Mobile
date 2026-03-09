export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    first_checkin: {
        id: 'first_checkin',
        title: 'First Step',
        description: 'Completed your first mood check-in.',
        icon: 'footsteps',
        color: '#38bdf8', // sky-400
    },
    streak_3: {
        id: 'streak_3',
        title: 'Momentum',
        description: 'Maintained a 3-day check-in streak.',
        icon: 'flame',
        color: '#f97316', // orange-500
    },
    streak_7: {
        id: 'streak_7',
        title: 'Consistency',
        description: 'Maintained a 7-day check-in streak.',
        icon: 'calendar',
        color: '#f59e0b', // amber-500
    },
    first_quiz: {
        id: 'first_quiz',
        title: 'Self-Discovery',
        description: 'Completed your first assessment.',
        icon: 'search',
        color: '#a855f7', // purple-500
    },
    all_quizzes: {
        id: 'all_quizzes',
        title: 'Comprehensive View',
        description: 'Completed at least one of every assessment type.',
        icon: 'library',
        color: '#ec4899', // pink-500
    },
    night_owl: {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Logged a mood between 10 PM and 4 AM.',
        icon: 'moon',
        color: '#6366f1', // indigo-500
    },
    early_bird: {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Logged a mood between 4 AM and 8 AM.',
        icon: 'sunny',
        color: '#eab308', // yellow-500
    },
};

// Helper to determine unlocked achievements based on store state
export function calculateUnlockedAchievements(
    moodHistory: any[],
    quizHistory: any[],
    streak: number
): string[] {
    const unlocked = new Set<string>();

    // 1. First Checkin
    if (moodHistory.length > 0) {
        unlocked.add('first_checkin');
    }

    // 2. Streaks
    if (streak >= 3) unlocked.add('streak_3');
    if (streak >= 7) unlocked.add('streak_7');

    // 3. First Quiz
    if (quizHistory.length > 0) {
        unlocked.add('first_quiz');
    }

    // 4. All Quizzes
    const uniqueCategories = new Set(quizHistory.map((q) => q.category));
    if (uniqueCategories.size >= 4) { // Assuming 4 categories exist
        unlocked.add('all_quizzes');
    }

    // 5. Time-based Moods
    for (const entry of moodHistory) {
        const hour = new Date(entry.created_at).getHours();
        if (hour >= 22 || hour < 4) {
            unlocked.add('night_owl');
        } else if (hour >= 4 && hour < 8) {
            unlocked.add('early_bird');
        }
    }

    return Array.from(unlocked);
}
