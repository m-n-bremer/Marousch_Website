"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f1]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-[#d8e4dc]">
        <h1 className="text-2xl font-bold text-[#1b4332] mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2d3436] mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2d3436] mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" required />
        </div>
        <label className="flex items-center gap-2 mb-6 text-sm text-[#2d3436] cursor-pointer">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-[#2d6a4f]" />
          Remember me for 30 days
        </label>
        <button type="submit" disabled={loading}
          className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
