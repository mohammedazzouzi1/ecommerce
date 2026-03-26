"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Azzouzi2024!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Login failed"
        );
        return;
      }

      window.location.href = "/dashboard-azzouzi-secure";
    } catch {
      setError("Request timeout or network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login-shell">
        <div className="container">
          <div className="header">
            <div className="logo">🔒</div>
            <h1>Azzouzi Jewelry</h1>
            <p className="subtitle">Administration</p>
          </div>

          <div className="card">
            <h2>Secure Login</h2>

            {error ? <div className="error show">{error}</div> : null}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Azzouzi2024!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button id="loginBtn" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign In"}
              </button>
            </form>

            <div className="back-link">
              <Link href="/">← Back to Website</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-shell {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          width: 100%;
          max-width: 400px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #b8941f);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 24px;
        }
        h1 {
          color: white;
          margin: 0;
          font-size: 28px;
        }
        .subtitle {
          color: #d4af37;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        h2 {
          color: white;
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
        }
        .error {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #fca5a5;
          text-align: center;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          color: #d1d5db;
          font-size: 14px;
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
        }
        input:focus {
          outline: none;
          border-color: #d4af37;
        }
        button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #d4af37, #b8941f);
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 5px;
        }
        button:hover {
          opacity: 0.9;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .back-link {
          text-align: center;
          margin-top: 20px;
        }
        .back-link :global(a) {
          color: #9ca3af;
          font-size: 14px;
          text-decoration: none;
        }
        .back-link :global(a:hover) {
          color: #d4af37;
        }
      `}</style>
    </>
  );
}
