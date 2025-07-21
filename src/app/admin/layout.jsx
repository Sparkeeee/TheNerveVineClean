var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "../globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/authOptions";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";
import { headers } from "next/headers";
export default function AdminLayout(_a) {
    return __awaiter(this, arguments, void 0, function* ({ children }) {
        // Only protect routes except /admin/login
        const pathname = headers().get("x-invoke-path") || headers().get("x-pathname") || "";
        if (!pathname.includes("/admin/login")) {
            const session = yield getServerSession(authOptions);
            if (!session) {
                redirect("/login");
            }
        }
        return (<SessionProviderWrapper>
      <Header />
      {children}
    </SessionProviderWrapper>);
    });
}
