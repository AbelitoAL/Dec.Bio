"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { SiteContent } from "@/lib/content";
import { Field, RepeatableList, Section, SubHeading, TextAreaField } from "./fields";

type SaveState = "idle" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "error";

export function EditorForm({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [photoState, setPhotoState] = useState<UploadState>("idle");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [cvState, setCvState] = useState<UploadState>("idle");
  const [cvError, setCvError] = useState<string | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  function patch<K extends keyof SiteContent>(key: K, value: Partial<SiteContent[K]>) {
    setContent((prev) => ({ ...prev, [key]: { ...(prev[key] as object), ...value } }));
  }

  async function handleSave() {
    setSaveState("saving");
    setSaveMessage(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveState("saved");
        setSaveMessage("Cambios guardados.");
      } else {
        setSaveState("error");
        setSaveMessage(data.error ?? "No se pudo guardar.");
      }
    } catch {
      setSaveState("error");
      setSaveMessage("Error de red al guardar.");
    }
    setTimeout(() => setSaveState("idle"), 5000);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setContent(parsed);
        setSaveMessage("JSON importado. Revisa los campos y pulsa “Guardar cambios” para aplicarlo.");
        setSaveState("idle");
      } catch {
        setSaveMessage("El archivo no es JSON válido.");
        setSaveState("error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleReset() {
    setContent(initialContent);
    setSaveMessage("Cambios sin guardar descartados.");
    setSaveState("idle");
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoState("uploading");
    setPhotoError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", "photo");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.ok) {
        patch("hero", { photoUrl: data.url });
        setPhotoState("idle");
      } else {
        setPhotoError(data.error ?? "No se pudo subir la foto.");
        setPhotoState("error");
      }
    } catch {
      setPhotoError("Error de red al subir la foto.");
      setPhotoState("error");
    }
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function handleCvUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvState("uploading");
    setCvError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", "cv");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.ok) {
        patch("hero", { cvUrl: data.url });
        setCvState("idle");
      } else {
        setCvError(data.error ?? "No se pudo subir el PDF.");
        setCvState("error");
      }
    } catch {
      setCvError("Error de red al subir el PDF.");
      setCvState("error");
    }
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  return (
    <div className="space-y-6 pb-28">
      <Section
        title="Pestaña del navegador / SEO"
        hint="Título y descripción que se ven en la pestaña del navegador y en resultados de Google. Independiente de lo que se imprime en la página."
      >
        <Field label="Título de la pestaña" value={content.meta.title} onChange={(v) => patch("meta", { title: v })} />
        <TextAreaField
          label="Descripción (SEO)"
          value={content.meta.description}
          onChange={(v) => patch("meta", { description: v })}
        />
      </Section>

      <Section title="Marca" hint="Iniciales, nombre y cargo que aparecen en el encabezado del sitio.">
        <Field label="Iniciales" value={content.brand.initials} onChange={(v) => patch("brand", { initials: v })} />
        <Field label="Nombre" value={content.brand.name} onChange={(v) => patch("brand", { name: v })} />
        <Field label="Cargo" value={content.brand.role} onChange={(v) => patch("brand", { role: v })} />
      </Section>

      <Section title="Hero" hint="La franja principal, arriba del todo.">
        <Field label="Texto superior (eyebrow)" value={content.hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
        <Field label="Nombre" value={content.hero.name} onChange={(v) => patch("hero", { name: v })} />
        <Field label="Cargo / título" value={content.hero.role} onChange={(v) => patch("hero", { role: v })} />
        <TextAreaField label="Frase (tagline)" value={content.hero.tagline} onChange={(v) => patch("hero", { tagline: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Texto botón principal"
            value={content.hero.ctaPrimaryLabel}
            onChange={(v) => patch("hero", { ctaPrimaryLabel: v })}
          />
          <Field
            label="Texto botón secundario"
            value={content.hero.ctaSecondaryLabel}
            onChange={(v) => patch("hero", { ctaSecondaryLabel: v })}
          />
        </div>
        <Field
          label="Nota del espacio para foto"
          value={content.hero.photoNote}
          onChange={(v) => patch("hero", { photoNote: v })}
        />

        <SubHeading>Fotografía</SubHeading>
        <div className="flex items-start gap-4">
          <div
            className="border-line bg-bg-section-alt aspect-[4/5] w-24 flex-none overflow-hidden rounded-sm border bg-cover bg-center"
            style={content.hero.photoUrl ? { backgroundImage: `url(${content.hero.photoUrl})` } : undefined}
            aria-hidden
          />
          <div className="flex-1 space-y-3">
            <Field
              label="URL de la foto (subida o enlace externo)"
              value={content.hero.photoUrl}
              onChange={(v) => patch("hero", { photoUrl: v })}
            />
            <div className="flex flex-wrap items-center gap-3">
              <label className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright cursor-pointer rounded-sm border px-4 py-2 text-sm">
                {photoState === "uploading" ? "Subiendo…" : "Subir foto desde tu computadora"}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoUpload}
                  disabled={photoState === "uploading"}
                  className="hidden"
                />
              </label>
              {content.hero.photoUrl && (
                <button
                  type="button"
                  onClick={() => patch("hero", { photoUrl: "" })}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  Quitar foto
                </button>
              )}
            </div>
            {photoState === "error" && photoError && (
              <p className="text-sm text-red-600 dark:text-red-400">{photoError}</p>
            )}
            <p className="text-text-soft text-xs">
              JPG, PNG, WEBP o GIF, máx. 8MB. Mientras no haya foto se muestra el monograma de marcador de posición.
            </p>
          </div>
        </div>

        <SubHeading>Currículum (PDF)</SubHeading>
        <div className="space-y-3">
          <Field
            label="URL del CV (subido o enlace externo)"
            value={content.hero.cvUrl}
            onChange={(v) => patch("hero", { cvUrl: v })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <label className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright cursor-pointer rounded-sm border px-4 py-2 text-sm">
              {cvState === "uploading" ? "Subiendo…" : "Subir PDF desde tu computadora"}
              <input
                ref={cvInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleCvUpload}
                disabled={cvState === "uploading"}
                className="hidden"
              />
            </label>
            {content.hero.cvUrl && (
              <>
                <a
                  href={content.hero.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-bright text-sm no-underline"
                >
                  Ver PDF actual ↗
                </a>
                <button
                  type="button"
                  onClick={() => patch("hero", { cvUrl: "" })}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  Quitar CV
                </button>
              </>
            )}
          </div>
          {cvState === "error" && cvError && <p className="text-sm text-red-600 dark:text-red-400">{cvError}</p>}
          <p className="text-text-soft text-xs">
            Solo PDF, máx. 15MB. Sin CV cargado, el botón &quot;{content.hero.ctaSecondaryLabel}&quot; se oculta en el sitio.
          </p>
        </div>

        <SubHeading>Estadísticas</SubHeading>
        <RepeatableList
          items={content.hero.stats}
          onChange={(stats) => patch("hero", { stats })}
          newItem={{ value: "[valor]", label: "[etiqueta]" }}
          renderItem={(item, onItemChange) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valor" value={item.value} onChange={(v) => onItemChange({ value: v })} />
              <Field label="Etiqueta" value={item.label} onChange={(v) => onItemChange({ label: v })} />
            </div>
          )}
        />
      </Section>

      <Section title="Perfil" hint="Sección 01 del sitio.">
        <TextAreaField label="Frase de apertura" value={content.perfil.lede} onChange={(v) => patch("perfil", { lede: v })} />
        <SubHeading>Párrafos</SubHeading>
        <RepeatableList
          items={content.perfil.paragraphs.map((text) => ({ text }))}
          onChange={(items) => patch("perfil", { paragraphs: items.map((i) => i.text) })}
          newItem={{ text: "[Nuevo párrafo]" }}
          renderItem={(item, onItemChange) => (
            <TextAreaField label="Texto" value={item.text} onChange={(v) => onItemChange({ text: v })} />
          )}
        />

        <SubHeading>Insignias (especialidades destacadas)</SubHeading>
        <RepeatableList
          items={content.perfil.badges.map((text) => ({ text }))}
          onChange={(items) => patch("perfil", { badges: items.map((i) => i.text) })}
          newItem={{ text: "[Especialidad]" }}
          renderItem={(item, onItemChange) => (
            <Field label="Texto" value={item.text} onChange={(v) => onItemChange({ text: v })} />
          )}
        />
      </Section>

      <Section title="Trayectoria" hint="Sección 02 — estudios, certificaciones, cargos.">
        <RepeatableList
          items={content.trayectoria}
          onChange={(trayectoria) => setContent((prev) => ({ ...prev, trayectoria }))}
          newItem={{ year: "[AAAA]", title: "[Título]", place: "[Institución]", tag: "[Ciudad, país]" }}
          renderItem={(item, onItemChange) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Año" value={item.year} onChange={(v) => onItemChange({ year: v })} />
              <Field label="Etiqueta" value={item.tag} onChange={(v) => onItemChange({ tag: v })} />
              <Field
                label="Título"
                value={item.title}
                onChange={(v) => onItemChange({ title: v })}
                className="col-span-2"
              />
              <Field
                label="Institución / organización"
                value={item.place}
                onChange={(v) => onItemChange({ place: v })}
                className="col-span-2"
              />
            </div>
          )}
        />
      </Section>

      <Section title="Servicios" hint="Sección 03 — cuadrícula de áreas de servicio.">
        <RepeatableList
          items={content.servicios}
          onChange={(servicios) => setContent((prev) => ({ ...prev, servicios }))}
          newItem={{ icon: "⚖", title: "[Área de servicio]", description: "[Descripción breve]", bullets: ["[Detalle]"] }}
          renderItem={(item, onItemChange) => (
            <>
              <div className="grid grid-cols-[5rem_1fr] gap-3">
                <Field label="Ícono" value={item.icon} onChange={(v) => onItemChange({ icon: v })} />
                <Field label="Título" value={item.title} onChange={(v) => onItemChange({ title: v })} />
              </div>
              <TextAreaField
                label="Descripción"
                value={item.description}
                onChange={(v) => onItemChange({ description: v })}
              />
              <SubHeading>Detalles (viñetas)</SubHeading>
              <RepeatableList
                items={item.bullets.map((text) => ({ text }))}
                onChange={(bullets) => onItemChange({ bullets: bullets.map((b) => b.text) })}
                newItem={{ text: "[Detalle]" }}
                renderItem={(bullet, onBulletChange) => (
                  <Field label="Texto" value={bullet.text} onChange={(v) => onBulletChange({ text: v })} />
                )}
              />
            </>
          )}
        />
      </Section>

      <Section title="Preguntas frecuentes" hint="Sección 04.">
        <RepeatableList
          items={content.faq}
          onChange={(faq) => setContent((prev) => ({ ...prev, faq }))}
          newItem={{ question: "[¿Pregunta?]", answer: "[Respuesta]" }}
          renderItem={(item, onItemChange) => (
            <>
              <Field label="Pregunta" value={item.question} onChange={(v) => onItemChange({ question: v })} />
              <TextAreaField label="Respuesta" value={item.answer} onChange={(v) => onItemChange({ answer: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Contacto" hint="Sección 05.">
        <div className="grid grid-cols-2 gap-3">
          <Field label="WhatsApp" value={content.contacto.whatsapp} onChange={(v) => patch("contacto", { whatsapp: v })} />
          <Field label="Correo" value={content.contacto.email} onChange={(v) => patch("contacto", { email: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ubicación" value={content.contacto.location} onChange={(v) => patch("contacto", { location: v })} />
          <Field label="Texto del botón" value={content.contacto.ctaLabel} onChange={(v) => patch("contacto", { ctaLabel: v })} />
        </div>

        <SubHeading>Redes sociales</SubHeading>
        <RepeatableList
          items={content.contacto.social}
          onChange={(social) => patch("contacto", { social })}
          newItem={{ label: "[Red]", url: "" }}
          renderItem={(item, onItemChange) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" value={item.label} onChange={(v) => onItemChange({ label: v })} />
              <Field label="URL" value={item.url} onChange={(v) => onItemChange({ url: v })} />
            </div>
          )}
        />
      </Section>

      <Section title="Pie de página" hint="Línea final del sitio.">
        <Field label="Nota" value={content.footer.note} onChange={(v) => patch("footer", { note: v })} />
      </Section>

      <div className="bg-bg border-line fixed inset-x-0 bottom-0 border-t px-6 py-4">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            type="button"
            disabled={saveState === "saving"}
            className="from-gold to-gold-bright text-navy rounded-sm bg-linear-to-br px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {saveState === "saving" ? "Guardando…" : "Guardar cambios"}
          </button>
          <button
            onClick={handleExport}
            type="button"
            className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright rounded-sm border px-4 py-2.5 text-sm"
          >
            Exportar JSON
          </button>
          <label className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright cursor-pointer rounded-sm border px-4 py-2.5 text-sm">
            Importar JSON
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={handleReset} type="button" className="text-text-soft hover:text-gold-bright text-sm">
            Descartar cambios
          </button>
          {saveMessage && (
            <span className={`text-sm ${saveState === "error" ? "text-red-600 dark:text-red-400" : "text-text-soft"}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
