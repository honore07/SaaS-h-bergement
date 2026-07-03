"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LIMITE_SEJOURS_GRATUITS } from "@/lib/registre/types";

export function UpsellCard() {
  return (
    <Card className="border-accent-300 bg-accent-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="amber" className="mb-3">
            Limite gratuite atteinte
          </Badge>
          <h2 className="text-lg font-semibold text-brand-950">
            Vous avez consigné vos {LIMITE_SEJOURS_GRATUITS} séjours gratuits
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            Passez à l&apos;abonnement Conformité (29 €/mois) pour un registre
            illimité, l&apos;import CSV Airbnb/Booking et les alertes de
            conformité. Vos séjours déjà consignés restent bien sûr accessibles
            et exportables en PDF.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-foreground/70">
            <li>— Registre du logeur illimité, conservé d&apos;année en année</li>
            <li>— Import automatique de vos réservations Airbnb et Booking</li>
            <li>— Alertes avant chaque échéance de reversement de la taxe</li>
          </ul>
        </div>
        <Link
          href="/regulariser"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
        >
          Passer à l&apos;abonnement Conformité
        </Link>
      </div>
    </Card>
  );
}
