/**
 * Liveblocks + Supabase Integration
 * Save collaborative documents to Supabase for persistence
 */

import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { liveblocks } from "@/lib/liveblocks-server";

export type Document = {
  id: string;
  room_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
};

/**
 * Save document from Liveblocks to Supabase
 */
export async function saveDocumentToSupabase(
  roomId: string,
  userId: string
): Promise<Document | null> {
  try {
    const supabase = await createSupabaseClient();

    // Get room data from Liveblocks
    const room = await liveblocks.getRoom(roomId);

    if (!room) {
      console.error(`Room ${roomId} not found`);
      return null;
    }

    const roomAny = room as any;
    const storage = typeof roomAny.toObject === 'function' ? roomAny.toObject() : (roomAny.metadata || {});

    // Prepare document data
    const documentData = {
      title: storage.title || "",
      content: storage.content || "",
      tags: storage.tags || [],
      created_by: userId,
    };

    // Upsert document in Supabase
    const { data: result, error } = await supabase
      .from("documents")
      .upsert(
        {
          room_id: roomId,
          ...documentData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "room_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving to Supabase:", error);
      return null;
    }

    return result as Document;
  } catch (error) {
    console.error("Error in saveDocumentToSupabase:", error);
    return null;
  }
}

/**
 * Load document from Supabase to Liveblocks
 */
export async function loadDocumentFromSupabase(
  roomId: string
): Promise<{ title: string; content: string; tags: string[] } | null> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("room_id", roomId)
      .single();

    if (error || !data) {
      console.error("Error loading from Supabase:", error);
      return null;
    }

    return {
      title: data.title || "",
      content: data.content || "",
      tags: data.tags || [],
    };
  } catch (error) {
    console.error("Error in loadDocumentFromSupabase:", error);
    return null;
  }
}

/**
 * Delete document from Supabase
 */
export async function deleteDocumentFromSupabase(roomId: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("room_id", roomId);

    if (error) {
      console.error("Error deleting from Supabase:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteDocumentFromSupabase:", error);
    return false;
  }
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string): Promise<Document[]> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("created_by", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return [];
    }

    return (data || []) as Document[];
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    return [];
  }
}

/**
 * Archive document (soft delete)
 */
export async function archiveDocument(roomId: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase
      .from("documents")
      .update({ archived: true })
      .eq("room_id", roomId);

    if (error) {
      console.error("Error archiving document:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in archiveDocument:", error);
    return false;
  }
}

/**
 * Sync Liveblocks activity to Supabase for audit logging
 */
export async function logCollaborativeActivity(
  roomId: string,
  userId: string,
  action: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase.from("activity_logs").insert({
      room_id: roomId,
      user_id: userId,
      action,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error logging activity:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in logCollaborativeActivity:", error);
    return false;
  }
}
