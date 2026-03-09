export interface DailyQuote {
    text: string;
    author: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
    { text: "Take a deep breath. You're exactly where you need to be.", author: "MindCalm" },
    { text: "Your mind is like water. When it is agitated, it becomes difficult to see.", author: "The Buddha" },
    { text: "Quiet the mind, and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Peace comes from within. Do not seek it without.", author: "The Buddha" },
    { text: "Every breath is a fresh beginning.", author: "Gretchen Rubin" },
    { text: "The soul always knows what to do to heal itself.", author: "Caroline Myss" },
    { text: "Calmness is the cradle of power.", author: "Josiah Gilbert Holland" },
    { text: "Feelings are just clouds in the sky. Let them pass.", author: "MindCalm" },
    { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
    { text: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
];

export function getQuoteOfTheDay(): DailyQuote {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
