export type VibroUser = {
  id: string;
  email: string;
  name: string;
};

export type VibroProject = {
  id: string;
  name: string;
  slug: string;
  region: string;
  description: string;
  createdAt: string;
};

export type VibroBoard = "home" | "design" | "architecture" | "inspiration" | "bundle" | "handoff";

export const demoUser: VibroUser = {
  id: "demo-user",
  email: "michaeloluwyanmi@gmail.com",
  name: "Micheal Oluwayanmi",
};

export const userStorageKey = "vibro-user";

export function projectStorageKey(userId: string) {
  return `vibro-projects:${userId}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
