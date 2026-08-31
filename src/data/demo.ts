// Demo-data så UI kan köras utan backend. Ersätts av Supabase-hämtning.
// All data är helt fiktiv (se handoffens arbetsprinciper) och datumen räknas
// relativt dagens datum så demon alltid känns levande.

import type { Avtal, Hushallsavtal, Inkopsvara, Rakning, Syssla } from "../domain/types";

export const DEMO_HUSHALL = "demo-hushall";
export const DEMO_HUSHALLSNAMN = "Familjen Ek";
export const DEMO_MEDLEM = "Alex";

function omDagar(antal: number): string {
  const datum = new Date(Date.now() + antal * 86_400_000);
  return datum.toISOString().slice(0, 10);
}

export const DEMO_AVTAL: Avtal[] = [
  {
    id: "el-1",
    hushallId: DEMO_HUSHALL,
    vertikal: "el",
    leverantor: "Dyr El AB",
    manadskostnad: 980,
    bindningTill: omDagar(21),
    meta: { forbrukningKwh: 1600 },
  },
  {
    id: "fs-1",
    hushallId: DEMO_HUSHALL,
    vertikal: "forsakring",
    leverantor: "Trygg Hem Försäkring",
    manadskostnad: 540,
  },
  {
    id: "mob-1",
    hushallId: DEMO_HUSHALL,
    vertikal: "mobil",
    leverantor: "Operatören",
    manadskostnad: 210,
    bindningTill: omDagar(48),
  },
];

export const DEMO_RAKNINGAR: Rakning[] = [
  {
    id: "r-el-forra",
    hushallId: DEMO_HUSHALL,
    vertikal: "el",
    leverantor: "Dyr El AB",
    belopp: 760,
    forfallodatum: omDagar(-14),
    betald: true,
    kalla: "ocr",
  },
  {
    id: "r-el-nasta",
    hushallId: DEMO_HUSHALL,
    vertikal: "el",
    leverantor: "Dyr El AB",
    belopp: 980,
    forfallodatum: omDagar(5),
    betald: false,
    kalla: "ocr",
  },
  {
    id: "r-fs-nasta",
    hushallId: DEMO_HUSHALL,
    vertikal: "forsakring",
    leverantor: "Trygg Hem Försäkring",
    belopp: 540,
    forfallodatum: omDagar(9),
    betald: false,
    kalla: "manuell",
  },
];

export const DEMO_SYSSLOR: Syssla[] = [
  {
    id: "s-tvatt",
    hushallId: DEMO_HUSHALL,
    titel: "Boka tvättstugan",
    ansvarig: "Alex",
    forfallodatum: omDagar(1),
    klar: false,
    kategori: "hem",
  },
  {
    id: "s-vaxter",
    hushallId: DEMO_HUSHALL,
    titel: "Vattna växterna",
    ansvarig: "Kim",
    forfallodatum: omDagar(2),
    klar: false,
    kategori: "hem",
    aterkommer: "varje_vecka",
  },
  {
    id: "s-handla",
    hushallId: DEMO_HUSHALL,
    titel: "Handla till helgen",
    ansvarig: "Alex",
    forfallodatum: omDagar(3),
    klar: true,
    kategori: "inkop",
  },
  {
    id: "s-badrum",
    hushallId: DEMO_HUSHALL,
    titel: "Städa badrummet",
    ansvarig: "Kim",
    forfallodatum: omDagar(4),
    klar: false,
    kategori: "stadning",
    aterkommer: "varje_vecka",
  },
];

export const DEMO_INKOP: Inkopsvara[] = [
  { id: "i-mjolk", hushallId: DEMO_HUSHALL, namn: "Mjölk", antal: "2 liter", kategori: "mat", kopd: false },
  { id: "i-kaffe", hushallId: DEMO_HUSHALL, namn: "Kaffe", antal: "1 paket", kategori: "mat", kopd: false },
  { id: "i-hundmat", hushallId: DEMO_HUSHALL, namn: "Hundmat", antal: "1 säck", kategori: "djur", kopd: false },
  { id: "i-disk", hushallId: DEMO_HUSHALL, namn: "Diskmedel", antal: "1 flaska", kategori: "hushall", kopd: true },
];

export const DEMO_HUSHALLSAVTAL: Hushallsavtal[] = [
  { id: "a-hem", hushallId: DEMO_HUSHALL, kategori: "forsakring", underkategori: "Hem", namn: "Hemförsäkring", leverantor: "Trygg Hem", manadskostnad: 249, fornyasDatum: omDagar(31), status: "aktivt" },
  { id: "a-bil", hushallId: DEMO_HUSHALL, kategori: "forsakring", underkategori: "Bil", namn: "Bilförsäkring", leverantor: "Säker Bil", manadskostnad: 579, fornyasDatum: omDagar(18), status: "aktivt" },
  { id: "a-djur", hushallId: DEMO_HUSHALL, kategori: "forsakring", underkategori: "Djur", namn: "Hundförsäkring", leverantor: "Djurtrygg", manadskostnad: 319, status: "aktivt" },
  { id: "a-bredband", hushallId: DEMO_HUSHALL, kategori: "bredband", namn: "Fiber 500", leverantor: "Snabbnät", manadskostnad: 449, status: "aktivt" },
  { id: "a-stream", hushallId: DEMO_HUSHALL, kategori: "streaming_tv", namn: "Film & TV", leverantor: "Streamly", manadskostnad: 149, status: "aktivt" },
  { id: "a-mobil", hushallId: DEMO_HUSHALL, kategori: "mobil", namn: "Mobil 20 GB", leverantor: "Operatören", manadskostnad: 210, fornyasDatum: omDagar(48), status: "aktivt" },
  { id: "a-el", hushallId: DEMO_HUSHALL, kategori: "el", namn: "Rörligt elavtal", leverantor: "Dyr El AB", manadskostnad: 980, fornyasDatum: omDagar(21), status: "aktivt" },
  { id: "a-gym", hushallId: DEMO_HUSHALL, kategori: "gym", namn: "Träningskort", leverantor: "Formtoppen", manadskostnad: 399, status: "aktivt" },
];
