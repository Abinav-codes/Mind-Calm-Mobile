// ─────────────────────────────────────────────────────────────
// ErrorBoundary — Catches JS errors, shows recovery UI
// ─────────────────────────────────────────────────────────────
// From react-native-architecture: "Mobile crashes are
// unforgiving. A blank screen with no way to recover will
// make users uninstall."
//
// Wraps the root layout. On error:
//  - Logs the error
//  - Shows a friendly screen with a "Try Again" button
//  - The button resets the error state (re-renders children)
// ─────────────────────────────────────────────────────────────

import { Ionicons } from "@expo/vector-icons";
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "../constants/theme";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // In production, you'd send this to a crash reporting service
        // (e.g., Sentry, Crashlytics)
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="cloud-offline-outline"
                                size={48}
                                color={Colors.accent}
                            />
                        </View>

                        <Text style={styles.title}>Something went wrong</Text>

                        <Text style={styles.message}>
                            Don't worry — your data is safe.{"\n"}
                            Try restarting the screen.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.debugContainer}>
                                <Text style={styles.debugText}>
                                    {this.state.error.message}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.handleReset}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: Spacing.xl,
    },
    card: {
        backgroundColor: Colors.surface.elevated,
        borderRadius: Radius.xl,
        padding: Spacing["2xl"],
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.border.default,
        width: "100%",
        maxWidth: 340,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: Radius.full,
        backgroundColor: Colors.surface.base,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    title: {
        color: Colors.text.primary,
        fontSize: FontSize.xl[0],
        lineHeight: FontSize.xl[1],
        fontWeight: "700",
        marginBottom: Spacing.sm,
        textAlign: "center",
    },
    message: {
        color: Colors.text.muted,
        fontSize: FontSize.base[0],
        lineHeight: FontSize.base[1],
        textAlign: "center",
        marginBottom: Spacing.xl,
    },
    debugContainer: {
        backgroundColor: Colors.surface.base,
        borderRadius: Radius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        width: "100%",
    },
    debugText: {
        color: Colors.danger,
        fontSize: FontSize.sm[0],
        fontFamily: "monospace",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.accent,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: Radius.base,
        gap: Spacing.sm,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: FontSize.md[0],
        fontWeight: "700",
    },
});
