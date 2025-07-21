import "../globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Only protect routes except /admin/login
  const pathname = headers().get("x-invoke-path") || headers().get("x-pathname") || "";
  if (!pathname.includes("/admin/login")) {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }
  }
  return (
    <SessionProviderWrapper>
      <Header />
      {children}
    </SessionProviderWrapper>
  );
} 