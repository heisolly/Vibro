import { Liveblocks } from "@liveblocks/node";

const apiKey = process.env.LIVEBLOCKS_SECRET_KEY;

if (!apiKey) {
  console.error("❌ LIVEBLOCKS_SECRET_KEY environment variable is missing!");
}

export const liveblocks = new Liveblocks({
  secret: apiKey || "sk_dev_placeholder",
});
