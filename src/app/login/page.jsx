"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError("");
        const res = yield signIn("credentials", {
            redirect: false,
            username,
            password,
        });
        if (res === null || res === void 0 ? void 0 : res.ok) {
            router.push("/admin");
        }
        else {
            setError("Invalid username or password");
        }
    });
    return (<div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600" required/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600" required/>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition-colors duration-200">
          Login
        </button>
      </form>
    </div>);
}
