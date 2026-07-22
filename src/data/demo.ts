// Demo-data så UI kan köras utan backend. Ersätts av Supabase-hämtning.

import type { Avtal, Rakning } from "../domain/types";

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
    forfallodatum: "2026-06-28",
    betald: false,
    kalla: "ocr",
  },
  {
    id: "r-fs-jul",
    hushallId: DEMO_HUSHALL,
    vertikal: "forsakring",
    leverantor: "Trygg Hem Försäkring",
    belopp: 540,
    forfallodatum: "2026-07-25",
    betald: false,
    kalla: "manuell",
  },
];
