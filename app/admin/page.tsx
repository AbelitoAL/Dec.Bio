"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { LoginForm } from "@/components/admin/login-form";
import { EditorForm } from "@/components/admin/editor-form";

type AuthState = "checking" | "in" | "out";

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [configured, setConfigured] = useState(true);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured));
        setAuth(data.authed ? "in" : "out");
      })
      .catch(() => setAuth("out"));
  }, []);

  useEffect(() => {
    if (auth !== "in") return;
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setContent(data.content);
        else setLoadError(data.error ?? "No se pudo cargar el contenido.");
      })
      .catch(() => setLoadError("No se pudo cargar el contenido."));
  }, [auth]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth("out");
    setContent(null);
  }

  return (
    <div className="bg-bg text-text min-h-screen">
      <header className="border-line mx-auto flex max-w-[900px] items-center justify-between border-b px-6 py-5">
        <div>
          <p className="text-gold-bright font-body text-[0.68rem] font-semibold tracking-[0.16em] uppercase">Panel</p>
          <h1 className="font-display text-xl">Editar sitio</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-text-soft hover:text-gold-bright text-sm no-underline"
          >
            Ver sitio ↗
          </a>
          {auth === "in" && (
            <button
              onClick={handleLogout}
              type="button"
              className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright rounded-sm border px-3 py-1.5 text-sm"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-10">
        {auth === "checking" && <p className="text-text-soft">Verificando sesión…</p>}

        {auth === "out" && <LoginForm configured={configured} onSuccess={() => setAuth("in")} />}

        {auth === "in" &&
          (loadError ? (
            <p className="text-red-600 dark:text-red-400">{loadError}</p>
          ) : content ? (
            <EditorForm initialContent={content} />
          ) : (
            <p className="text-text-soft">Cargando contenido…</p>
          ))}
      </main>
    </div>
  );
}
