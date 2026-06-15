"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const NOTIF_EVENT = "notif:unread-changed";

export function emitUnreadCount(count: number) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIF_EVENT, { detail: { count } }));
  }
}

export function useUnreadNotifCount() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    if (!session?.user?.id) {
      setCount(0);
      return;
    }
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        const total = data.totalUnread ?? 0;
        setCount(total);
      })
      .catch(() => {});
  }, [session?.user?.id]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);

    const handler = (e: Event) => {
      setCount((e as CustomEvent<{ count: number }>).detail.count);
    };
    window.addEventListener(NOTIF_EVENT, handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIF_EVENT, handler);
    };
  }, [refresh]);

  return { count, refresh };
}
