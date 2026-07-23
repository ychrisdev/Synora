"use client";

import { useCallback, useEffect, useState } from "react";
import { getCachedValue, setCachedValue, subscribe } from "./syncedSetting";

interface UseSyncedBooleanOptions {
  key: string;
  apiPath: string;
  field: string;
  defaultValue?: boolean;
}

export function useSyncedBoolean({
  key,
  apiPath,
  field,
  defaultValue = true,
}: UseSyncedBooleanOptions) {
  const cached = getCachedValue<boolean>(key);
  const [value, setValue] = useState<boolean>(cached ?? defaultValue);
  const [loading, setLoading] = useState(cached === undefined);

  useEffect(() => {
    const unsubscribe = subscribe<boolean>(key, setValue);

    if (getCachedValue<boolean>(key) === undefined) {
      fetch(apiPath)
        .then((res) => res.json())
        .then((data) => setCachedValue(key, !!data[field]))
        .catch(() => setCachedValue(key, defaultValue))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, [key, apiPath, field, defaultValue]);

  const toggle = useCallback(async () => {
    const next = !(getCachedValue<boolean>(key) ?? defaultValue);
    setCachedValue(key, next);

    try {
      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setCachedValue(key, !next);
      throw new Error("Cập nhật thất bại");
    }
  }, [key, apiPath, field, defaultValue]);

  return { value, loading, toggle };
}

export type FriendRequestPermission =
  | "EVERYONE"
  | "FRIENDS_OF_FRIENDS"
  | "NOBODY";

interface UseSyncedPermissionOptions {
  key: string;
  apiPath: string;
  field: string;
  defaultValue?: FriendRequestPermission;
}

export function useSyncedPermission({
  key,
  apiPath,
  field,
  defaultValue = "EVERYONE",
}: UseSyncedPermissionOptions) {
  const cached = getCachedValue<FriendRequestPermission>(key);
  const [value, setValue] = useState<FriendRequestPermission>(
    cached ?? defaultValue,
  );
  const [loading, setLoading] = useState(cached === undefined);

  useEffect(() => {
    const unsubscribe = subscribe<FriendRequestPermission>(key, setValue);

    if (getCachedValue<FriendRequestPermission>(key) === undefined) {
      fetch(apiPath)
        .then((res) => res.json())
        .then((data) => setCachedValue(key, data[field] ?? defaultValue))
        .catch(() => setCachedValue(key, defaultValue))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, [key, apiPath, field, defaultValue]);

  const update = useCallback(
    async (next: FriendRequestPermission) => {
      const prev = getCachedValue<FriendRequestPermission>(key) ?? defaultValue;
      setCachedValue(key, next);

      try {
        const res = await fetch(apiPath, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: next }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setCachedValue(key, prev);
        throw new Error("Cập nhật thất bại");
      }
    },
    [key, apiPath, field, defaultValue],
  );

  return { value, loading, update };
}
