"use client";

import { useSyncExternalStore } from "react";
import { chargerRegistre, registreVide, sauvegarderRegistre } from "./storage";
import type { RegistreData } from "./types";

/**
 * Petit store externe adossé au localStorage : `useSyncExternalStore`
 * garantit un rendu serveur stable (registre vide) puis la reprise des
 * données locales après hydratation, sans setState dans un effet.
 */
let cache: RegistreData | null = null;
const abonnes = new Set<() => void>();

const SNAPSHOT_SERVEUR: RegistreData = registreVide();

function lireSnapshot(): RegistreData {
  if (cache === null) cache = chargerRegistre();
  return cache;
}

function lireSnapshotServeur(): RegistreData {
  return SNAPSHOT_SERVEUR;
}

function abonner(rappel: () => void): () => void {
  abonnes.add(rappel);
  return () => {
    abonnes.delete(rappel);
  };
}

/** Applique une mise à jour immuable, persiste et notifie les composants. */
export function mettreAJourRegistre(
  maj: (registre: RegistreData) => RegistreData
): void {
  cache = maj(lireSnapshot());
  sauvegarderRegistre(cache);
  abonnes.forEach((rappel) => rappel());
}

/** Hook de lecture du registre, synchronisé avec le localStorage. */
export function useRegistre(): RegistreData {
  return useSyncExternalStore(abonner, lireSnapshot, lireSnapshotServeur);
}
