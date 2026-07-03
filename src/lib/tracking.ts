// Tracking léger du funnel diagnostic via window.dataLayer.
// Aucun SDK : GA4 (gtag/GTM) ou Meta Pixel pourront consommer ces événements
// plus tard sans modifier le code appelant.
//
// Règle absolue : JAMAIS de donnée personnelle (email, prénom, adresse)
// dans les propriétés d'événement.

type TrackProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: string, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
}
