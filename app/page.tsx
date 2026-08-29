import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { ReadingProgress } from "@/components/reading-progress";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { MobileAppBar } from "@/components/mobile-app-bar";
import { Hero } from "@/components/sections/hero";
import { Perfil } from "@/components/sections/perfil";
import { Trayectoria } from "@/components/sections/trayectoria";
import { Servicios } from "@/components/sections/servicios";
import { Faq } from "@/components/sections/faq";
import { Contacto } from "@/components/sections/contacto";
import { Footer } from "@/components/sections/footer";

// Re-reads content/site-content.json on every request so edits made from
// /admin show up immediately without a rebuild.
export const dynamic = "force-dynamic";

// Browser tab title / SEO metadata — pulled from `meta` in the admin-edited
// content. Deliberately separate from `brand` (the on-page name/role): the
// tab text and the printed page don't have to say the exact same thing.
export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="pb-16 md:pb-0">
      <SiteHeader initials={content.brand.initials} name={content.brand.name} role={content.brand.role} />
      <ReadingProgress />
      <main>
        <Hero hero={content.hero} initials={content.brand.initials} />
        <Perfil perfil={content.perfil} />
        <Trayectoria items={content.trayectoria} />
        <Servicios items={content.servicios} />
        <Faq items={content.faq} />
        <Contacto contacto={content.contacto} />
      </main>
      <Footer footer={content.footer} name={content.brand.name} social={content.contacto.social} />
      <WhatsappFloat whatsapp={content.contacto.whatsapp} />
      <MobileAppBar whatsapp={content.contacto.whatsapp} phone={content.contacto.whatsapp} />
    </div>
  );
}
