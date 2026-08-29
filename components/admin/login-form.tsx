"use client";

import { useState, type FormEvent } from "react";

export function LoginForm({ configured, onSuccess }: { configured: boolean; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        onSuccess();
      } else {
        setError(data.error ?? "No se pudo iniciar sesión.");
      }
    } catch {
      setError("Error de red al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <div className="border-line bg-bg-card max-w-[440px] border p-6">
        <p className="text-text-soft text-sm">
          Este sitio todavía no tiene una contraseña de administrador configurada. Añade{" "}
          <code className="bg-bg-section-alt rounded px-1.5 py-0.5">ADMIN_PASSWORD</code> a{" "}
          <code className="bg-bg-section-alt rounded px-1.5 py-0.5">.env.local</code> (mira{" "}
          <code className="bg-bg-section-alt rounded px-1.5 py-0.5">.env.example</code>) y reinicia el servidor.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-line bg-bg-card max-w-[360px] border p-6">
      <label className="text-text-soft text-[0.72rem] tracking-wide uppercase" htmlFor="password">
        Contraseña de administrador
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        className="border-line bg-bg focus:border-gold-bright mt-2 w-full rounded-sm border px-3 py-2.5 text-sm outline-none"
      />
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="from-gold to-gold-bright text-navy mt-5 w-full rounded-sm bg-linear-to-br px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
