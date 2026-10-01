// Klient mot chatt-workern (worker/chatt). Streamar svaret som text.
// Saknas VITE_CHATT_URL körs den lokala reservmotorn (FAQ) i stället —
// hemsidan fungerar alltså utan backend, men svarar då bara på kända frågor.

import { RESERV_SVAR, hittaFaqSvar, trimmaHistorik, type ChattMeddelande } from "../engine/chatt";

const CHATT_URL = import.meta.env.VITE_CHATT_URL as string | undefined;

/** True när en Claude-backend är konfigurerad. */
export const harChattBackend = Boolean(CHATT_URL);

/**
 * Skickar historiken och anropar onDelta för varje textbit som kommer in.
 * Returnerar hela svaret. Kastar vid nätverks-/serverfel.
 */
export async function skickaTillBot(
  historik: ChattMeddelande[],
  onDelta: (bit: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  if (!CHATT_URL) {
    const sista = historik[historik.length - 1]?.text ?? "";
    const svar = hittaFaqSvar(sista)?.svar ?? RESERV_SVAR;
    // Liten "skriv-effekt" så reservläget känns levande.
    for (const ord of svar.split(" ")) {
      if (signal?.aborted) break;
      onDelta(ord + " ");
      await new Promise((r) => setTimeout(r, 18));
    }
    return svar;
  }

  const res = await fetch(CHATT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meddelanden: trimmaHistorik(historik) }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`Chatt-tjänsten svarade ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let hela = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const bit = decoder.decode(value, { stream: true });
    hela += bit;
    onDelta(bit);
  }
  return hela;
}
