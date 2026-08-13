// FRIDAY-bryggan (alt. 3: Hemma Kollen är fristående och POST:ar events till
// FRIDAY-navet). Enkelriktat ut. Ingen delad kod med FRIDAY-repot.
//
// FRIDAY plockar upp dessa i morgonbriefen, t.ex.:
//   "Hemma Kollen: 3 obetalda räkningar förfaller denna vecka + 1 besparing (~4 000 kr/år)"

import type { Besparingsforslag, Rakning } from "../domain/types";
import { totalArsbesparing } from "../engine/besparingar";

const FRIDAY_URL = import.meta.env.VITE_FRIDAY_WEBHOOK_URL as
  | string
  | undefined;

export interface FridayHemmaKollenEvent {
  kalla: "hemma_kollen";
  hushallId: string;
  obetaldaRakningar: number;
  obetaltBelopp: number;
  antalBesparingar: number;
  totalArsbesparingKr: number;
  topRubrik: string | null;
}

/** Bygger event-payloaden — ren funktion, testbar utan nätverk. */
export function byggFridayEvent(
  hushallId: string,
  rakningar: Rakning[],
  forslag: Besparingsforslag[],
): FridayHemmaKollenEvent {
  const obetalda = rakningar.filter((r) => !r.betald);
  return {
    kalla: "hemma_kollen",
    hushallId,
    obetaldaRakningar: obetalda.length,
    obetaltBelopp: obetalda.reduce((s, r) => s + r.belopp, 0),
    antalBesparingar: forslag.length,
    totalArsbesparingKr: totalArsbesparing(forslag),
    topRubrik: forslag[0]?.rubrik ?? null,
  };
}

/** Skickar event till FRIDAY-navet. No-op om webhook-url saknas. */
export async function skickaTillFriday(
  event: FridayHemmaKollenEvent,
): Promise<boolean> {
  if (!FRIDAY_URL) {
    console.info("[friday] webhook ej konfigurerad, hoppar över", event);
    return false;
  }
  try {
    const res = await fetch(FRIDAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    return res.ok;
  } catch (err) {
    console.error("[friday] kunde inte nå navet", err);
    return false;
  }
}
