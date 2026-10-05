# Hemmakollen — beslutsliggare och nästa steg

Uppdaterad: 5 oktober 2026. Kompletterar [`HANDOFF.md`](./HANDOFF.md) (styrande)
med status per öppet beslut ur handoffens avsnitt 19, samt de konkreta stegen
framåt. Statusar: **BESLUTAT** · **REKOMMENDATION** (väntar ägar-ja) · **ÖPPET**.

---

## 1. Produkt

| Beslut | Status | Läge |
|---|---|---|
| Mobilapp, PWA eller båda? | REKOMMENDATION | Responsiv webbapp först (grunden finns redan byggd och publicerad); PWA-manifest som litet nästa steg; native app först efter validerad retention. |
| Hushållsdelning i lansering? | REKOMMENDATION | Ja, i enklaste form (ägare + medlem) — ingår i handoffens MVP och datamodellen med RLS finns redan. Inbjudningsflödet byggs när Supabase är live. |
| Inköpslistor och sysslor i MVP? | REKOMMENDATION | Behåll det som redan är byggt (ger daglig återkomst) men bygg inte vidare på dem förrän ekonomikärnan (kostnader, avtal, påminnelser) är validerad. Ekonomikärnan ska stå främst i navigation och hemskärm — IA-justering enligt handoffens navförslag (Hem/Kostnader/Lägg till/Hushåll/Profil) görs som eget beslut. |
| Tre kostnadskategorier med bäst specialstöd först? | REKOMMENDATION | El, hemförsäkring, mobil/bredband — matchar befintlig besparingsmotor och handoffens partnerprioritering. |
| Dokumentuppladdning i v1? | REKOMMENDATION | Nej — fas 2 (kvitto-/fakturatolkning), enligt handoffen. |

## 2. Data och integrationer

| Beslut | Status | Läge |
|---|---|---|
| Helt manuell MVP? | REKOMMENDATION | Ja. Manuell registrering är redan byggd och är alltid reservväg. |
| Open Banking-partner? | ÖPPET | Fas 3-fråga. Kartläggs först när aktivering/retention är bevisad. Byggs aldrig i egen regi (handoffens krav). |
| E-postimport? | ÖPPET | Fas 2, endast med uttryckligt samtycke och begränsad åtkomst. Designas inte nu. |
| Externa pris-/jämförelsedata? | ÖPPET | Marknadssnitten i `src/data/marknadssnitt.ts` är platshållare. Verifieras mot Elpriskollen/Konsumenternas innan någon besparingssiffra visas utanför demo. |

## 3. Affär

| Beslut | Status | Läge |
|---|---|---|
| Första partnerkategorier? | REKOMMENDATION | El + mobil/bredband + försäkring (jämför & länka — aldrig förmedling, FI-linjen). |
| Direkt med leverantörer eller affiliatenätverk? | REKOMMENDATION | Affiliatenätverk först (snabbast till riktiga länkar och avräkning); direktavtal när volym finns. |
| Hur beräknas/visas besparing? | BESLUTAT (princip) | Deterministisk motor med injicerat datum (byggd, 10 tester). Alltid märkt "uppskattning", aldrig utfall. |
| Kommersiella skyddsregler? | REKOMMENDATION | Kodifieras i rekommendationsreglerna: ett erbjudande får aldrig visas enbart för att ersättningen är hög; ersättning märks alltid ut; icke-kommersiella råd tillåtna. |

## 4. Varumärke

| Beslut | Status | Läge |
|---|---|---|
| Hemmakollen slutligt namn? | BESLUTAT | Ägaren bytte 1 oktober 2026 från CasaVita till **Hemmakollen** (ett ord). Klient, metadata, dokumentation, bot och worker bär namnet sedan dess. |
| Domän, sociala namn, varumärkesskydd? | ÖPPET — ÄGARSTEG | Inte kontrollerat. Blockerar riktig lansering, inte utveckling. |
| Slutlig logotyp, palett, typografi? | REKOMMENDATION | Arbetsversionen live (terrakotta/dämpad grön/benvit, Fraunces + DM Sans) följer handoffens riktning och behålls tills ägaren vill göra ett riktigt varumärkesarbete. |
| Namn med förklarande tillägg? | REKOMMENDATION | "Hemmakollen — din digitala hemmapartner." |

## 5. Organisation

Roller, budget och lanseringstid: ÖPPET — ÄGARSTEG.

## 6. Nya idéer från ägaren (1 oktober 2026)

