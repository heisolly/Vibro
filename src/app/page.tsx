import { getAllCategories, getFeaturedPrompts } from "@/lib/queries";
import HomeClient from "./HomeClient";
import GrainBackground from "@/components/GrainBackground";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const categories = await getAllCategories();
  const featured = await getFeaturedPrompts();

  return (
    <>
      <GrainBackground />
      <HomeClient categories={categories} featured={featured} />
    </>
  );
}

