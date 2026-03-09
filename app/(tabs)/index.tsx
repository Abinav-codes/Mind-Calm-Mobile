import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { AmbientOrbs } from "../../src/components/ui/AmbientOrbs";
import { FeatureBanner } from "../../src/components/ui/FeatureBanner";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { MoodCheckin } from "../../src/components/ui/MoodCheckin";
import { PressableScale } from "../../src/components/ui/PressableScale";
import { ScreenWrapper } from "../../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Gradients, Radius, Spacing } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { getQuoteOfTheDay } from "../../src/data/dailyQuotes";
import { selectDisplayName, selectIsRefreshing, selectLastError, selectStreak, selectTotalSessions, useAppStore } from "../../src/stores/appStore";

// ── Data ───────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { id: "stress", title: "Stress Less", subtitle: "Quiz", icon: "leaf", color: Colors.category.stress.main, route: "/quiz/stress", duration: "3 min" },
  { id: "mindfulness", title: "Be Mindful", subtitle: "Quiz", icon: "eye", color: Colors.category.mindfulness.main, route: "/quiz/mindfulness", duration: "3 min" },
  { id: "chat", title: "AI Chat", subtitle: "Talk anytime", icon: "chatbubble-ellipses", color: Colors.success, route: "/chat", duration: "Instant" },
  { id: "articles", title: "Articles", subtitle: "Expert advice", icon: "book", color: Colors.accent, route: "/blog", duration: "Read" },
];

// ── Pulsing Play Button ────────────────────────────────────
function BreathingPlayButton({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ), -1, false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ), -1, false
    );
  }, []);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow ring */}
      <Animated.View style={[glowStyle, {
        position: "absolute",
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
      }]} />
      <Animated.View style={[buttonStyle, {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
      }]}>
        <Ionicons name={icon} size={28} color="#FFF" style={{ marginLeft: 4 }} />
      </Animated.View>
    </View>
  );
}



// ── SOS Pulse Icon ─────────────────────────────────────────
function PulsingSOSIcon() {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(1.6, { duration: 0 })
      ), -1, false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(0.4, { duration: 0 })
      ), -1, false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center", marginRight: Spacing.md }}>
      {/* Expanding pulse ring */}
      <Animated.View style={[pulseStyle, {
        position: "absolute",
        width: 48, height: 48, borderRadius: 24,
        borderWidth: 2,
        borderColor: "#EF4444",
      }]} />
      {/* Core icon */}
      <View style={{
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: "rgba(239,68,68,0.15)",
        justifyContent: "center", alignItems: "center",
        borderWidth: 1, borderColor: "rgba(239,68,68,0.4)",
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
      }}>
        <Ionicons name="pulse" size={24} color="#EF4444" />
      </View>
    </View>
  );
}

