export function WhatsappFloat({ whatsapp }: { whatsapp: string }) {
  const href = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="wa-ring fixed right-5 bottom-5 z-[60] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-[0_12px_32px_rgba(37,211,102,0.5)] transition-transform hover:scale-110 max-md:bottom-[92px]"
    >
      <span aria-hidden>💬</span>
    </a>
  );
}
