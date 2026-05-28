import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth/session";
import BottomNavBar from "@/components/nav/BottomNavBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("haven_session")?.value;

  if (!token) redirect("/login");

  const session = await verifySessionToken(token);
  if (!session) redirect("/login");

  return (
    <>
      {children}
      <BottomNavBar />
    </>
  );
}
