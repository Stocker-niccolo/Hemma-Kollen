import { describe, expect, it } from "vitest";
import {
  beraknaBesparingar,
  totalArsbesparing,
  MIN_ARSBESPARING_KR,
} from "./besparingar";
import type { Avtal, Rakning } from "../domain/types";

const NU = new Date("2026-07-22T00:00:00Z");
const H = "hushall-1";

function avtal(p: Partial<Avtal>): Avtal {
  return {
    id: "a1",
    hushallId: H,
    vertikal: "el",
    leverantor: "Dyr El AB",
    manadskostnad: 900,
    ...p,
  };
}

describe("beraknaBesparingar — kostnad mot marknadssnitt", () => {
  it("flaggar el som ligger över snittet", () => {
    const f = beraknaBesparingar([avtal({ manadskostnad: 900 })], [], NU);
    expect(f).toHaveLength(1);
    // 900 - 650 = 250 kr/mån * 12 = 3000 kr/år
    expect(f[0].arsbesparingKr).toBe(3000);
    expect(f[0].vertikal).toBe("el");
  });

  it("flaggar INTE el som ligger på eller under snittet", () => {
    const f = beraknaBesparingar([avtal({ manadskostnad: 650 })], [], NU);
    expect(f).toHaveLength(0);
  });

  it("ignorerar för små besparingar (under tröskeln)", () => {
    // 670 - 650 = 20 kr/mån * 12 = 240 kr/år < MIN
    const f = beraknaBesparingar([avtal({ manadskostnad: 670 })], [], NU);
    expect(MIN_ARSBESPARING_KR).toBeGreaterThan(240);
    expect(f).toHaveLength(0);
  });

  it("håller copy på jämför-sidan (nämner partner, ej förmedling)", () => {
    const f = beraknaBesparingar([avtal({ manadskostnad: 900 })], [], NU);
    expect(f[0].alternativ).toMatch(/Elskling/);
    expect(f[0].alternativ).not.toMatch(/rekommenderar/i);
  });
});

describe("beraknaBesparingar — bindningstid", () => {
  it("nudgar när avtal löper ut inom fönstret", () => {
    const f = beraknaBesparingar(
      [avtal({ manadskostnad: 600, bindningTill: "2026-08-20" })],
      [],
      NU,
    );
    expect(f).toHaveLength(1);
    expect(f[0].rubrik).toMatch(/löper ut/);
  });

  it("nudgar INTE för avtal långt fram i tiden", () => {
    const f = beraknaBesparingar(
      [avtal({ manadskostnad: 600, bindningTill: "2027-01-01" })],
      [],
      NU,
    );
    expect(f).toHaveLength(0);
  });

  it("kostnadsförslag vinner över bindningsnudge för samma vertikal", () => {
    const f = beraknaBesparingar(
      [avtal({ manadskostnad: 900, bindningTill: "2026-08-01" })],
      [],
      NU,
    );
    expect(f).toHaveLength(1);
    expect(f[0].arsbesparingKr).toBe(3000); // kostnad, inte 0 (bindning)
  });
});

describe("beraknaBesparingar — räkningsökning", () => {
  function rakning(p: Partial<Rakning>): Rakning {
    return {
      id: "r",
      hushallId: H,
      vertikal: "mobil",
      leverantor: "Operatör",
      belopp: 200,
      forfallodatum: "2026-06-01",
      betald: false,
      kalla: "ocr",
      ...p,
    };
  }

  it("flaggar en räkning som ökat mer än 20 %", () => {
    const f = beraknaBesparingar(
      [],
      [
        rakning({ id: "r1", belopp: 200, forfallodatum: "2026-05-01" }),
        rakning({ id: "r2", belopp: 300, forfallodatum: "2026-06-01" }),
      ],
      NU,
    );
    expect(f).toHaveLength(1);
    expect(f[0].rubrik).toMatch(/ökat 50 %/);
  });

  it("struntar i små ökningar", () => {
    const f = beraknaBesparingar(
      [],
      [
        rakning({ id: "r1", belopp: 200, forfallodatum: "2026-05-01" }),
        rakning({ id: "r2", belopp: 210, forfallodatum: "2026-06-01" }),
      ],
      NU,
    );
    expect(f).toHaveLength(0);
  });
});

describe("sortering och summering", () => {
  it("sorterar störst årsbesparing först och summerar totalen", () => {
    const f = beraknaBesparingar(
      [
        avtal({ id: "el", vertikal: "el", manadskostnad: 900 }), // 3000
        avtal({
          id: "fs",
          vertikal: "forsakring",
          leverantor: "Dyr Försäkring",
          manadskostnad: 600,
        }), // (600-380)*12 = 2640
      ],
      [],
      NU,
    );
    expect(f.map((x) => x.vertikal)).toEqual(["el", "forsakring"]);
    expect(totalArsbesparing(f)).toBe(3000 + 2640);
  });
});
