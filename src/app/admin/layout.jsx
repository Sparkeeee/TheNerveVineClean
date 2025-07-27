import "../globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/authOptions";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { headers } from "next/headers";
export default async function AdminLayout({ children }) {
    // Only protect routes except /admin/login
    const h = await headers();
    const pathname = h.get("x-invoke-path") || h.get("x-pathname") || "";
    if (!pathname.includes("/admin/login")) {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect("/login");
        }
    }
    return (<SessionProviderWrapper>
      {children}
    </SessionProviderWrapper>);
}
