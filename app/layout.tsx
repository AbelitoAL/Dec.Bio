import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-sourcesans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Fallback used by routes without their own metadata (e.g. /admin).
// The public site's title is generated dynamically in app/page.tsx from
// the same content the admin panel edits.
export const metadata: Metadata = {
  title: "Sitio profesional",
  description: "Tarjeta profesional digital, editable desde /admin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="font-body min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
