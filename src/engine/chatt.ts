// Chattmotor — rena, testbara funktioner utan nätverk eller DOM.
// Används av ChattRuta (klient) och av Claude-workern (systemprompt).

import { AMNEN, HEMMAKOLLEN_FAKTA, FAQ, type FaqPost } from "../data/kunskap";

export interface ChattMeddelande {
  roll: "user" | "assistant";
  text: string;
}

/** Max antal turer som skickas till backend (äldre klipps bort). */
export const MAX_TURER = 12;
/** Max tecken per meddelande som skickas till backend. */
export const MAX_TECKEN = 2000;

export const RESERV_SVAR =
  "Det där kan jag tyvärr inte svara på just nu. Prova att fråga om elavtal, försäkring, mobil, räkningar, uppsägning, hushållsdelning eller vad Hemmakollen kostar — eller mejla oss så svarar en människa.";

function normalisera(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}

/**
 * Lokal reservmotor: hittar bästa FAQ-svar via nyckelordsmatchning.
 * Längre nyckelord väger tyngre (specifikare match). Returnerar null vid ingen träff.
 */
export function hittaFaqSvar(fraga: string, faq: FaqPost[] = FAQ): FaqPost | null {
  const normal = normalisera(fraga);
  if (!normal) return null;
  let basta: { post: FaqPost; poang: number } | null = null;
  for (const post of faq) {
    let poang = 0;
    for (const nyckel of post.nyckelord) {
      const n = normalisera(nyckel);
      if (n && normal.includes(n)) poang += n.split(" ").length + n.length / 20;
    }
    if (poang > 0 && (!basta || poang > basta.poang)) basta = { post, poang };
  }
  return basta?.post ?? null;
}

/** Systemprompten till Claude — byggd från kunskapsbasen. Deterministisk (cache-vänlig). */
export function byggSystemPrompt(): string {
  const amnen = AMNEN.map((a) => `### ${a.rubrik}\n${a.text}`).join("\n\n");
  const faq = FAQ.map((f) => `- ${f.svar}`).join("\n");
  return `Du är Hemmakollens hjälpsamma assistent på hemsidan hemmakollen. Du svarar på svenska, kort och konkret (oftast 1–4 meningar), varmt men inte överdrivet personligt, tryggt utan myndighetston. Inga finans- eller teknikord i onödan. Svara bara på det som frågas; erbjud ett naturligt nästa steg om det passar.

Du hjälper besökare med två saker: (1) frågor om Hemmakollen — vad det är, vad det kostar, hur vi tjänar pengar, integritet, status — och (2) allmänna frågor om hushållsekonomi: elavtal, hemförsäkring, mobil och bredband, streaming, räkningar, bindningstider och uppsägning, hushållsdelning, besparingar.

Hårda regler:
- Besparingar är alltid uppskattningar ("cirka", "ungefär"), aldrig utfall eller löften.
- Hemmakollen förmedlar aldrig försäkring, lån eller kredit och ger ingen individuell försäkrings-, kredit- eller finansiell rådgivning. Du får förklara hur saker fungerar generellt och hänvisa till oberoende källor (Konsumenternas, Hallå konsument, Elpriskollen, kommunens budget- och skuldrådgivning).
- Om Hemmakollen kan få ersättning från en partner ska det sägas öppet. Det påverkar inte användarens pris.
- Lova inte funktioner som inte finns. Grannhjälpen är planerad, inte lanserad.
- Hitta aldrig på priser, villkor eller leverantörsnamn. Om du inte vet: säg det och föreslå var svaret finns.
- Be aldrig om personnummer, kortuppgifter eller bankinloggning. Behandla inte personuppgifter som användaren råkar skriva — be dem inte skicka mer.
- Du är ingen juridisk rådgivare; vid tvist, hänvisa till Hallå konsument eller ARN.
- Om frågan ligger helt utanför hem, hushåll och Hemmakollen: säg vänligt att du är begränsad till de ämnena.
- Formatera som löpande text. Använd punktlista bara när användaren ber om steg eller alternativ. Ingen markdown-rubrik.

## Om Hemmakollen
${HEMMAKOLLEN_FAKTA}

## Ämnen
${amnen}

## Korta standardsvar (använd som grund, omformulera gärna)
${faq}`;
}

/** Klipper historiken till det som ska skickas till backend. */
export function trimmaHistorik(historik: ChattMeddelande[]): ChattMeddelande[] {
  return historik
    .filter((m) => m.text.trim().length > 0)
    .slice(-MAX_TURER)
    .map((m) => ({ roll: m.roll, text: m.text.slice(0, MAX_TECKEN) }));
}

/** Validerar inkommande payload i workern. Returnerar null om ogiltig. */
export function valideraHistorik(input: unknown): ChattMeddelande[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_TURER) return null;
  const ut: ChattMeddelande[] = [];
  for (const rad of input) {
    if (!rad || typeof rad !== "object") return null;
    const { roll, text } = rad as Record<string, unknown>;
    if ((roll !== "user" && roll !== "assistant") || typeof text !== "string") return null;
    if (text.length === 0 || text.length > MAX_TECKEN) return null;
    ut.push({ roll, text });
  }
  if (ut[0].roll !== "user" || ut[ut.length - 1].roll !== "user") return null;
  return ut;
}
