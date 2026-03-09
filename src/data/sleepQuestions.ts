export interface QuizOption {
    text: string;
    emoji: string;
    value: number;
}

export interface QuizQuestion {
    id: string;
    text: string;
    options: QuizOption[];
}

export const sleepQuestions: QuizQuestion[] = [
    {
        id: "bus-sleep",
        text: "Do you sleep on a bus or train while moving?",
        options: [
            { text: "Frequently", emoji: "😴", value: 2 },
            { text: "Never", emoji: "👀", value: 4 },
            { text: "Sometimes", emoji: "😌", value: 3 },
        ],
    },
    {
        id: "dreams",
        text: "Do you dream while sleeping?",
        options: [
            { text: "God-level dreamer", emoji: "🌈", value: 4 },
            { text: "No dreams at all", emoji: "🌑", value: 2 },
            { text: "Sometimes I dream", emoji: "☁️", value: 3 },
        ],
    },
    {
        id: "zombie",
        text: "Hey, do you sleep or are you a zombie?",
        options: [
            { text: "I'm a Zombie", emoji: "🧟", value: 1 },
            { text: "I'm a Vampire", emoji: "🧛", value: 1 },
            { text: "Perfect human", emoji: "😊", value: 4 },
        ],
    },
    {
        id: "relationships",
        text: "How is your relationship with everyone going?",
        options: [
            { text: "Rather not say", emoji: "🤐", value: 2 },
            { text: "Yeah I'm cooked", emoji: "🔥", value: 1 },
            { text: "People love me", emoji: "❤️", value: 4 },
        ],
    },
    {
        id: "love-sleep",
        text: "Do you love sleep?",
        options: [
            { text: "Infinity", emoji: "♾️", value: 4 },
            { text: "Yeah it's good", emoji: "👍", value: 3 },
            { text: "Waste of time", emoji: "⏰", value: 1 },
        ],
    },
    {
        id: "disturbed",
        text: "Do you get angry when someone disturbs your sleep?",
        options: [
            { text: "Yeah I'm armed", emoji: "😤", value: 3 },
            { text: "Nah it's fine", emoji: "😇", value: 4 },
            { text: "Sometimes I rage", emoji: "💢", value: 2 },
        ],
    },
    {
        id: "caffeine",
        text: "Do you drink coffee or tea a lot?",
        options: [
            { text: "Yeah it helps", emoji: "☕", value: 3 },
            { text: "Can't live without it", emoji: "🫠", value: 1 },
            { text: "Not very often", emoji: "🍵", value: 4 },
        ],
    },
    {
        id: "sleepyhead",
        text: 'Have you ever had the nickname "Sleepy head"?',
        options: [
            { text: "Yeah I swear", emoji: "😪", value: 3 },
            { text: "No but got other names", emoji: "🏷️", value: 3 },
            { text: "No nicknames", emoji: "🙅", value: 2 },
        ],
    },
    {
        id: "need-sleep-now",
        text: "Do you need to sleep right now?",
        options: [
            { text: "Yeah leave me!", emoji: "🛏️", value: 3 },
            { text: "No I'm an owl", emoji: "🦉", value: 2 },
            { text: "No idea", emoji: "🤔", value: 2 },
        ],
    },
    {
        id: "benefits",
        text: "Are you aware of the benefits of sleeping?",
        options: [
            { text: "I'm aware", emoji: "🧠", value: 4 },
            { text: "Should I know?", emoji: "❓", value: 1 },
            { text: "Some of them", emoji: "📚", value: 3 },
        ],
    },
    {
        id: "work-hours",
        text: "What are your working hours?",
        options: [
            { text: "9-5 regular", emoji: "💼", value: 4 },
            { text: "Night shift", emoji: "🌙", value: 1 },
            { text: "Flexible", emoji: "🔄", value: 3 },
        ],
    },
    {
        id: "fullest",
        text: "Are you living your life to the fullest?",
        options: [
            { text: "Yeah man!", emoji: "🎉", value: 4 },
            { text: "I wanna live and love", emoji: "💫", value: 3 },
            { text: "Not every bit", emoji: "😔", value: 2 },
        ],
    },
    {
        id: "screen-time",
        text: "What is your average screen time?",
        options: [
            { text: "That's messed up", emoji: "📱", value: 1 },
            { text: "I'm a normal surfer", emoji: "🏄", value: 3 },
            { text: "Less screen time", emoji: "🌿", value: 4 },
        ],
    },
    {
        id: "physical",
        text: "Any physical activity every day?",
        options: [
            { text: "I'm a fitness freak", emoji: "💪", value: 4 },
            { text: "Do some activity", emoji: "🚶", value: 3 },
            { text: "Does walking count?", emoji: "👟", value: 2 },
        ],
    },
    {
        id: "break",
        text: "Do you need a break from daily routine?",
        options: [
            { text: "Yeah I'm burned out", emoji: "🫠", value: 1 },
            { text: "Wanna go on a trip", emoji: "✈️", value: 3 },
            { text: "Nah I'm good", emoji: "✌️", value: 4 },
        ],
    },
    {
        id: "pills",
        text: "Do you use sleeping pills?",
        options: [
            { text: "Yeah I take them", emoji: "💊", value: 1 },
            { text: "Sometimes", emoji: "🤏", value: 2 },
            { text: "Nah I'm good", emoji: "🙌", value: 4 },
        ],
    },
    {
        id: "chronotype",
        text: "Are you a morning person or a night person?",
        options: [
            { text: "Morning person", emoji: "🌅", value: 4 },
            { text: "Night owl", emoji: "🦉", value: 2 },
            { text: "Balanced one", emoji: "⚖️", value: 3 },
        ],
    },
];
