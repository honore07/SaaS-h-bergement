// Endpoint DEV UNIQUEMENT : réception des créas générées (GPT Image via
// navigateur) et écriture dans marketing/creatives/. Renvoie 404 en production.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-filename",
  // Requis par Chrome pour les requêtes HTTPS → localhost (Private Network Access)
  "Access-Control-Allow-Private-Network": "true",
};

function devOnly(): Response | null {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }
  return null;
}

export async function OPTIONS() {
  return devOnly() ?? new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  const name = request.headers.get("x-filename") ?? "";
  // Nom de fichier strictement contrôlé : pas de traversée de chemin.
  if (!/^[a-z0-9-]+\.png$/.test(name)) {
    return Response.json(
      { error: "x-filename invalide (attendu: [a-z0-9-]+.png)" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.length < 10_000 || bytes.length > 20_000_000) {
    return Response.json(
      { error: "taille de fichier hors limites" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const dir = path.join(process.cwd(), "marketing", "creatives");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);

  return Response.json(
    { ok: true, name, sizeKo: Math.round(bytes.length / 1024) },
    { headers: CORS_HEADERS }
  );
}
