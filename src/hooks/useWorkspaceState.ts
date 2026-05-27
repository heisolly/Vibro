"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

type RealtimePayload = {
  new: { state_data: any } | null;
};

export function useWorkspaceState<T>(
  workspaceSlug: string,
  boardType: string,
  defaultValue: T
) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<T | null>(null);
  const remoteUpdateRef = useRef(false);
  const hasLocalEditsRef = useRef(false);

  useEffect(() => {
    if (!workspaceSlug) return;

    const supabase = createClient();

    async function load() {
      const { data: row, error } = await supabase
        .from("workspace_states")
        .select("state_data")
        .eq("workspace_slug", workspaceSlug)
        .eq("board_type", boardType)
        .maybeSingle();

      if (error) {
        console.warn(`[useWorkspaceState] Load failed for ${workspaceSlug}/${boardType}: ${error.message}`);
      } else if (row?.state_data && !hasLocalEditsRef.current) {
        setData(row.state_data as T);
      }
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel(`workspace-state:${workspaceSlug}:${boardType}`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "workspace_states",
          filter: `workspace_slug=eq.${workspaceSlug}`,
        },
        (payload: RealtimePayload) => {
          if (payload.new && payload.new.state_data) {
            remoteUpdateRef.current = true;
            setData(payload.new.state_data as T);
            setTimeout(() => { remoteUpdateRef.current = false; }, 100);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn(`[useWorkspaceState] Realtime ${status} — live sync unavailable`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [workspaceSlug, boardType]);

  const update = useCallback(
    (newData: T | ((prev: T) => T)) => {
      hasLocalEditsRef.current = true;
      setData((prev) => {
        const resolved = typeof newData === "function" ? (newData as (prev: T) => T)(prev) : newData;
        pendingRef.current = resolved;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          if (remoteUpdateRef.current) return;
          const supabase = createClient();
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError) {
            console.warn(`[useWorkspaceState] Auth check failed: ${authError.message}`);
          }

          const { error } = await supabase.from("workspace_states").upsert(
            {
              workspace_slug: workspaceSlug,
              board_type: boardType,
              state_data: pendingRef.current,
              updated_by: user?.id ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "workspace_slug,board_type" }
          );
          if (error) {
            console.error(`[useWorkspaceState] Save failed: ${error.message}`, error.details);
          }
        }, 400);

        return resolved;
      });
    },
    [workspaceSlug, boardType]
  );

  return { data, update, loading } as const;
}
