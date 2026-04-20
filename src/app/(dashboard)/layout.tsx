import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shell } from "@/components/layout/shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  return <Shell user={user}>{children}</Shell>;
}
