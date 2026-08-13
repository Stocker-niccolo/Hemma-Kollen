// Demo-data så UI kan köras utan backend. Ersätts av Supabase-hämtning.

import type { Avtal, Hushallsavtal, Inkopsvara, Rakning, Syssla } from "../domain/types";

export const DEMO_HUSHALL = "demo-hushall";

export const DEMO_AVTAL: Avtal[] = [
  {
    id: "el-1",
    hushallId: DEMO_HUSHALL,
    vertikal: "el",
    leverantor: "Dyr El AB",
    manadskostnad: 980,
    bindningTill: "2026-09-10",
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
    bindningTill: "2026-08-15",
  },
];

export const DEMO_RAKNINGAR: Rakning[] = [
  {
    id: "r-el-maj",
    hushallId: DEMO_HUSHALL,
    vertikal: "el",
    leverantor: "Dyr El AB",
    belopp: 760,
    forfallodatum: "2026-05-28",
    betald: true,
    kalla: "ocr",
  },
  {
    id: "r-el-jun",
    hushallId: DEMO_HUSHALL,
    vertikal: "el",
    leverantor: "Dyr El AB",
    belopp: 980,
    forfallodatum: "2026-08-18",
    betald: false,
    kalla: "ocr",
  },
  {
    id: "r-fs-jul",
    hushallId: DEMO_HUSHALL,
    vertikal: "forsakring",
    leverantor: "Trygg Hem Försäkring",
    belopp: 540,
    forfallodatum: "2026-08-22",
    betald: false,
    kalla: "manuell",
  },
];

export const DEMO_SYSSLOR: Syssla[] = [
  {
    id: "s-tvatt",
    hushallId: DEMO_HUSHALL,
    titel: "Boka tvättstugan",
    ansvarig: "Niccolò",
    forfallodatum: "2026-08-14",
    klar: false,
    kategori: "hem",
  },
  {
    id: "s-vaxter",
    hushallId: DEMO_HUSHALL,
    titel: "Vattna växterna",
    ansvarig: "Anna",
    forfallodatum: "2026-08-15",
    klar: false,
    kategori: "hem",
    aterkommer: "varje_vecka",
  },
  {
    id: "s-handla",
    hushallId: DEMO_HUSHALL,
    titel: "Handla till helgen",
    ansvarig: "Niccolò",
    forfallodatum: "2026-08-16",
    klar: true,
    kategori: "inkop",
  },
  {
    id: "s-badrum",
    hushallId: DEMO_HUSHALL,
    titel: "Städa badrummet",
    ansvarig: "Anna",
    forfallodatum: "2026-08-17",
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
  { id: "a-hem", hushallId: DEMO_HUSHALL, kategori: "forsakring", underkategori: "Hem", namn: "Hemförsäkring", leverantor: "Trygg Hem", manadskostnad: 249, fornyasDatum: "2026-10-01", status: "aktivt" },
  { id: "a-bil", hushallId: DEMO_HUSHALL, kategori: "forsakring", underkategori: "Bil", namn: "Bilförsäkring", leverantor: "Säker Bil", manadskostnad: 579, fornyasDatum: "2026-09-18", status: "aktivt" },
  { id: "a-djur", hushallId: DEMO_HUSHALL, kategori: "forsakring", underkategori: "Djur", namn: "Hundförsäkring", leverantor: "Djurtrygg", manadskostnad: 319, status: "aktivt" },
  { id: "a-bredband", hushallId: DEMO_HUSHALL, kategori: "bredband", namn: "Fiber 500", leverantor: "Bahnhof", manadskostnad: 449, status: "aktivt" },
  { id: "a-stream", hushallId: DEMO_HUSHALL, kategori: "streaming_tv", namn: "Film & TV", leverantor: "Netflix", manadskostnad: 149, status: "aktivt" },
  { id: "a-mobil", hushallId: DEMO_HUSHALL, kategori: "mobil", namn: "Mobil 30 GB", leverantor: "Operatören", manadskostnad: 210, fornyasDatum: "2026-08-15", status: "aktivt" },
  { id: "a-el", hushallId: DEMO_HUSHALL, kategori: "el", namn: "Rörligt elavtal", leverantor: "Dyr El AB", manadskostnad: 980, fornyasDatum: "2026-09-10", status: "aktivt" },
  { id: "a-vatten", hushallId: DEMO_HUSHALL, kategori: "vatten", namn: "Vatten & avlopp", leverantor: "Kommunen", manadskostnad: 340, status: "aktivt" },
  { id: "a-gym", hushallId: DEMO_HUSHALL, kategori: "gym", namn: "Gymkort", leverantor: "Nordic Wellness", manadskostnad: 399, fornyasDatum: "2026-12-01", status: "aktivt" },
];
