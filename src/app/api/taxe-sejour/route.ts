import { type NextRequest } from "next/server";
import { getDeliberationsTaxeSejour } from "@/lib/api/delta";

// Code INSEE : 5 caractères — « 68066 », « 75056 », « 2A258 » (Corse), « 97214 » (outre-mer).
const CODE_INSEE_REGEX = /^[0-9][0-9AB][0-9]{3}$/;

/**
 * GET /api/taxe-sejour?commune={code_insee}
 * → { commune, codeInsee, taux: TauxTaxeSejour[] }
 */
export async function GET(request: NextRequest) {
  const brut = request.nextUrl.searchParams.get("commune");
  const codeInsee = (brut ?? "").trim().toUpperCase();

  if (!CODE_INSEE_REGEX.test(codeInsee)) {
    return Response.json(
      {
        error:
          "Paramètre « commune » invalide : un code INSEE de 5 caractères est attendu (ex. 68066, 2A004).",
      },
      { status: 400 }
    );
  }

  try {
    const { libelleCommune, taux } = await getDeliberationsTaxeSejour(codeInsee);
    return Response.json({
      commune: libelleCommune,
      codeInsee,
      taux,
    });
  } catch {
    return Response.json(
      {
        error:
          "La base DELTA (data.economie.gouv.fr) est momentanément injoignable. Réessayez dans quelques instants.",
      },
      { status: 502 }
    );
  }
}
