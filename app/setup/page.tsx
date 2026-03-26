"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    credentials?: { username: string; password: string };
    error?: string;
  } | null>(null);

  async function handleSetup() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to setup admin" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Initial Setup</h1>
          <p className="text-gray-400">Create the default admin account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          {!result ? (
            <>
              <p className="text-gray-300 mb-6 text-center">
                Click the button below to create the admin account with default credentials:
              </p>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-[#d4af37] font-mono text-sm">Username: admin</p>
                <p className="text-[#d4af37] font-mono text-sm">Password: Azzouzi2024!</p>
              </div>
              <button
                onClick={handleSetup}
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white font-semibold hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all disabled:opacity-50"
              >
                {loading ? "Creating Admin..." : "Create Admin Account"}
              </button>
            </>
          ) : result.success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Admin Created!</h2>
              <p className="text-gray-400 mb-4">{result.message}</p>
              <div className="bg-white/10 rounded-lg p-4 mb-6 text-left">
                <p className="text-gray-300 text-sm mb-1">Username:</p>
                <p className="text-[#d4af37] font-mono mb-3">{result.credentials?.username}</p>
                <p className="text-gray-300 text-sm mb-1">Password:</p>
                <p className="text-[#d4af37] font-mono">{result.credentials?.password}</p>
              </div>
              <button
                onClick={() => router.push("/dashboard-azzouzi-secure/login")}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white font-semibold hover:shadow-lg transition-all"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Setup Failed</h2>
              <p className="text-red-400 mb-4">{result.error}</p>
              <button
                onClick={() => setResult(null)}
                className="w-full py-3 px-4 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
