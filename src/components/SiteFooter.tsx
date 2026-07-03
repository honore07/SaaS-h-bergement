import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-brand-900/10 bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-white">GîteOuvert</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-200">
            Le SaaS de mise en conformité des micro-hébergeurs touristiques
            français : Declaloc, fiscalité, registre du logeur, taxe de
            séjour, DPE. Diagnostic gratuit, régularisation guidée,
            conformité continue.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Outils</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/diagnostic" className="hover:text-white">
                Diagnostic de conformité
              </Link>
            </li>
            <li>
              <Link href="/taxe-sejour" className="hover:text-white">
                Calculateur taxe de séjour
              </Link>
            </li>
            <li>
              <Link href="/registre" className="hover:text-white">
                Registre du logeur
              </Link>
            </li>
            <li>
              <Link href="/regulariser" className="hover:text-white">
                Packs Régularisation
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Références</p>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            <li>Loi n°2024-1039 du 19 nov. 2024 (Le Meur)</li>
            <li>Art. R2333-51 CGCT (registre du logeur)</li>
            <li>Directive DAC7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-brand-300 sm:px-6">
          © {new Date().getFullYear()} GîteOuvert. Les informations fournies
          ont un caractère général et ne constituent ni un conseil juridique,
          ni un conseil fiscal personnalisé. Pour une situation complexe,
          rapprochez-vous d&apos;un expert-comptable ou d&apos;un avocat.
        </p>
      </div>
    </footer>
  );
}
