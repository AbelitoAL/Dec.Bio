"use client";

import type { ReactNode } from "react";

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <details open className="border-line bg-bg-card border p-5">
      <summary className="font-display cursor-pointer list-none text-lg [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      {hint && <p className="text-text-soft mt-1 text-xs">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <p className="text-text-soft mt-2 text-[0.72rem] tracking-wide uppercase">{children}</p>;
}

export function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-text-soft text-[0.7rem] tracking-wide uppercase">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-line bg-bg focus:border-gold-bright mt-1.5 w-full rounded-sm border px-3 py-2 text-sm outline-none"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-text-soft text-[0.7rem] tracking-wide uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="border-line bg-bg focus:border-gold-bright mt-1.5 w-full rounded-sm border px-3 py-2 text-sm outline-none"
      />
    </label>
  );
}

export function RepeatableList<T>({
  items,
  onChange,
  newItem,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: T;
  renderItem: (item: T, onItemChange: (patch: Partial<T>) => void) => ReactNode;
}) {
  function updateItem(index: number, patchValue: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patchValue } : item)));
  }
  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function addItem() {
    onChange([...items, newItem]);
  }
  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border-line bg-bg rounded-sm border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-text-soft text-[0.68rem] tabular-nums">#{i + 1}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => moveItem(i, -1)}
                className="text-text-soft hover:text-gold-bright px-1.5 text-xs"
                aria-label="Subir"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(i, 1)}
                className="text-text-soft hover:text-gold-bright px-1.5 text-xs"
                aria-label="Bajar"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="px-1.5 text-xs text-red-600 dark:text-red-400"
              >
                Eliminar
              </button>
            </div>
          </div>
          {renderItem(item, (patchValue) => updateItem(i, patchValue))}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright rounded-sm border border-dashed px-4 py-2 text-sm"
      >
        + Añadir
      </button>
    </div>
  );
}
