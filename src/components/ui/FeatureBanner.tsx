import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "../../constants/theme";

interface FeatureBannerProps {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    gradient: readonly [string, string, ...string[]];
    onPress: () => void;
    duration?: string;
    variant?: "small" | "large";
}

export function FeatureBanner({
    title,
    subtitle,
    icon,
    gradient,
    onPress,
    duration,
    variant = "small",
}: FeatureBannerProps) {
    const handlePress = () => {
        if (onPress) onPress();
    };

    if (variant === "large") {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={{ width: "100%" }}>
                <LinearGradient
                    colors={gradient as unknown as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: Radius["3xl"],
                        padding: Spacing.xl,
                        minHeight: 140,
                        justifyContent: "center",
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1 }}>
                            <View style={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                alignSelf: 'flex-start',
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.15)'
                            }}>
                                <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 }}>
                                    {subtitle.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={{
                                color: "#FFF",
                                fontSize: FontSize["2xl"][0],
                                fontWeight: "600",
                                lineHeight: 34,
                                marginBottom: 8,
                                paddingRight: 8
                            }}>
                                {title}
                            </Text>
                            {duration && (
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                    <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: FontSize.sm[0], marginLeft: 4 }}>
                                        {duration}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                backgroundColor: "rgba(255,255,255,0.2)",
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.4)"
                            }}
                        >
                            <Ionicons name={icon} size={28} color="#FFF" style={{ marginLeft: icon === 'play' ? 4 : 0 }} />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={{ flex: 1 }}>
            <LinearGradient
                colors={gradient as unknown as [string, string, ...string[]]}
                style={{
                    borderRadius: Radius["2xl"],
                    padding: Spacing.base,
                    minHeight: 160,
                    justifyContent: "space-between",
                }}
            >
                <View style={{ alignItems: "flex-end" }}>
                    <Ionicons name={icon} size={32} color="rgba(255,255,255,0.9)" />
                </View>
                <View>
                    <Text style={{ color: "#FFF", fontSize: FontSize.lg[0], fontWeight: "800" }}>
                        {title}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: FontSize.xs[0], fontWeight: "600", marginTop: 2 }}>
                        {subtitle}
                    </Text>
                    {duration && (
                        <View style={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            alignSelf: "flex-start",
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 20,
                            marginTop: 8
                        }}>
                            <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: "800" }}>
                                {duration}
                            </Text>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}
