import { z } from "zod";

const PROVINCE_CODES: Record<string, string> = {
  "Groningen": "GR",
  "Friesland": "FR",
  "Drenthe": "DR",
  "Overijssel": "OV",
  "Flevoland": "FL",
  "Gelderland": "GE",
  "Utrecht": "UT",
  "Noord-Holland": "NH",
  "Zuid-Holland": "ZH",
  "Zeeland": "ZE",
  "Noord-Brabant": "NB",
  "Limburg": "LI",
};

const querySchema = z.object({
  code: z.string().regex(/^\d{4}[a-zA-Z]{2}$/),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({ code: searchParams.get("code") ?? "" });
  if (!parsed.success) {
    return Response.json({ error: "Ongeldig postcodenummer" }, { status: 400 });
  }

  const code = parsed.data.code.replace(/\s/g, "").toUpperCase();

  try {
    const pdokUrl =
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?` +
      `q=${encodeURIComponent(code)}&fq=type:postcode&fl=woonplaatsnaam,provincienaam&rows=1`;

    const res = await fetch(pdokUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) throw new Error("pdok_error");

    const data = await res.json() as {
      response: { docs: { woonplaatsnaam?: string; provincienaam?: string }[] };
    };

    const doc = data?.response?.docs?.[0];
    if (!doc?.woonplaatsnaam) {
      return Response.json({ error: "Postcode niet gevonden" }, { status: 404 });
    }

    const province = doc.provincienaam ?? "";
    const provinceCode = PROVINCE_CODES[province] ?? "XX";

    return Response.json({
      city: doc.woonplaatsnaam,
      province,
      provinceCode,
    });
  } catch {
    return Response.json({ error: "Lookup mislukt" }, { status: 502 });
  }
}
