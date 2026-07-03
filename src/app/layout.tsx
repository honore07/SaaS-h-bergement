import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default:
      "GîteOuvert — Vérifiez la conformité de votre meublé de tourisme",
    template: "%s | GîteOuvert",
  },
  description:
    "Diagnostic de conformité gratuit en 3 minutes pour gîtes, chambres d'hôtes et hébergements insolites : Declaloc, fiscalité, registre du logeur, taxe de séjour, DPE. Régularisez avant que ça vous coûte cher.",
  keywords: [
    "declaloc",
    "meublé de tourisme",
    "conformité gîte",
    "taxe de séjour",
    "registre du logeur",
    "loi Le Meur",
    "micro-BIC 2025",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
