import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Secure storage adapter for Supabase auth tokens
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                return localStorage.getItem(key);
            }
            return null;
        }
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                localStorage.setItem(key, value);
            }
            return;
        }
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                localStorage.removeItem(key);
            }
            return;
        }
        return SecureStore.deleteItemAsync(key);
    },
};

// TODO: Replace with your Supabase project URL and anon key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Important for React Native
    },
});