| Idé | Status | Läge |
|---|---|---|
| AI-bot i chattruta på hemsidan som svarar på frågor om Hemmakollen och hushållsämnena | BESLUTAT — BYGGD 1/10 | Chattrutan ligger nere till höger på landningssidan och i appen. Kunskapsbas i `src/data/kunskap.ts` (enda källan), motor i `src/engine/chatt.ts` (13 tester), widget i `src/components/ChattRuta.tsx`. Svar från Claude (`claude-opus-5-5`, effort low, prompt-cache, server-side fallback) via Cloudflare Worker i `worker/chatt/` — nyckeln bor där, aldrig i klienten. Utan backend kör rutan en lokal FAQ-motor märkt "Demo". Hårda regler i systemprompten: estimat-inte-utfall, aldrig förmedla försäkring/lån, ersättning märks ut, lova inga olanserade funktioner, be aldrig om personnummer/kort. **Ägarsteg för skarpt läge:** se `worker/chatt/README.md` (Anthropic-nyckel, `wrangler deploy`, repo-variabel `VITE_CHATT_URL`, rate-limit-regel). |
| Grannhjälpen — välj syssla (rengöra sopkärl, skotta tomten, klippa häck …) och få hjälp av grannar via hemsidan | REKOMMENDATION — väntar ägar-ja (5/10) | Fullt beslutsunderlag i [`GRANNHJALPEN.md`](./GRANNHJALPEN.md). Kort: bygg **inte** ett eget grannnätverk med betalning mellan privatpersoner (hushållet blir arbetsgivare över 10 000 kr/år, ingen RUT, ingen försäkring, ingen intäkt). Bygg i stället **"Beställ hjälp"**: välj syssla i appen → förfrågan till 1–3 lokala RUT-företag eller en plattform av Yepstr-typ (anställda ungdomar i grannskapet) → hushållet betalar partnern direkt med RUT-avdrag, Hemmakollen tar leadersättning med samma transparensregel som övriga partners. Pengar går aldrig genom Hemmakollen. Tre steg V0 (lead) → V1 (plattformsintegration) → V2 (eget nätverk, bara om efterfrågan bevisats). Ägarbeslut som krävs: modell, efterfrågetest först (liten "Få hjälp"-knapp som bara mäter klick), startområde, sysslelista, plats i byggordningen (rekommenderat: efter påminnelser). Boten säger fortsatt "planerad" tills V0 finns. |

---

## Ägarsteg (blockerare — inget av detta kan göras av assistenten)

1. **Supabase**: skapa projekt, `supabase link` + `supabase db push` (två
   migrationer ligger redo), lägg `VITE_SUPABASE_URL` och
   `VITE_SUPABASE_ANON_KEY` som repo-secrets. Workflow-ändringen som läser in
   dem görs på beställning när nycklarna finns. Utan detta är sajten ren demo.
2. **Domän**: kontrollera/registrera hemmakollen.se (+ ev. .com) och besluta om
   repo-namnbyte `Hemma-Kollen` → `Hemmakollen` (ändrar Pages-URL:en).
3. **Varumärkeskoll**: namn-/varumärkesrisk, sociala användarnamn.
4. **Affiliatenätverk**: öppna konto (t.ex. det nätverk som täcker el/försäkring/
   mobil bäst) så platshållarlänkarna kan bytas mot riktiga tracking-länkar.
5. **Användarintervjuer**: 15–25 st enligt handoffens fas 0. Intervjuguide kan
   tas fram på beställning.
6. **Juridisk kartläggning**: GDPR-register, marknadsföringssamtycke,
   gränsdragning mot försäkringsdistribution/kreditförmedling.
7. **Grannhjälpen**: fatta de fem besluten i `GRANNHJALPEN.md` §7; välj
   startområde och sondera 2–3 lokala RUT-företag/partnerplattform.

## Nästa byggsteg (i ordning, efter ägar-ja per rad ovan)

0. ✅ Chattbot (1/10). Återstår ägarsteg: deploya workern + sätta `VITE_CHATT_URL`.

1. IA-justering: ekonomikärnan främst (nav + hemskärm), sysslor/inköp kvar men
   sekundärt.
2. Supabase-koppling i produktion + inbjudningsflöde för hushåll.
3. Påminnelser (avtalslut, sista uppsägningsdag, förfallodatum) med
   notisinställningar — handoffens MVP-kärna som ännu saknas.
4. PWA-manifest + installbarhet.
5. Verifierade marknadssnitt + riktiga partnerlänkar med ersättningsmärkning.
6. Grannhjälpen V0 "Beställ hjälp" (efter ägar-ja och minst två signerade
   partners). Efterfrågetestet (bara en knapp som mäter klick) kan läggas in
   tidigare på beställning.
