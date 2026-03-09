export interface BlogPost {
    id: number;
    title: string;
    category: string;
    readTime: string;
    image: string;
    date: string;
    emoji: string;
    content: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "How to use mindfulness to cope with depression: 7 techniques",
        category: "Meditation & Mindfulness",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        date: "Feb 18, 2026",
        emoji: "🧘",
        content: `Mindfulness can be a powerful tool in managing depression. Here are 7 evidence-based techniques:

**1. Body Scan Meditation**
Start from your toes and work up to the crown of your head. Notice sensations without judgment — warmth, tension, tingling.

**2. Mindful Breathing**
Focus on the breath. Inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system.

**3. Gratitude Journaling**
Each day, write down three things you're grateful for, no matter how small. This rewires your brain toward positive patterns.

**4. Walking Meditation**
Take slow, deliberate steps while paying attention to the sensation of your feet touching the ground.

**5. Present Moment Awareness**
Throughout the day, pause and notice what you can see, hear, smell, taste, and touch right now.

**6. Non-Judgmental Observation**
When difficult thoughts arise, observe them as passing mental events rather than absolute truths.

**7. Loving-Kindness Meditation**
Send wishes of well-being to yourself, then gradually extend them to loved ones, acquaintances, and even difficult people.`,
    },
    {
        id: 2,
        title: "Understanding your sleep cycles for better rest",
        category: "Sleep",
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
        date: "Feb 15, 2026",
        emoji: "🌙",
        content: `Your sleep architecture consists of 4-6 cycles per night, each lasting about 90 minutes.

**Stage 1: Light Sleep (5-10 min)**
The transition phase. Your muscles relax, eye movements slow, and brain waves begin to shift.

**Stage 2: True Sleep (20 min)**
Heart rate drops, body temperature decreases. Sleep spindles appear — bursts of neural activity that consolidate memory.

**Stage 3: Deep Sleep (20-40 min)**
The restorative phase. Growth hormone is released, immune function strengthens, and tissue repair occurs.

**REM Sleep (10-60 min)**
Where dreams happen. Your brain is nearly as active as when awake. Critical for emotional processing and creativity.

**Optimizing Your Sleep**
Create a sleep sanctuary: keep your bedroom cool (65-68°F), block out light, and minimize noise. Consistency is key — go to bed and wake up at the same time every day, even weekends.`,
    },
    {
        id: 3,
        title: "Sleep hygiene: 10 habits for better rest tonight",
        category: "Sleep",
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&q=80",
        date: "Feb 12, 2026",
        emoji: "😴",
        content: `Transform your nights with these evidence-based sleep habits:

**1.** Set a consistent bedtime and wake time
**2.** Create a 30-minute wind-down routine
**3.** Keep your bedroom cool (65-68°F)
**4.** Block all light sources — use blackout curtains
**5.** Avoid screens 1 hour before bed (blue light suppresses melatonin)
**6.** Limit caffeine after 2 PM
**7.** Exercise regularly, but not within 3 hours of bedtime
**8.** Don't eat heavy meals before sleep
**9.** Use your bed only for sleep — no work, no scrolling
**10.** If you can't sleep after 20 min, get up and do something calming

The key is consistency. Your body thrives on routine.`,
    },
    {
        id: 4,
        title: "Managing anxiety in uncertain times: A practical guide",
        category: "Stress & Anxiety",
        readTime: "9 min",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
        date: "Feb 8, 2026",
        emoji: "🌿",
        content: `Anxiety thrives on uncertainty. Here's how to find calm when the world feels chaotic.

**Breaking the Cycle**
Name your emotion to tame it. Ground yourself with the 5-4-3-2-1 technique:
- 5 things you see
- 4 things you hear
- 3 things you touch
- 2 things you smell
- 1 thing you taste

**Box Breathing**
Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4. Repeat 5 times.

**Limit News Consumption**
Set specific times for checking news rather than constant scrolling.

**Focus on What You Can Control**
Make a two-column list: "Can Control" and "Cannot Control." Focus your energy on column one.

**Move Your Body**
Even 15 minutes of walking releases endorphins and reduces cortisol.`,
    },
    {
        id: 5,
        title: "Burnout recovery: Signs, stages, and strategies",
        category: "Stress & Anxiety",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=800&q=80",
        date: "Feb 5, 2026",
        emoji: "🔋",
        content: `Burnout isn't just being tired — it's emotional, physical, and mental exhaustion caused by prolonged stress.

**The 5 Stages**
1. Honeymoon Phase — High energy, optimism
2. Onset of Stress — Awareness of harder days
3. Chronic Stress — Physical and emotional symptoms
4. Burnout — Can't function normally
5. Habitual Burnout — Embedded in your life

**Warning Signs**
- Constant fatigue despite rest
- Cynicism about your work
- Feeling ineffective or like nothing matters
- Physical symptoms: headaches, stomach issues
- Withdrawal from responsibilities

**Recovery Strategies**
- Acknowledge it — you're not weak, you're human
- Set firm boundaries
- Prioritize rest without guilt
- Reconnect with your purpose
- Seek support — therapy is strength
- Make structural changes if needed`,
    },
    {
        id: 6,
        title: "Mindful eating: Transform your relationship with food",
        category: "Meditation & Mindfulness",
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        date: "Jan 30, 2026",
        emoji: "🍃",
        content: `Mindful eating is about bringing full attention to the experience of eating.

**The Practice**
- Eat slowly — put your fork down between bites
- Notice colors, textures, and aromas
- Chew thoroughly, savoring each flavor
- Listen to your body's hunger and fullness cues
- Remove distractions: no phone, no TV

**Why It Works**
Studies show mindful eating reduces binge eating, emotional eating, and helps maintain a healthy weight. It's not about restriction — it's about awareness.

**Start Small**
Try one mindful meal per day. Even 5 minutes of eating without distraction can shift your relationship with food.`,
    },
    {
        id: 7,
        title: "The beginner's guide to meditation: Start your practice today",
        category: "Meditation & Mindfulness",
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
        date: "Jan 26, 2026",
        emoji: "🫧",
        content: `"I can't meditate — my mind is too busy." That's exactly why you should meditate.

**How to Start**
1. Find a quiet spot. Sit comfortably.
2. Close your eyes. Take three deep breaths.
3. Focus on your breath — the rise and fall.
4. When your mind wanders (it will), gently return.
5. Start with just 2 minutes. Add 1 minute per week.

**Common Myths**
- "I need to clear my mind" — No. Notice thoughts, don't fight them.
- "I need special equipment" — A chair works fine.
- "Results should be instant" — Like exercise, consistency matters.

**The Science**
Regular meditation physically changes your brain:
- Thickens the prefrontal cortex (decision-making)
- Shrinks the amygdala (stress response)
- Strengthens neural connections for focus

Start today. Just 2 minutes. You've got this. 🧘‍♀️`,
    },
    {
        id: 8,
        title: "Digital detox: Reclaim your attention and peace",
        category: "Personal Growth",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80",
        date: "Jan 22, 2026",
        emoji: "📵",
        content: `The average person checks their phone 150+ times a day. Here's how to break free.

**The Problem**
- Social media triggers dopamine loops that keep you scrolling
- Constant notifications fragment your attention
- Blue light disrupts sleep and circadian rhythm
- Comparison culture fuels anxiety and inadequacy

**Your Digital Detox Plan**
1. **Audit your usage** — Check screen time stats honestly
2. **Set boundaries** — No phone before 9 AM or after 9 PM
3. **Remove triggers** — Delete apps that waste your time
4. **Create tech-free zones** — Bedroom, dining table
5. **Replace with real activities** — Read, walk, cook, create
6. **Use grayscale mode** — Makes your phone less appealing

**Start Small**
Try one hour without your phone tomorrow. Notice how you feel. That discomfort? That's your attention muscle growing.`,
    },
];

export const blogCategories = [
    "All",
    "Meditation & Mindfulness",
    "Sleep",
    "Stress & Anxiety",
    "Personal Growth",
];
