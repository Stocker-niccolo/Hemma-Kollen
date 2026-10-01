// Hemmakollen chatt-worker (Cloudflare Workers). Tar emot historiken från
// ChattRuta, lägger på systemprompten ur kunskapsbasen och streamar Claudes
// svar tillbaka som ren text. API-nyckeln bor här, aldrig i klienten.
//
// Kunskap och validering delas med klienten via ../../src (samma repo).

import Anthropic from "@anthropic-ai/sdk";
import { byggSystemPrompt, valideraHistorik } from "../../../src/engine/chatt";

interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGINS?: string;
}

const MODEL = "claude-opus-5-5";
// Byggs en gång per isolat — deterministisk, så prompt-cachen träffar.
const SYSTEM = byggSystemPrompt();

function corsHeaders(origin: string | null, env: Env): HeadersInit {
  const tillatna = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  const ok = origin && tillatna.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : tillatna[0] ?? "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function svar(body: string, status: number, headers: HeadersInit): Response {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", ...headers } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return svar("Endast POST.", 405, cors);

    const tillatna = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim());
    if (origin && !tillatna.includes(origin)) return svar("Otillåten origin.", 403, cors);
    if (!env.ANTHROPIC_API_KEY) return svar("Chatten är inte konfigurerad.", 503, cors);

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return svar("Ogiltig JSON.", 400, cors);
    }
    const historik = valideraHistorik((payload as { meddelanden?: unknown })?.meddelanden);
    if (!historik) return svar("Ogiltig historik.", 400, cors);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1 });
    const messages: Anthropic.MessageParam[] = historik.map((m) => ({ role: m.roll, content: m.text }));

    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 1024, // avsiktligt korta chattsvar (1–4 meningar)
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" }, // chatt: snabbt och billigt
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    });

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    const enc = new TextEncoder();

    (async () => {
      let skrivet = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            skrivet = true;
            await writer.write(enc.encode(event.delta.text));
          }
        }
        const slut = await stream.finalMessage();
        if (slut.stop_reason === "refusal" && !skrivet) {
          await writer.write(enc.encode("Det där kan jag tyvärr inte hjälpa till med. Fråga gärna om Hemmakollen eller hushållets avtal och kostnader."));
        }
      } catch (error) {
        console.error("[chatt] Claude-fel", error instanceof Error ? error.message : error);
        if (!skrivet) {
          await writer.write(enc.encode("Något gick fel när jag skulle svara. Prova igen om en liten stund."));
        }
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...cors,
      },
    });
  },
} satisfies ExportedHandler<Env>;
