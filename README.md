# Hemma Kollen

Ett gemensamt nav för vardagen hemma. Hemma Kollen samlar räkningar, sysslor,
viktiga datum och möjliga besparingar i en lugn, mobilanpassad webbapp.

Webbversion: <https://stocker-niccolo.github.io/Hemma-Kollen/>

## Första versionen

- Hushållsöversikt med nästa räkning, veckans sysslor och besparingssignal.
- Räkningar med leverantör, belopp, förfallodatum och betalstatus.
- Delade sysslor med ansvarig, deadline och återkommande uppgifter.
- Formulär för manuell registrering direkt i gränssnittet.
- Lösenordsfri inloggning via säker engångslänk i mejl.
- Automatisk skapelse av första hushållet och live-synkning av formulär/status.
- Supabase-grund för konto, hushåll, medlemmar, räkningar och sysslor.
- RLS-policyer som begränsar all hushållsdata till dess medlemmar.
- Demo-läge utan miljövariabler.

Full produktspecifikation: [`SPEC.md`](./SPEC.md).

## Kom igång

```bash
nvm use 22
npm install
cp .env.example .env
npm run dev
```

Utan `.env` kör appen på lokal exempeldata. När ett Supabase-projekt är
anslutet används `VITE_SUPABASE_URL` och `VITE_SUPABASE_ANON_KEY`, och appen
visar inloggning samt läser och skriver hushållets data. Om databasen ännu inte
är migrerad faller gränssnittet tillbaka till ett tydligt märkt demoläge.

## Databasen

Den första migreringen finns i
[`supabase/migrations/20260813210000_initial_schema.sql`](./supabase/migrations/20260813210000_initial_schema.sql).
Den skapar:

- `profiles`
- `households`
- `household_members`
- `bills`
- `chores`
- medlems- och ägarstyrda RLS-policyer

Efter att Supabase CLI är installerat och kontot är anslutet:

```bash
supabase login
supabase link --project-ref <projekt-id>
supabase db push
```

## Kvalitetskontroller

```bash
npm run lint
npm test
npm run build
```

Samma kontroller körs i GitHub Actions för varje pull request och push till
`main`.

Produktionsbygget kompletteras automatiskt med en liten Worker-ingång och
hostingmetadata för OpenAI Sites. Appens vanliga Vite-utvecklingsflöde är
oförändrat.

## Viktiga produktprinciper

- Hemma Kollen ska kännas hjälpsam även utan ett partnererbjudande.
- Besparingar är alltid tydligt märkta som uppskattningar.
- Tjänsten jämför och länkar men ger inte egen försäkringsrådgivning.
- Minsta möjliga persondata lagras, och hushåll isoleras med RLS.
- Appen är fristående och delar inte kod med andra projekt.
