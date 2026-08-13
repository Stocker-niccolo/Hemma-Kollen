// Domänmodell för Hemma Kollen. Håll den fri från UI och Supabase-detaljer.

export type Vertikal = "el" | "forsakring" | "mobil" | "mat" | "hantverk";

export interface Hushall {
  id: string;
  namn: string;
  skapad: string; // ISO
}

export interface Medlem {
  id: string;
  hushallId: string;
  namn: string;
  epost: string;
  roll: "agare" | "medlem";
}

/** Ett pågående avtal användaren har (el, försäkring, mobil ...). */
export interface Avtal {
  id: string;
  hushallId: string;
  vertikal: Vertikal;
  leverantor: string;
  /** Månadskostnad i kr. För el: senaste månadens faktiska kostnad. */
  manadskostnad: number;
  /** ISO-datum då bindningstid/avtal löper ut, om känt. */
  bindningTill?: string;
  /** Extra fält per vertikal, t.ex. { forbrukningKwh: 1500 } för el. */
  meta?: Record<string, number | string>;
}

/** En inkommen räkning (från mejl-forward/OCR eller manuell inmatning). */
export interface Rakning {
  id: string;
  hushallId: string;
  vertikal: Vertikal;
  leverantor: string;
  belopp: number;
  forfallodatum: string; // ISO
  betald: boolean;
  kalla: "ocr" | "manuell" | "open_banking";
}

/** En återkommande eller enstaka syssla i hushållet. */
export interface Syssla {
  id: string;
  hushallId: string;
  titel: string;
  ansvarig: string;
  forfallodatum: string; // ISO
  klar: boolean;
  kategori: "stadning" | "hem" | "inkop" | "ovrigt";
  aterkommer?: "varje_vecka" | "varannan_vecka" | "varje_manad";
}

export type Inkopskategori = "mat" | "hushall" | "djur" | "ovrigt";

/** En rad i hushållets gemensamma inköpslista. */
export interface Inkopsvara {
  id: string;
  hushallId: string;
  namn: string;
  antal: string;
  kategori: Inkopskategori;
  kopd: boolean;
}

export type Avtalskategori =
  | "forsakring"
  | "bredband"
  | "streaming_tv"
  | "mobil"
  | "el"
  | "vatten"
  | "gym";

export type Avtalsstatus = "aktivt" | "avslutas" | "avslutat";

/** Ett återkommande avtal eller abonnemang som hushållet vill hålla koll på. */
export interface Hushallsavtal {
  id: string;
  hushallId: string;
  kategori: Avtalskategori;
  underkategori?: string;
  namn: string;
  leverantor: string;
  manadskostnad: number;
  fornyasDatum?: string;
  uppsagningstidManader?: number;
  status: Avtalsstatus;
  anteckning?: string;
}

/** Ett förslag från besparings-motorn. Aldrig "rekommendation" i copy — jämför. */
export interface Besparingsforslag {
  vertikal: Vertikal;
  rubrik: string;
  /** Uppskattad besparing per år i kr. ALLTID märkt som estimat i UI. */
  arsbesparingKr: number;
  nuvarande: string;
  alternativ: string;
  /** Affiliate/lead-länk. Fas 1 = befintligt affiliate-program. */
  affiliateUrl: string;
  /** Varför förslaget triggades — visas för transparens. */
  anledning: string;
  /** 0–1, hur säkert estimatet är. Låg → visa mjukare i UI. */
  konfidens: number;
}
