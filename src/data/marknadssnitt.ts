// Marknadssnitt att jämföra mot. ESTIMAT — inte utfall. Uppdateras manuellt
// tills vi har live-data. Håll siffrorna ärliga; överklaiva aldrig besparingar.
// Källor att koppla in senare: Elpriskollen, Konsumenternas Försäkringsbyrå.

import type { Vertikal } from "../domain/types";

export interface Riktmarke {
  /** Rimlig marknadskostnad/mån i kr för en "normal" hushållsprofil. */
  rimligManadskostnad: number;
  /** Affiliate-länk (fas 1: befintligt program). Byt till riktig tracking-url. */
  affiliateUrl: string;
  /** Namn på jämförelse-partnern som visas i copy. */
  partner: string;
}

// OBS: platshållarvärden. Ersätt med verifierade siffror innerst det går live.
export const MARKNADSSNITT: Record<Vertikal, Riktmarke> = {
  el: {
    rimligManadskostnad: 650,
    affiliateUrl: "https://example.com/aff/el", // TODO: Adtraction/Elskling-url
    partner: "Elskling",
  },
  forsakring: {
    rimligManadskostnad: 380,
    affiliateUrl: "https://example.com/aff/forsakring", // TODO: Compricer-url
    partner: "Compricer",
  },
  mobil: {
    rimligManadskostnad: 200,
    affiliateUrl: "https://example.com/aff/mobil",
    partner: "Bredbandsval",
  },
  mat: {
    rimligManadskostnad: 0, // hanteras via mönster, ej fast riktmärke
    affiliateUrl: "https://example.com/aff/mat",
    partner: "Matkasse",
  },
  hantverk: {
    rimligManadskostnad: 0, // lead-baserat, ej abonnemang
    affiliateUrl: "https://example.com/aff/hantverk",
    partner: "Offerta",
  },
};
