import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useAppHydration } from "../src/hooks/useAppHydration";
import { selectHasCompletedProfileSetup, useAppStore } from "../src/stores/appStore";

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

function ProtectedRouteGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasCompletedProfileSetup = useAppStore(selectHasCompletedProfileSetup);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const onProfileSetup = segments[1] === "profile-setup";

    if (!user && !inAuthGroup) {
      // Not signed in → redirect to onboarding
      router.replace("/(auth)/onboarding");
    } else if (user && inAuthGroup && !onProfileSetup) {
      if (!hasCompletedProfileSetup) {
        // Signed in but hasn't set up profile → go to profile setup
        // Also persist onboarding goals to Supabase now that we have a user
        const goals = useAppStore.getState().goals;
        if (goals.length > 0) {
          useAppStore.getState().saveGoals(user.id, goals);
        }
        router.replace("/(auth)/profile-setup");
      } else {
        // Signed in + profile complete → go home
        router.replace("/(tabs)");
      }
    }
  }, [user, loading, segments]);

  return null;
}

/** Syncs Zustand store with Supabase when auth state changes */
function AppHydrator() {
  useAppHydration();
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppHydrator />
        <ProtectedRouteGuard />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#1B2250" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="quiz/[category]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="quiz/analysis"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="chat"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="blog/index"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="blog/[id]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="sos"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
