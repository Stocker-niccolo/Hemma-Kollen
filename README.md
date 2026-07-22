# Hemkoll (arbetsnamn)

Hushållsassistent för svenska hem. Organiserar hushållet (räkningar, listor,
sysslor, familjedelning + Swish) och tjänar pengar på en **proaktiv
besparings-motor** som ser i hushållsdatan när det lönar sig att byta
el/försäkring/mobil — och knuffar användaren i rätt sekund.

Eget bolag / eget repo. **Delar ingen kod med Projekt B (gym-social).**

Full spec: [`SPEC.md`](./SPEC.md).

## Kom igång

    nvm use 22          # eller senare
    npm install
    cp .env.example .env   # fyll i Supabase + FRIDAY-webhook (valfritt)
    npm run dev

Utan `.env` kör appen i **demo-läge** på exempeldata — motorn syns direkt.

## Kommandon

| Kommando | Gör |
|----------|-----|
| `npm run dev` | Startar dev-servern |
| `npm test` | Kör besparings-motorns tester (vitest) |
| `npm run build` | Typecheck + produktionsbygge |

## Arkitektur

    src/
      domain/types.ts        Domänmodell (Hushåll, Avtal, Räkning, Förslag)
      data/marknadssnitt.ts  Riktmärken att jämföra mot (ESTIMAT — verifiera)
      data/demo.ts           Exempeldata för demo-läge
      engine/besparingar.ts  Hjärtat: ren regelmotor, inga sidoeffekter
      lib/supabase.ts        Auth/DB/realtid (no-op utan env)
      lib/friday.ts          Brygga -> FRIDAY-navet (enkelriktat ut)
      App.tsx                MVP-yta: besparings-dashboard

## Status

- [x] Repo + stack (Vite + React + TS + Supabase)
- [x] Besparings-motor (kostnad, bindning, ökning) + 10 tester
- [x] FRIDAY-brygga (event-payload klar)
- [x] Demo-dashboard
- [ ] Supabase-schema + RLS för familjedelning
- [ ] Räkning-in: mejl-forward + OCR
- [ ] Riktiga affiliate-länkar (Adtraction/Adservice)
- [ ] Swish deep-links för räkningsuppdelning
- [ ] Organizer-ytan (listor/sysslor) - fas 2

## Viktiga principer

- **Ärlighet i copy:** besparingar är märkta *estimat*, aldrig utfall. Vi
  jämför och länkar - förmedlar aldrig försäkring själva (undviker FI-regler).
- **Motorn är ren:** ingen Date.now() inuti - `nu` skickas in. Testbart.
