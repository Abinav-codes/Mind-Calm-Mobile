import { QuizQuestion } from "./sleepQuestions";

export const mindfulnessQuestions: QuizQuestion[] = [
    {
        id: "autopilot",
        text: "Do you find yourself rushing through activities without being really attentive to them?",
        options: [
            { text: "Very Often", emoji: "🏃", value: 1 },
            { text: "Sometimes", emoji: "🚶", value: 3 },
            { text: "Rarely", emoji: "🧘", value: 4 },
        ],
    },
    {
        id: "past-future",
        text: "How often do you get stuck thinking about the past or worrying about the future?",
        options: [
            { text: "Almost always", emoji: "😰", value: 1 },
            { text: "Occasionally", emoji: "💭", value: 3 },
            { text: "I live in the now", emoji: "🌸", value: 4 },
        ],
    },
    {
        id: "focus",
        text: "When you talk to people, do you find it hard to stay focused on what they are saying?",
        options: [
            { text: "Yes, my mind wanders", emoji: "🌀", value: 1 },
            { text: "Sometimes drift off", emoji: "😶‍🌫️", value: 3 },
            { text: "I listen deeply", emoji: "👂", value: 4 },
        ],
    },
    {
        id: "judgment",
        text: 'Do you tell yourself you "shouldn\'t" be feeling the way you are?',
        options: [
            { text: "Constantly", emoji: "🤦", value: 1 },
            { text: "Sometimes", emoji: "🤷", value: 3 },
            { text: "I accept my feelings", emoji: "💚", value: 4 },
        ],
    },
    {
        id: "savoring",
        text: "Do you notice the smells, sounds, and sights of your daily environment?",
        options: [
            { text: "No, I ignore them", emoji: "🙈", value: 1 },
            { text: "If they are strong", emoji: "👃", value: 3 },
            { text: "Yes, I savor them", emoji: "🌺", value: 4 },
        ],
    },
    {
        id: "breathing",
        text: "How often do you take a moment to just breathe and be still?",
        options: [
            { text: "Never really", emoji: "😵", value: 1 },
            { text: "When stressed", emoji: "😮‍💨", value: 2 },
            { text: "Daily practice", emoji: "🫧", value: 4 },
        ],
    },
];
