// ─────────────────────────────────────────────────────────────
// ScreenWrapper — Consistent screen layout component
// ─────────────────────────────────────────────────────────────
// Wraps every screen with the branded gradient background,
// safe area handling, standard padding, pull-to-refresh,
// and optional error banner.
// ─────────────────────────────────────────────────────────────

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { RefreshControl, ScrollView, Text, View, ViewStyle } from "react-native";
import { Colors, FontSize, Gradients, Radius, Spacing } from "../../constants/theme";
import { PressableScale } from "./PressableScale";

// ── Props ──────────────────────────────────────────────────
interface ScreenWrapperProps {
    children: React.ReactNode;
    /** Use ScrollView instead of plain View */
    scroll?: boolean;
    /** Custom gradient colors */
    gradient?: readonly [string, string, ...string[]];
    /** Top padding (default: 60 — status bar safe) */
    paddingTop?: number;
    /** Bottom padding (default: 100 — tab bar safe) */
    paddingBottom?: number;
    /** Horizontal padding (default: 0 — screens handle their own) */
    paddingHorizontal?: number;
    /** Custom style for the inner container */
    style?: ViewStyle;
    /** Whether to show scroll indicator */
    showScrollIndicator?: boolean;
    /** Enable pull-to-refresh (only works when scroll=true) */
    refreshing?: boolean;
    /** Callback when user pulls to refresh */
    onRefresh?: () => void;
    /** Error message to show as a dismissible banner */
    error?: string | null;
    /** Callback to dismiss the error */
    onDismissError?: () => void;
}

// ── Error Banner ───────────────────────────────────────────
function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
    return (
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.md }}>
            <PressableScale onPress={onDismiss} scale={0.98}>
                <View style={{
                    backgroundColor: "rgba(239,68,68,0.15)",
                    borderRadius: Radius.base,
                    padding: Spacing.base,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(239,68,68,0.3)",
                }}>
                    <Ionicons
                        name="cloud-offline-outline"
                        size={20}
                        color={Colors.danger}
                        style={{ marginRight: Spacing.sm }}
                    />
                    <Text style={{ color: Colors.dangerLight, fontSize: FontSize.sm[0], flex: 1 }}>
                        {message}
                    </Text>
                    <Ionicons name="close" size={16} color={Colors.text.dim} />
                </View>
            </PressableScale>
        </View>
    );
}

// ── Component ──────────────────────────────────────────────
export function ScreenWrapper({
    children,
    scroll = false,
    gradient,
    paddingTop = 60,
    paddingBottom = 100,
    paddingHorizontal = 0,
    style,
    showScrollIndicator = false,
    refreshing,
    onRefresh,
    error,
    onDismissError,
}: ScreenWrapperProps) {
    const gradientColors = gradient || Gradients.screenPrimary;

    const errorBanner = error ? (
        <ErrorBanner message={error} onDismiss={onDismissError} />
    ) : null;

    if (scroll) {
        return (
            <LinearGradient
                colors={gradientColors as [string, string, ...string[]]}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[
                        {
                            paddingTop,
                            paddingBottom,
                            paddingHorizontal,
                        },
                        style,
                    ]}
                    showsVerticalScrollIndicator={showScrollIndicator}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl
                                refreshing={refreshing ?? false}
                                onRefresh={onRefresh}
                                tintColor={Colors.accent}
                                colors={[Colors.accent]}
                                progressBackgroundColor={Colors.primaryLight}
                            />
                        ) : undefined
                    }
                >
                    {errorBanner}
                    {children}
                </ScrollView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            style={{ flex: 1 }}
        >
            <View
                style={[
                    {
                        flex: 1,
                        paddingTop,
                        paddingHorizontal,
                    },
                    style,
                ]}
            >
                {errorBanner}
                {children}
            </View>
        </LinearGradient>
    );
}
