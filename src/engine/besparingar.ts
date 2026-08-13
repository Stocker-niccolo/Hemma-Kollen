// Besparings-motorn — hjärtat i Hemma Kollen. RENA funktioner, inga sidoeffekter,
// ingen Date.now() inuti (skicka in `nu` → deterministiskt + testbart).
//
// Motorn tittar på avtal + räkningar, jämför mot marknadssnitt, och returnerar
// förslag. Copy håller sig på JÄMFÖR-sidan (aldrig egen förmedling).

import type {
  Avtal,
  Besparingsforslag,
  Rakning,
  Vertikal,
} from "../domain/types";
import { MARKNADSSNITT } from "../data/marknadssnitt";

/** Hur många dagar innan bindningstid går ut vi börjar nudga. */
export const NUDGE_FONSTER_DAGAR = 45;

/** Minsta årsbesparing (kr) för att ett förslag ska visas — ingen brus-nudge. */
export const MIN_ARSBESPARING_KR = 300;

function dagarMellan(fran: Date, till: Date): number {
  const ms = till.getTime() - fran.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** Överkostnad mot marknadssnitt → förslag. Gäller el/försäkring/mobil. */
function forslagFranKostnad(avtal: Avtal): Besparingsforslag | null {
  const snitt = MARKNADSSNITT[avtal.vertikal];
  if (!snitt || snitt.rimligManadskostnad <= 0) return null;

  const overkostnadMan = avtal.manadskostnad - snitt.rimligManadskostnad;
  if (overkostnadMan <= 0) return null;

  const arsbesparingKr = Math.round(overkostnadMan * 12);
  if (arsbesparingKr < MIN_ARSBESPARING_KR) return null;

  // Konfidens: större relativ överkostnad → mer sannolikt verklig besparing.
  const relativ = overkostnadMan / snitt.rimligManadskostnad;
  const konfidens = Math.min(0.9, 0.4 + relativ);

  return {
    vertikal: avtal.vertikal,
    rubrik: `Du betalar mer än marknadssnittet för ${etikett(avtal.vertikal)}`,
    arsbesparingKr,
    nuvarande: `${avtal.leverantor} — ${avtal.manadskostnad} kr/mån`,
    alternativ: `Likvärdigt hos ${snitt.partner} — ~${snitt.rimligManadskostnad} kr/mån`,
    affiliateUrl: snitt.affiliateUrl,
    anledning: `${avtal.manadskostnad} kr/mån ligger ${overkostnadMan} kr över snittet ${snitt.rimligManadskostnad} kr.`,
    konfidens,
  };
}

/** Avtal som snart löper ut → nudge att jämföra innan omteckning. */
function forslagFranBindning(
  avtal: Avtal,
  nu: Date,
): Besparingsforslag | null {
  if (!avtal.bindningTill) return null;
  const dagar = dagarMellan(nu, new Date(avtal.bindningTill));
  if (dagar < 0 || dagar > NUDGE_FONSTER_DAGAR) return null;

  const snitt = MARKNADSSNITT[avtal.vertikal];
  return {
    vertikal: avtal.vertikal,
    rubrik: `Ditt ${etikett(avtal.vertikal)}-avtal löper ut om ${dagar} dagar`,
    arsbesparingKr: 0, // okänt tills jämförelse görs — visas som "jämför nu"
    nuvarande: `${avtal.leverantor} — bindning t.o.m. ${avtal.bindningTill.slice(0, 10)}`,
    alternativ: `Jämför alternativ hos ${snitt.partner} innan du binder om`,
    affiliateUrl: snitt.affiliateUrl,
    anledning: `Rätt läge att jämföra: ${dagar} dagar kvar av bindningstiden.`,
    konfidens: 0.7,
  };
}

/** Räkning som ökat markant mot tidigare för samma vertikal → flagga. */
function forslagFranOkning(
  rakningar: Rakning[],
): Besparingsforslag[] {
  const perVertikal = new Map<Vertikal, Rakning[]>();
  for (const r of rakningar) {
    const lista = perVertikal.get(r.vertikal) ?? [];
    lista.push(r);
    perVertikal.set(r.vertikal, lista);
  }

  const forslag: Besparingsforslag[] = [];
  for (const [vertikal, lista] of perVertikal) {
    if (lista.length < 2) continue;
    const sorterad = [...lista].sort(
      (a, b) => Date.parse(a.forfallodatum) - Date.parse(b.forfallodatum),
    );
    const forra = sorterad[sorterad.length - 2];
    const senaste = sorterad[sorterad.length - 1];
    const okning = senaste.belopp - forra.belopp;
    if (okning <= 0 || forra.belopp <= 0) continue;

    const relativ = okning / forra.belopp;
    if (relativ < 0.2) continue; // mindre än 20 % → brus, hoppa

    const snitt = MARKNADSSNITT[vertikal];
    forslag.push({
      vertikal,
      rubrik: `Din ${etikett(vertikal)}-räkning har ökat ${Math.round(relativ * 100)} %`,
      arsbesparingKr: Math.round(okning * 12),
      nuvarande: `${senaste.leverantor} — ${senaste.belopp} kr (upp från ${forra.belopp} kr)`,
      alternativ: `Se om du kan byta via ${snitt.partner}`,
      affiliateUrl: snitt.affiliateUrl,
      anledning: `Ökning på ${okning} kr sedan förra räkningen.`,
      konfidens: Math.min(0.85, 0.5 + relativ),
    });
  }
  return forslag;
}

function etikett(v: Vertikal): string {
  const map: Record<Vertikal, string> = {
    el: "el",
    forsakring: "försäkring",
    mobil: "mobil",
    mat: "mat",
    hantverk: "hantverk",
  };
  return map[v];
}

/**
 * Kör hela motorn. Returnerar förslag sorterade på störst årsbesparing först.
 * Deduplicerar per vertikal (kostnadsförslag vinner över bindningsnudge).
 */
export function beraknaBesparingar(
  avtal: Avtal[],
  rakningar: Rakning[],
  nu: Date,
): Besparingsforslag[] {
  const kandidater: Besparingsforslag[] = [];

  for (const a of avtal) {
    const kostnad = forslagFranKostnad(a);
    if (kostnad) kandidater.push(kostnad);
    else {
      const bindning = forslagFranBindning(a, nu);
      if (bindning) kandidater.push(bindning);
    }
  }
  kandidater.push(...forslagFranOkning(rakningar));

  // En per vertikal — behåll den med störst årsbesparing.
  const bastaPerVertikal = new Map<Vertikal, Besparingsforslag>();
  for (const f of kandidater) {
    const nuvarande = bastaPerVertikal.get(f.vertikal);
    if (!nuvarande || f.arsbesparingKr > nuvarande.arsbesparingKr) {
      bastaPerVertikal.set(f.vertikal, f);
    }
  }

  return [...bastaPerVertikal.values()].sort(
    (a, b) => b.arsbesparingKr - a.arsbesparingKr,
  );
}

/** Summerar total uppskattad årsbesparing — för FRIDAY-brief och dashboard. */
export function totalArsbesparing(forslag: Besparingsforslag[]): number {
  return forslag.reduce((s, f) => s + f.arsbesparingKr, 0);
}
