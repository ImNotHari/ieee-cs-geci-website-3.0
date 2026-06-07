/**
 * useRealtimeEvents — Subscribes to Supabase realtime channel for event changes.
 * Automatically invalidates React Query cache when events are inserted, updated, or deleted.
 * Falls back gracefully in demo mode (no Supabase connection).
 */

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";

export function useRealtimeEvents(memberId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase || !memberId) return;

    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          // Invalidate all event-related queries so UI updates automatically
          queryClient.invalidateQueries({ queryKey: ["memberEvents", memberId] });
          queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
          queryClient.invalidateQueries({ queryKey: ["publishedEvents"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memberId, queryClient]);
}
