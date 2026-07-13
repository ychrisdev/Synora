"use client";
import { useHeartbeat } from "@/lib/presence/hooks";

export function PresenceHeartbeat() {
  useHeartbeat();
  return null;
}