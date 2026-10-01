import { describe, expect, it } from "vitest";
import { FAQ, FORSLAG_FRAGOR } from "../data/kunskap";
import {
  MAX_TECKEN,
  MAX_TURER,
  byggSystemPrompt,
  hittaFaqSvar,
  trimmaHistorik,
  valideraHistorik,
} from "./chatt";

describe("hittaFaqSvar (lokal reservmotor)", () => {
  it("hittar rätt svar på de föreslagna frågorna", () => {
    expect(hittaFaqSvar("Vad är Hemmakollen?")?.id).toBe("vad-ar");
    expect(hittaFaqSvar("Kostar det något?")?.id).toBe("pris");
    expect(hittaFaqSvar("Hur tjänar ni pengar?")?.id).toBe("affar");
    expect(hittaFaqSvar("När ska jag byta elavtal?")?.id).toBe("el");
    expect(hittaFaqSvar("Vad är Grannhjälpen?")?.id).toBe("grannhjalp");
  });

  it("alla chips-förslag ger ett svar", () => {
    for (const fraga of FORSLAG_FRAGOR) expect(hittaFaqSvar(fraga)).not.toBeNull();
  });

  it("är okänslig för skiftläge och skiljetecken", () => {
    expect(hittaFaqSvar("HEMFÖRSÄKRING!!!")?.id).toBe("forsakring");
    expect(hittaFaqSvar("  kan jag få hjälp med sopkärl?? ")?.id).toBe("grannhjalp");
  });

  it("väger längre (specifikare) nyckelord tyngre", () => {
    // "avtal löper ut" (uppsägning) ska vinna över det korta "dyrt"/"spara".
    expect(hittaFaqSvar("mitt avtal löper ut, vad gör jag?")?.id).toBe("uppsagning");
  });

  it("returnerar null när inget matchar", () => {
    expect(hittaFaqSvar("vilken är huvudstaden i Peru")).toBeNull();
    expect(hittaFaqSvar("")).toBeNull();
  });

  it("varje FAQ-post nås via sitt första nyckelord", () => {
    for (const post of FAQ) {
      expect(hittaFaqSvar(post.nyckelord[0])?.id).toBe(post.id);
    }
  });
});

describe("byggSystemPrompt", () => {
  const prompt = byggSystemPrompt();

  it("är deterministisk (cache-vänlig)", () => {
    expect(byggSystemPrompt()).toBe(prompt);
  });

  it("bär de hårda reglerna", () => {
    expect(prompt).toMatch(/uppskattningar/);
    expect(prompt).toMatch(/förmedlar aldrig försäkring/);
    expect(prompt).toMatch(/ersättning/);
    expect(prompt).toMatch(/Grannhjälpen är planerad/);
    expect(prompt).toMatch(/personnummer/);
  });

  it("innehåller kunskapsbasen", () => {
    expect(prompt).toContain("### Elavtal");
    expect(prompt).toContain("Elpriskollen");
  });
});

describe("trimmaHistorik", () => {
  it("klipper till de senaste turerna och tecken-gränsen", () => {
    const lang = Array.from({ length: MAX_TURER + 5 }, (_, i) => ({
      roll: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      text: "x".repeat(MAX_TECKEN + 100),
    }));
    const ut = trimmaHistorik(lang);
    expect(ut).toHaveLength(MAX_TURER);
    expect(ut.every((m) => m.text.length === MAX_TECKEN)).toBe(true);
  });

  it("tar bort tomma meddelanden", () => {
    expect(trimmaHistorik([{ roll: "user", text: "  " }, { roll: "user", text: "hej" }])).toEqual([
      { roll: "user", text: "hej" },
    ]);
  });
});

describe("valideraHistorik (worker-sidan)", () => {
  it("godkänner en giltig historik", () => {
    expect(
      valideraHistorik([
        { roll: "user", text: "hej" },
        { roll: "assistant", text: "hej!" },
        { roll: "user", text: "vad kostar det?" },
      ]),
    ).toHaveLength(3);
  });

  it("avvisar skräp", () => {
    expect(valideraHistorik(null)).toBeNull();
    expect(valideraHistorik([])).toBeNull();
    expect(valideraHistorik([{ roll: "system", text: "x" }])).toBeNull();
    expect(valideraHistorik([{ roll: "assistant", text: "x" }])).toBeNull();
    expect(valideraHistorik([{ roll: "user", text: "" }])).toBeNull();
    expect(valideraHistorik([{ roll: "user", text: "x".repeat(MAX_TECKEN + 1) }])).toBeNull();
    expect(
      valideraHistorik(Array.from({ length: MAX_TURER + 1 }, () => ({ roll: "user", text: "x" }))),
    ).toBeNull();
  });
});
