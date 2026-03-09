import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GlassCard } from "../src/components/ui/GlassCard";
import { ScreenWrapper } from "../src/components/ui/ScreenWrapper";
import { Colors, FontSize, Spacing } from "../src/constants/theme";
import { cancelAllReminders, requestNotificationPermissions, scheduleDailyReminder } from "../src/services/notifications";
import { selectNotificationsEnabled, selectReminderTime, useAppStore } from "../src/stores/appStore";

const PRESET_TIMES = [
    { label: "Morning (9:00 AM)", hour: 9, minute: 0 },
    { label: "Afternoon (2:00 PM)", hour: 14, minute: 0 },
    { label: "Evening (8:00 PM)", hour: 20, minute: 0 },
    { label: "Night (10:00 PM)", hour: 22, minute: 0 },
];

export default function SettingsScreen() {
    const notificationsEnabled = useAppStore(selectNotificationsEnabled);
    const reminderTime = useAppStore(selectReminderTime);
    const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);
    const setReminderTime = useAppStore((s) => s.setReminderTime);

    const handleToggleNotifications = async (value: boolean) => {
        if (value) {
            const hasPermission = await requestNotificationPermissions();
            if (!hasPermission) {
                Alert.alert("Permission Required", "Please enable notifications in your device settings to receive daily reminders.");
                return;
            }
            // If turning on and we have a time, schedule it. Otherwise default to 8pm.
            const timeToUse = reminderTime || { hour: 20, minute: 0 };
            const id = await scheduleDailyReminder(timeToUse.hour, timeToUse.minute);

            if (id) {
                setNotificationsEnabled(true);
                if (!reminderTime) setReminderTime(timeToUse);
            } else {
                Alert.alert("Error", "Could not schedule reminder.");
            }
        } else {
            await cancelAllReminders();
            setNotificationsEnabled(false);
        }
    };

    const handleTimeSelect = async (hour: number, minute: number) => {
        setReminderTime({ hour, minute });
        if (notificationsEnabled) {
            await scheduleDailyReminder(hour, minute);
        }
    };

    return (
        <ScreenWrapper scroll>
            {/* Header */}
            <View className="px-6 mb-8" style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={{ color: "white", fontSize: FontSize.xl[0], fontWeight: "700", marginLeft: Spacing.md }}>
                    Settings
                </Text>
            </View>

            <View className="px-6" style={{ paddingBottom: Spacing["4xl"] }}>

                {/* Notifications Section */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: Spacing["2xl"] }}>
                    <Text style={{ color: "white", fontSize: FontSize.lg[0], fontWeight: "600", marginBottom: Spacing.md }}>
                        Daily Reminders
                    </Text>

                    <GlassCard variant="default" style={{ padding: Spacing.lg, marginBottom: Spacing.md }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ flex: 1, marginRight: Spacing.md }}>
                                <Text style={{ color: "white", fontSize: FontSize.base[0], fontWeight: "600", marginBottom: 4 }}>
                                    Enable Reminders
                                </Text>
                                <Text style={{ color: Colors.text.secondary, fontSize: FontSize.sm[0], lineHeight: 18 }}>
                                    Get a gentle push to log your mood or take a quick assessment.
                                </Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={handleToggleNotifications}
                                trackColor={{ false: "rgba(255,255,255,0.1)", true: Colors.success }}
                                thumbColor={"#ffffff"}
                            />
                        </View>
                    </GlassCard>

                    {notificationsEnabled && (
                        <Animated.View entering={FadeInDown.springify()} style={{ marginTop: Spacing.md }}>
                            <Text style={{ color: Colors.text.secondary, fontSize: FontSize.sm[0], marginBottom: Spacing.sm, marginLeft: 4 }}>
                                Select Reminder Time:
                            </Text>
                            <View style={{ gap: Spacing.sm }}>
                                {PRESET_TIMES.map((time, idx) => {
                                    const isSelected = reminderTime?.hour === time.hour && reminderTime?.minute === time.minute;
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            activeOpacity={0.7}
                                            onPress={() => handleTimeSelect(time.hour, time.minute)}
                                        >
                                            <GlassCard
                                                variant={isSelected ? "default" : "outlined"}
                                                style={{
                                                    padding: Spacing.md,
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    borderColor: isSelected ? Colors.accent : "transparent",
                                                    borderWidth: 1
                                                }}
                                            >
                                                <Text style={{ color: isSelected ? "white" : Colors.text.secondary, fontSize: FontSize.base[0] }}>
                                                    {time.label}
                                                </Text>
                                                {isSelected && (
                                                    <Ionicons name="checkmark" size={20} color={Colors.accent} />
                                                )}
                                            </GlassCard>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Privacy & Data */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: Spacing["2xl"] }}>
                    <Text style={{ color: "white", fontSize: FontSize.lg[0], fontWeight: "600", marginBottom: Spacing.md }}>
                        About MindCalm
                    </Text>
                    <GlassCard variant="outlined" style={{ padding: Spacing.lg, gap: Spacing.md }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ color: Colors.text.secondary, fontSize: FontSize.base[0] }}>Privacy Policy</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.dim} />
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ color: Colors.text.secondary, fontSize: FontSize.base[0] }}>Terms of Service</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.dim} />
                        </TouchableOpacity>
                    </GlassCard>
                    <Text style={{ color: Colors.text.dim, fontSize: FontSize.xs[0], textAlign: "center", marginTop: Spacing.lg }}>
                        MindCalm v1.0.0
                    </Text>
                </Animated.View>

            </View>
        </ScreenWrapper>
    );
}
