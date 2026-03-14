import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("vibro_admin_access")?.value === "true";

  if (!hasAccess) {
    redirect("/login");
  }

  return <>{children}</>;
}
