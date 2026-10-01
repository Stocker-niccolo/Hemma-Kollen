# Hemmakollen chatt-worker

Liten Cloudflare Worker som håller Anthropic-nyckeln och streamar Claudes svar
till chattrutan på hemsidan. Kunskapsbasen och valideringen delas med klienten
(`src/data/kunskap.ts`, `src/engine/chatt.ts`) — ändra där, inte här.

## Ägarsteg (en gång)

```bash
cd worker/chatt
npm install
npx wrangler login                       # privat Cloudflare-konto
npx wrangler secret put ANTHROPIC_API_KEY   # klistra in nyckeln (console.anthropic.com)
npm run deploy                           # ger en URL: https://hemmakollen-chatt.<konto>.workers.dev
```

Lägg sedan URL:en som **repo-variabel** `VITE_CHATT_URL` i GitHub
(Settings → Secrets and variables → Actions → Variables). Pages-bygget läser den
och chattrutan går från "Demo" till riktiga svar. Lokalt: `VITE_CHATT_URL=…` i `.env`.

När hemmakollen.se finns: lägg till domänen i `ALLOWED_ORIGINS` i `wrangler.toml`
och deploya om.

## Skydd

- Origin-kontroll (`ALLOWED_ORIGINS`), max 12 turer × 2000 tecken, korta svar
  (`max_tokens` 1024), effort `low`, prompt-cache på systemprompten.
- Rekommenderat ägarsteg: en Cloudflare **Rate limiting rule** på workerns
  route (t.ex. 20 anrop/minut per IP) så ingen kan tömma API-budgeten.
- Sätt en månadsgräns på nyckeln i Anthropic-konsolen.

## Lokalt

```bash
echo 'ANTHROPIC_API_KEY=sk-ant-…' > .dev.vars   # gitignorerad
npm run dev                                     # http://localhost:8787
```
