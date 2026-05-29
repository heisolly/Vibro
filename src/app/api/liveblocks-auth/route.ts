import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const room = request.nextUrl.searchParams.get("room");
  if (!room) {
    return new Response("Missing room", { status: 400 });
  }

  const allowedPrefix = `user-${user.id}-`;
  const isWorkspaceRoom = room.startsWith("workspace:");
  if (!room.startsWith(allowedPrefix) && !isWorkspaceRoom) {
    return new Response("Forbidden", { status: 403 });
  }

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Vibro user";
  const userAvatar = user.user_metadata?.avatar_url || "";

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: userName,
      avatar: userAvatar,
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
