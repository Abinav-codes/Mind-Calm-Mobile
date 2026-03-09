import React from "react";
import { Dimensions, View } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import { Colors, Spacing } from "../../constants/theme";

interface StreakCalendarProps {
    dates: string[]; // ISO date strings like "2024-03-02"
}

export function StreakCalendar({ dates }: StreakCalendarProps) {
    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 48; // padding

    // Format data for ContributionGraph
    const dateCounts = dates.reduce((acc, dateStr) => {
        // Just need the YYYY-MM-DD part
        const day = dateStr.split("T")[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(dateCounts).map(([date, count]) => ({
        date,
        count
    }));

    // If no data, still render an empty grid for effect
    const defaultData = chartData.length > 0 ? chartData : [{ date: new Date().toISOString().split("T")[0], count: 0 }];

    // End date is today
    const endDate = new Date();

    return (
        <View style={{ alignItems: "center" }}>
            <ContributionGraph
                values={defaultData}
                endDate={endDate}
                numDays={screenWidth > 400 ? 105 : 90} // ~3 months visible
                width={chartWidth}
                height={220}
                chartConfig={{
                    backgroundColor: "transparent",
                    backgroundGradientFrom: "transparent",
                    backgroundGradientTo: "transparent",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    color: (opacity = 1) => {
                        // The default empty cell color
                        if (opacity === 0.15) return `rgba(255, 255, 255, 0.05)`;
                        // The filled cell color (opacity scales with count)
                        return `rgba(52, 211, 153, ${opacity})`; // Colors.success base
                    },
                    strokeWidth: 2,
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false,
                    propsForLabels: {
                        fontSize: 10,
                        fill: Colors.text.dim,
                    }
                }}
                tooltipDataAttrs={(value: any) => {
                    return {
                        rx: "4",
                        ry: "4",
                    };
                }}
                horizontal={false}
                showMonthLabels={true}
                squareSize={screenWidth > 400 ? 16 : 14}
                style={{
                    marginVertical: Spacing.sm,
                    borderRadius: 16,
                }}
            />
        </View>
    );
}
