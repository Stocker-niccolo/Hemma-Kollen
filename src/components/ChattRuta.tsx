// Hemmakollen-assistenten — inbyggd chattyta på Översikten (under "Allt viktigt,
// på ett ställe"), byggd som ett ChatGPT/Claude-fönster: tom vy med stor
// skrivruta och förslag, sedan konversation ovanför skrivrutan.
// Svaren kommer från Claude via worker/chatt, eller från den lokala
// FAQ-motorn när ingen backend är konfigurerad (märks "Demo").

import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { FORSLAG_FRAGOR } from "../data/kunskap";
import type { ChattMeddelande } from "../engine/chatt";
import { harChattBackend, skickaTillBot } from "../lib/chatt";

const FEL_SVAR = "Något gick fel när jag skulle svara. Prova igen om en liten stund.";

export default function ChattRuta() {
  const [text, setText] = useState("");
  const [historik, setHistorik] = useState<ChattMeddelande[]>([]);
  const [skriver, setSkriver] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [historik, skriver]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function justeraHojd() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  function uppdateraSista(text: string, laggTill: boolean) {
    setHistorik((nuvarande) => {
      const kopia = nuvarande.slice();
      const sista = kopia[kopia.length - 1];
      kopia[kopia.length - 1] = { roll: "assistant", text: laggTill ? sista.text + text : text };
      return kopia;
    });
  }

  async function fraga(fragaText: string) {
    const rensad = fragaText.trim();
    if (!rensad || skriver) return;
    setText("");
    requestAnimationFrame(justeraHojd);

    const nyHistorik: ChattMeddelande[] = [...historik, { roll: "user", text: rensad }];
    setHistorik([...nyHistorik, { roll: "assistant", text: "" }]);
    setSkriver(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await skickaTillBot(nyHistorik, (bit) => uppdateraSista(bit, true), controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("[chatt] fel", error);
        uppdateraSista(FEL_SVAR, false);
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setSkriver(false);
      inputRef.current?.focus();
    }
  }

  function skicka(event: FormEvent) {
    event.preventDefault();
    void fraga(text);
  }

  function tangent(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void fraga(text);
    }
  }

  function nyChatt() {
    abortRef.current?.abort();
    setHistorik([]);
    setText("");
    setSkriver(false);
    inputRef.current?.focus();
  }

  const tom = historik.length === 0;

  const composer = (
    <form className="chatt-composer" onSubmit={skicka}>
      <textarea
        ref={inputRef}
        value={text}
        rows={1}
        onChange={(e) => {
          setText(e.target.value);
          justeraHojd();
        }}
        onKeyDown={tangent}
        placeholder="Fråga om elavtal, försäkring, räkningar, uppsägning – eller om Hemmakollen…"
        maxLength={2000}
        aria-label="Din fråga"
      />
      <button type="submit" disabled={skriver || !text.trim()} aria-label="Skicka">↑</button>
    </form>
  );

  return (
    <section className={`panel chatt-panel ${tom ? "tom" : ""}`} aria-label="Hemmakollen-assistenten">
      <header className="chatt-topp">
        <div className="chatt-titel">
          <span className="brand-mark" aria-hidden="true">H</span>
          <div>
            <strong>Hemmakollen-assistenten</strong>
            <small>{harChattBackend ? "Svarar på dina frågor om hemmet och appen" : "Demo · svarar på vanliga frågor"}</small>
          </div>
        </div>
        {!tom && (
          <button type="button" className="text-button" onClick={nyChatt}>+ Ny chatt</button>
        )}
      </header>

      {tom ? (
        <div className="chatt-tomvy">
          <h2>Vad kan jag hjälpa till med?</h2>
          <p>Ställ en fråga om hushållets avtal och kostnader, eller om hur Hemmakollen fungerar.</p>
          {composer}
          <div className="chatt-forslag" aria-label="Förslag på frågor">
            {FORSLAG_FRAGOR.map((f) => (
              <button key={f} type="button" onClick={() => void fraga(f)}>{f}</button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="chatt-lista" ref={listaRef}>
            {historik.map((m, i) => (
              <div key={i} className={`chatt-rad ${m.roll === "user" ? "jag" : "bot"}`}>
                {m.roll === "assistant" && <span className="chatt-avatar" aria-hidden="true">H</span>}
                <div className="chatt-bubbla">
                  {m.text || (skriver && i === historik.length - 1 ? <span className="chatt-prick" aria-label="Skriver" /> : "")}
                </div>
              </div>
            ))}
          </div>
          {composer}
        </>
      )}

      <small className="chatt-fotnot">
        Allmän vägledning, inte personlig rådgivning. Belopp är uppskattningar. Skriv inte personnummer eller kortuppgifter.
      </small>
    </section>
  );
}
