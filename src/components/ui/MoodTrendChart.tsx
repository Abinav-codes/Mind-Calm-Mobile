import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { Colors, Spacing } from "../../constants/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DataPoint {
    day: string; // e.g., "Mon"
    intensity: number; // 0 to 5
}

interface MoodTrendChartProps {
    data: DataPoint[];
    width: number;
    height: number;
    color?: string;
}

export function MoodTrendChart({ data, width, height, color = Colors.accent }: MoodTrendChartProps) {
    const padding = Spacing.md;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // We expect exactly 7 points for a 7-day trend. Fill empty if needed.
    const safeData = data.length >= 7 ? data.slice(-7) : [...Array(7 - data.length).fill({ day: "", intensity: 0 }), ...data];

    // Max intensity is 5 (from our slider)
    const MAX_VAL = 5;

    // Calculate Coordinates
    const coords = safeData.map((point, index) => {
        const x = padding + (index * chartWidth) / (safeData.length - 1);
        // Invert Y so 5 is at top, 0 is at bottom
        const y = padding + chartHeight - (point.intensity / MAX_VAL) * chartHeight;
        return { x, y, intensity: point.intensity };
    });

    // Build the SVG Path String (cubic bezier curves for smoothness)
    let pathStr = "";
    if (coords.length > 0) {
        pathStr = `M ${coords[0].x} ${coords[0].y}`;
        for (let i = 0; i < coords.length - 1; i++) {
            const current = coords[i];
            const next = coords[i + 1];

            // Very simple control points for smooth curves
            const controlPointX = (current.x + next.x) / 2;
            pathStr += ` C ${controlPointX} ${current.y}, ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
        }
    }

    // Animation values
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = 0;
        progress.value = withTiming(1, { duration: 1500 });
    }, [data]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: 1000 * (1 - progress.value), // Approximate length
    }));

    return (
        <View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
            <Svg width={width} height={height}>
                <Defs>
                    <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={color} stopOpacity="0.4" />
                        <Stop offset="1" stopColor={color} stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Grid lines (subtle) */}
                {[0, 1, 2].map((lineIndex) => (
                    <Path
                        key={lineIndex}
                        d={`M ${padding} ${padding + (chartHeight / 2) * lineIndex} L ${width - padding} ${padding + (chartHeight / 2) * lineIndex}`}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                    />
                ))}

                {/* The fill area under the curve */}
                {pathStr && (
                    <Path
                        d={`${pathStr} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`}
                        fill="url(#gradient)"
                    />
                )}

                {/* The Animated Line */}
                {pathStr && (
                    <AnimatedPath
                        d={pathStr}
                        stroke={color}
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={1000}
                        animatedProps={animatedProps}
                    />
                )}

                {/* Data Points (Dots) */}
                {coords.map((coord, i) => (
                    coord.intensity > 0 && (
                        <AnimatedCircle
                            key={i}
                            cx={coord.x}
                            cy={coord.y}
                            r="4"
                            fill={Colors.primaryDark}
                            stroke={color}
                            strokeWidth="2"
                        />
                    )
                ))}
            </Svg>
        </View>
    );
}
