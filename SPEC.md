# Hemkoll — Spec (arbetsnamn)

> Hushållsassistent för svenska hem. Organiserar hushållet (listor, räkningar,
> sysslor, familjedelning + Swish) — och tjänar pengar på en **proaktiv
> besparings-motor** som ser i hushållsdatan när det lönar sig att byta
> el/försäkring/mobil och knuffar användaren i rätt sekund.

Eget bolag / eget repo. **Delar INGEN kod med Projekt B (gym-social).**

---

## Affärsmodellen (var pengarna finns)

Beprövad svensk modell (Compricer/Elskling/Zmarta/Sambla) men **proaktiv** i
stället för passiv: appen ser datan och föreslår bytet vid rätt tillfälle.

| Vertikal | Trigger | Intäkt |
|----------|---------|--------|
| Elavtal | Räkning ↑ el. avtal löper ut | Affiliate/lead → elleverantör |
| Försäkring | Premie över marknadssnitt | Lead → jämförare (ej egen förmedling) |
| Mobil | Bindningstid går ut | Affiliate → operatör |
| Mat | Handlingsmönster (mkt ICA) | Matkasse/cashback/affiliate |
| Hantverkare | "X är trasig" | Lead säljs (Offerta-modell) |

**Fas 1:** koppla på *befintliga* affiliate-program (Adtraction/Adservice) —
ingen egen partner-deal krävs för att börja tjäna.
**Fas 2:** egna direktavtal när volym finns → bättre marginal.

### ⚠️ Regulatorisk linje (design-in från dag 1)
- **Vi förmedlar INTE försäkring** (undviker Finansinspektionens
  förmedlingsregler). Vi **jämför och länkar** till licensierade parter —
  precis som Compricer.
- Håll all copy på jämför-sidan av linjen. Aldrig "vi rekommenderar", alltid
  "vi hittade ett alternativ hos X".

---

## Datakälla (det verkligt svåra)

Hela värdet kräver att motorn *ser* räkningarna. Startordning:

1. **Mejl-forwarding + OCR** ← MVP. Användaren vidarebefordrar räkningar till en
   inbox, vi läser av belopp + förfallodag + leverantör. Ingen partner behövs.
2. **Manuell inmatning** — fallback, ger data direkt.
3. **Open Banking (Tink/GoCardless)** — fas 2, transaktionsdata, kräver
   licensierad leverantör + samtycke.
4. **Kivra** — rätt guldgruva men inget öppet konsument-API. Bevakas.

---

## Swish

Inget officiellt API för privatpersons-Swish. Vi kör **Swish-deep-links**:
appen skapar en färdig betalning (belopp + nummer + meddelande), knuffar till
Swish-appen. Ingen auto-bekräftelse → "markera som betald" + påminnelser.
Riktig Swish Handel (auto-bekräftat) kräver org.nr — flaggat, ej i MVP.

---

## MVP-scope

**Hjärta = besparings-motorn** (el + försäkring först). Byggs innan
organizer-ytan.

1. Hushåll + medlemmar (auth, delning)
2. Räkningar in (mejl-forward/OCR → manuell fallback)
3. Besparings-motor: regelmotor som flaggar bytesmöjligheter + affiliate-länk
4. FRIDAY-notis: "3 obetalda räkningar + 1 besparing (~4 000 kr/år) denna vecka"

**Fas 2:** delade listor (handling/sysslor), Swish-uppdelning, geofencing ej
relevant här, Open Banking, fler vertikaler.

---

## Stack
- Vite + React + TypeScript
- Supabase (auth, Postgres, realtid, RLS för familjedelning)
- Besparings-motor = rena TS-funktioner (testbara, inga sidoeffekter)
- FRIDAY-brygga = outbound (appen → FRIDAY-navet), alt. 3 i FRIDAY-modellen

## FRIDAY-koppling (alt. 3 — fristående, pratar med navet)
Appen POST:ar events till FRIDAY (obetalda räkningar, nya besparingar) som dyker
upp i morgonbriefen. Enkelriktat ut. Ingen delad kod med FRIDAY-repot.
