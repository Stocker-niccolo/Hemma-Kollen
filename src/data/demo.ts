// Demo-data så UI kan köras utan backend. Ersätts av Supabase-hämtning.

import type { Avtal, Rakning, Syssla } from "../domain/types";

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
