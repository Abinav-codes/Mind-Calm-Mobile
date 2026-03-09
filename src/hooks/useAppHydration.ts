// ─────────────────────────────────────────────────────────────
// useAppHydration — Syncs Zustand store with Supabase on mount
// ─────────────────────────────────────────────────────────────
// Call this once at the root level (in _layout.tsx) to:
// 1. Fetch user data when auth state changes
// 2. Reset store on sign out
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../stores/appStore";

export function useAppHydration() {
    const { user } = useAuth();
    const fetchUserData = useAppStore((s) => s.fetchUserData);
    const reset = useAppStore((s) => s.reset);
    const prevUserId = useRef<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            // Only refetch if user changed (not on every render)
            if (prevUserId.current !== user.id) {
                prevUserId.current = user.id;
                fetchUserData(user.id);
            }
        } else if (prevUserId.current) {
            // User signed out — clear data
            prevUserId.current = null;
            reset();
        }
    }, [user?.id, fetchUserData, reset]);
}
