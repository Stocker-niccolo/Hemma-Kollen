# CasaVita — beslutsliggare och nästa steg

Uppdaterad: 31 augusti 2026. Kompletterar [`HANDOFF.md`](./HANDOFF.md) (styrande)
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
| CasaVita slutligt namn? | BESLUTAT | Bekräftat av ägaren 27 juli 2026. Klient, metadata och dokumentation bär namnet sedan 31 augusti. |
| Domän, sociala namn, varumärkesskydd? | ÖPPET — ÄGARSTEG | Inte kontrollerat. Blockerar riktig lansering, inte utveckling. |
| Slutlig logotyp, palett, typografi? | REKOMMENDATION | Arbetsversionen live (terrakotta/dämpad grön/benvit, Fraunces + DM Sans) följer handoffens riktning och behålls tills ägaren vill göra ett riktigt varumärkesarbete. |
| Namn med förklarande tillägg? | REKOMMENDATION | "CasaVita — din digitala hemmapartner." |

## 5. Organisation

Roller, budget och lanseringstid: ÖPPET — ÄGARSTEG.

---

## Ägarsteg (blockerare — inget av detta kan göras av assistenten)

1. **Supabase**: skapa projekt, `supabase link` + `supabase db push` (två
   migrationer ligger redo), lägg `VITE_SUPABASE_URL` och
   `VITE_SUPABASE_ANON_KEY` som repo-secrets. Workflow-ändringen som läser in
   dem görs på beställning när nycklarna finns. Utan detta är sajten ren demo.
2. **Domän**: kontrollera/registrera casavita.se (+ ev. .com) och besluta om
   repo-namnbyte `Hemma-Kollen` → `CasaVita` (ändrar Pages-URL:en).
3. **Varumärkeskoll**: namn-/varumärkesrisk, sociala användarnamn.
4. **Affiliatenätverk**: öppna konto (t.ex. det nätverk som täcker el/försäkring/
   mobil bäst) så platshållarlänkarna kan bytas mot riktiga tracking-länkar.
5. **Användarintervjuer**: 15–25 st enligt handoffens fas 0. Intervjuguide kan
   tas fram på beställning.
6. **Juridisk kartläggning**: GDPR-register, marknadsföringssamtycke,
   gränsdragning mot försäkringsdistribution/kreditförmedling.

## Nästa byggsteg (i ordning, efter ägar-ja per rad ovan)

1. IA-justering: ekonomikärnan främst (nav + hemskärm), sysslor/inköp kvar men
   sekundärt.
2. Supabase-koppling i produktion + inbjudningsflöde för hushåll.
3. Påminnelser (avtalslut, sista uppsägningsdag, förfallodatum) med
   notisinställningar — handoffens MVP-kärna som ännu saknas.
4. PWA-manifest + installbarhet.
5. Verifierade marknadssnitt + riktiga partnerlänkar med ersättningsmärkning.
