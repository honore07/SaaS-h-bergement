import Link from "next/link";

const nav = [
  { href: "/diagnostic", label: "Diagnostic gratuit" },
  { href: "/regulariser", label: "Régulariser" },
  { href: "/taxe-sejour", label: "Taxe de séjour" },
  { href: "/registre", label: "Registre du logeur" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-900/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white"
          >
            G
          </span>
          <span className="text-lg font-semibold tracking-tight text-brand-950">
            GîteOuvert
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/diagnostic"
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
        >
          Vérifier ma conformité
        </Link>
      </div>
    </header>
  );
}
