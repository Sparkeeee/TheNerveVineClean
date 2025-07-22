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
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const router = useRouter();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError("");
        const res = yield signIn("credentials", {
            redirect: false,
            username,
            password,
        });
        if (res === null || res === void 0 ? void 0 : res.ok) {
            window.location.href = "/admin";
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
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600 pr-10" required/>
            <button type="button" tabIndex={-1} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 focus:outline-none" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
        // Open eye icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12C3.5 7 8 4 12 4s8.5 3 10.5 8c-2 5-6.5 8-10.5 8S3.5 17 1.5 12z"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none"/></svg>) : (
        // Closed eye (eye with slash) icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.73 10.73A3 3 0 0115 12c0 1.657-1.343 3-3 3a3 3 0 01-2.27-5.27M6.1 6.1C4.07 7.98 2.5 10.36 2.5 12c2 5 6.5 8 10.5 8 2.04 0 4.09-.5 6.1-1.9M17.9 17.9C19.93 16.02 21.5 13.64 21.5 12c-2-5-6.5-8-10.5-8-2.04 0-4.09.5-6.1 1.9"/></svg>)}
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition-colors duration-200">
          Login
        </button>
      </form>
    </div>);
}
