"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  HEARTBEAT_INTERVAL_MS,
  PRESENCE_POLL_INTERVAL_MS,
} from "./constants";

export function useHeartbeat() {
  const { status } = useSession();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const sendHeartbeat = () => {
      fetch("/api/presence/heartbeat", { method: "POST" }).catch(() => {});
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") sendHeartbeat();
    };

    sendHeartbeat();
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", sendHeartbeat);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", sendHeartbeat);
    };
  }, [status]);
}

export function useUserPresence(userId: string | null | undefined) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastActiveAt, setLastActiveAt] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      setLastActiveAt(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/presence/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setIsOnline(!!data.isOnline);
        setLastActiveAt(data.lastActiveAt ?? null);
      } catch {}
    };

    load();
    const interval = setInterval(load, PRESENCE_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  return { isOnline, lastActiveAt };
}