// ── Home Screen ────────────────────────────────────────────
export default function HomeScreen() {
  const { user } = useAuth();
  const streak = useAppStore(selectStreak);
  const totalSessions = useAppStore(selectTotalSessions);
  const fetchUserData = useAppStore((s) => s.fetchUserData);
  const clearError = useAppStore((s) => s.clearError);
  const isRefreshing = useAppStore(selectIsRefreshing);
  const lastError = useAppStore(selectLastError);
  const displayName = useAppStore(selectDisplayName);

  const userName = displayName || user?.email?.split("@")[0] || "Friend";

  const handleRefresh = useCallback(() => {
    if (user?.id) fetchUserData(user.id);
  }, [user?.id, fetchUserData]);

  const [greeting, setGreeting] = useState("Good day");
  const [subtitle, setSubtitle] = useState("We wish you a peaceful day");
  const [quote] = useState(getQuoteOfTheDay());

  // Stats pill entrance
  const statsPillScale = useSharedValue(0.6);
  const statsPillOpacity = useSharedValue(0);
  useEffect(() => {
    const t = setTimeout(() => {
      statsPillScale.value = withSpring(1, { damping: 14, stiffness: 120 });
      statsPillOpacity.value = withTiming(1, { duration: 600 });
    }, 800);
    return () => clearTimeout(t);
  }, []);
  const statsPillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsPillScale.value }],
    opacity: statsPillOpacity.value,
  }));

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setSubtitle("Set your intention for the day");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
      setSubtitle("Take a moment to center yourself");
    } else {
      setGreeting("Good evening");
      setSubtitle("Time to wind down and reflect");
    }
  }, []);



  return (
    <ScreenWrapper scroll paddingHorizontal={0} refreshing={isRefreshing} onRefresh={handleRefresh} error={lastError} onDismissError={clearError}>
      {/* Ambient Background Orbs — creates depth behind all content */}
      <AmbientOrbs />

      {/* ── 1. Header ────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(800).springify().damping(16)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <Text style={{ color: Colors.text.primary, fontSize: FontSize["2xl"][0], fontWeight: "800", marginBottom: 2 }}>
          {greeting}, {userName} 👋
        </Text>
        <Animated.Text
          entering={FadeIn.delay(400).duration(800)}
          style={{ color: Colors.text.muted, fontSize: FontSize.md[0] }}
        >
          {subtitle}
        </Animated.Text>
      </Animated.View>

      {/* ── 2. Feature Banners (Scale-in entrance) ────── */}
      <Animated.View
        entering={FadeInDown.delay(250).duration(700).springify().damping(14)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <View style={{ flexDirection: "row", gap: Spacing.base }}>
          <PressableScale onPress={() => router.push("/breathe")} style={{ flex: 1 }}>
            <FeatureBanner
              title="Breathe"
              subtitle="EXERCISE"
              duration="5 min"
              icon="water"
              gradient={Colors.banner.purpleGradient}
              onPress={() => router.push("/breathe")}
            />
          </PressableScale>
          <PressableScale onPress={() => router.push("/quiz/intro/sleep")} style={{ flex: 1 }}>
            <FeatureBanner
              title="Sleep"
              subtitle="QUIZ"
              duration="5 min"
              icon="moon"
              gradient={Colors.banner.goldGradient}
              onPress={() => router.push("/quiz/intro/sleep")}
            />
          </PressableScale>
        </View>
      </Animated.View>

      {/* ── 3. Daily Intention Hero ──────────────────────── */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(900).springify().damping(12)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <PressableScale onPress={() => router.push("/breathe")} scale={0.97}>
          <LinearGradient
            colors={Colors.banner.darkGradient as unknown as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: Radius["3xl"],
              padding: Spacing.xl,
              minHeight: 160,
              justifyContent: "center",
              borderWidth: 1,
              borderTopColor: "rgba(255,255,255,0.12)",
              borderLeftColor: "rgba(255,255,255,0.08)",
              borderRightColor: "rgba(255,255,255,0.03)",
              borderBottomColor: "rgba(255,255,255,0.02)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Animated.View
                  entering={FadeIn.delay(600).duration(600)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    paddingHorizontal: 12, paddingVertical: 6,
                    borderRadius: 20, alignSelf: 'flex-start',
                    marginBottom: 16, borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.12)'
                  }}
                >
                  <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 }}>
                    ✨ DAILY CALM
                  </Text>
                </Animated.View>
                <Animated.Text
                  entering={FadeInDown.delay(700).duration(800)}
                  style={{ color: "#FFF", fontSize: FontSize["2xl"][0], fontWeight: "600", lineHeight: 34, paddingRight: 8 }}
                >
                  "{quote.text}"
                </Animated.Text>
              </View>
              <BreathingPlayButton icon="play" />
            </View>
          </LinearGradient>
        </PressableScale>

        {/* Stats Pill — pops in with scale spring */}
        <Animated.View style={[statsPillStyle, { flexDirection: "row", justifyContent: "center", marginTop: Spacing.lg }]}>
          <View style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            paddingHorizontal: 18, paddingVertical: 10,
            borderRadius: 24, flexDirection: "row", alignItems: "center",
            borderWidth: 0.5, borderColor: "rgba(255,255,255,0.12)",
          }}>
            <Text style={{ color: Colors.text.secondary, fontSize: FontSize.sm[0], fontWeight: "600" }}>
              🔥 {streak} Day Streak  <Text style={{ opacity: 0.3 }}>|</Text>  🧘 {totalSessions} Sessions
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* ── 4. Mood Check-in ─────────────────────────────── */}
      {user?.id && <MoodCheckin userId={user.id} />}

      {/* ── 5. Quick Actions Carousel ────────────────────── */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(800).springify()}
        style={{ marginBottom: Spacing["2xl"] }}
      >
        <Animated.Text
          entering={FadeIn.delay(750).duration(600)}
          style={{ color: Colors.text.primary, fontSize: FontSize.lg[0], fontWeight: "800", marginBottom: Spacing.base, paddingHorizontal: Spacing.xl }}
        >
          Quick Actions
        </Animated.Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}
        >
          {QUICK_ACTIONS.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={SlideInRight.delay(800 + index * 120).duration(600).springify().damping(14)}
            >
              <PressableScale
                onPress={() => router.push(action.route as any)}
                style={{ width: 150 }}
              >
                <GlassCard variant="elevated" radius={Radius["2xl"]} style={{ alignItems: "center", padding: Spacing.xl }}>
                  {/* Glowing Icon Orb */}
                  <View style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: `${action.color}18`,
                    justifyContent: "center", alignItems: "center",
                    marginBottom: Spacing.lg,
                    borderWidth: 1, borderColor: `${action.color}40`,
                    shadowColor: action.color,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
                  }}>
                    <Ionicons name={action.icon as any} size={28} color={action.color} />
                  </View>
                  <Text style={{ color: Colors.text.primary, fontSize: FontSize.md[0], fontWeight: "800", marginBottom: 4, textAlign: "center" }}>
                    {action.title}
                  </Text>
                  <Text style={{ color: Colors.text.muted, fontSize: FontSize.xs[0], fontWeight: "500", textAlign: "center", marginBottom: Spacing.md }}>
                    {action.subtitle}
                  </Text>
                  <View style={{ backgroundColor: `${action.color}12`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: `${action.color}25` }}>
                    <Text style={{ color: action.color, fontSize: 10, fontWeight: "800", letterSpacing: 0.5 }}>{action.duration.toUpperCase()}</Text>
                  </View>
                </GlassCard>
              </PressableScale>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── 6. SOS with Pulsing Heart ────────────────────── */}
      <Animated.View
        entering={FadeInDown.delay(1000).duration(800).springify()}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing["3xl"] }}
      >
        <PressableScale onPress={() => router.push("/sos")} scale={0.97}>
          <LinearGradient
            colors={Gradients.sosGradient as unknown as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: Radius["2xl"],
              padding: Spacing.base,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(239,68,68,0.2)",
            }}
          >
            <PulsingSOSIcon />
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.text.primary, fontWeight: "800", fontSize: FontSize.md[0], marginBottom: 2 }}>
                Panic or Anxiety Attack?
              </Text>
              <Text style={{ color: Colors.dangerLight, fontSize: FontSize.xs[0], fontWeight: "600", opacity: 0.9 }}>
                Start instant grounding exercise →
              </Text>
            </View>
          </LinearGradient>
        </PressableScale>
      </Animated.View>

    </ScreenWrapper>
  );
}
