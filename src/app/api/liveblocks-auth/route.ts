import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  // Get the current user session (you can replace this with your auth)
  const userId = request.headers.get("x-user-id") || "user-" + Math.random();
  const userName = request.headers.get("x-user-name") || "Anonymous User";
  const userAvatar = request.headers.get("x-user-avatar") || "";

  // Authorize the current user
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name: userName,
      avatar: userAvatar,
    },
  });

  // Grant access to specific rooms
  const room = request.nextUrl.searchParams.get("room");
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  } else {
    // Grant access to all rooms with pattern
    session.allow("*", session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
