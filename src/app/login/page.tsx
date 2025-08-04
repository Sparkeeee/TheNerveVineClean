"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegistering) {
      // Handle registration
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();

        if (res.ok) {
          setSuccess("Registration successful! You can now login.");
          setIsRegistering(false);
          setEmail("");
          setPassword("");
          setName("");
        } else {
          setError(data.error || "Registration failed");
        }
      } catch (error) {
        setError("Registration failed");
      }
    } else {
      // Handle login
      const credentials = isAdminLogin 
        ? { username, password }
        : { email, password };

      const res = await signIn("credentials", {
        redirect: false,
        ...credentials,
      });

      if (res?.ok) {
        // Redirect based on role
        window.location.href = isAdminLogin ? "/admin" : "/";
      } else {
        setError("Invalid credentials");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6">
        {isRegistering ? "Create Account" : isAdminLogin ? "Admin Login" : "Login"}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        )}
        
        {!isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              {isAdminLogin ? "Username" : "Email"}
            </label>
            <input
              type={isAdminLogin ? "text" : "email"}
              value={isAdminLogin ? username : email}
              onChange={(e) => isAdminLogin ? setUsername(e.target.value) : setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
        )}

        {isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-600 pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12C3.5 7 8 4 12 4s8.5 3 10.5 8c-2 5-6.5 8-10.5 8S3.5 17 1.5 12z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.73 10.73A3 3 0 0115 12c0 1.657-1.343 3-3 3a3 3 0 01-2.27-5.27M6.1 6.1C4.07 7.98 2.5 10.36 2.5 12c2 5 6.5 8 10.5 8 2.04 0 4.09-.5 6.1-1.9M17.9 17.9C19.93 16.02 21.5 13.64 21.5 12c-2-5-6.5-8-10.5-8-2.04 0-4.09.5-6.1 1.9" /></svg>
              )}
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition-colors duration-200 mb-4"
        >
          {isRegistering ? "Create Account" : isAdminLogin ? "Admin Login" : "Login"}
        </button>
        
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setIsAdminLogin(false);
              setError("");
              setSuccess("");
            }}
            className="w-full text-green-700 hover:text-green-800 transition-colors duration-200"
          >
            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
          </button>
          
          {!isRegistering && (
            <button
              type="button"
              onClick={() => {
                setIsAdminLogin(!isAdminLogin);
                setError("");
                setSuccess("");
              }}
              className="w-full text-blue-700 hover:text-blue-800 transition-colors duration-200"
            >
              {isAdminLogin ? "User Login" : "Admin Login"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 