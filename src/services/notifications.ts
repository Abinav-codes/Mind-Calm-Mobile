import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Configure how notifications look when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
        console.warn("Must use physical device for Push Notifications");
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        return false;
    }

    return true;
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    // First cancel any existing reminders to avoid duplicates
    await cancelAllReminders();

    // Schedule the new reminder
    const trigger: any = {
        hour,
        minute,
        repeats: true,
    };

    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "MindCalm Check-in 🌿",
                body: "Take a beautiful moment to focus on your well-being today.",
                sound: true,
            },
            trigger,
        });
        return id;
    } catch (e) {
        console.error("Failed to schedule notification:", e);
        return null;
    }
}

export async function cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledReminders() {
    return await Notifications.getAllScheduledNotificationsAsync();
}
