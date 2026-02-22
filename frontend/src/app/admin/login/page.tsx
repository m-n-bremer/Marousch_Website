"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e8]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-[#e0d5b8]">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" required />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" required />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-[#b8860b] hover:bg-[#1a1a1a] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
