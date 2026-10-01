// Flytande chattruta nere till höger. Finns på landningssidan och i appen.
// Svaren kommer från Claude via worker/chatt, eller från den lokala
// FAQ-motorn när ingen backend är konfigurerad (märks med "Demo").

import { type FormEvent, useEffect, useRef, useState } from "react";
import { FORSLAG_FRAGOR } from "../data/kunskap";
import type { ChattMeddelande } from "../engine/chatt";
import { harChattBackend, skickaTillBot } from "../lib/chatt";

const HALSNING =
  "Hej! Jag är CasaVitas assistent. Fråga mig om appen eller om hushållets avtal, räkningar och kostnader.";

const FEL_SVAR = "Något gick fel när jag skulle svara. Prova igen om en liten stund.";

export default function ChattRuta() {
  const [oppen, setOppen] = useState(false);
  const [text, setText] = useState("");
  const [historik, setHistorik] = useState<ChattMeddelande[]>([]);
  const [skriver, setSkriver] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!oppen) return;
    inputRef.current?.focus();
  }, [oppen]);

  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [historik, skriver]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function fraga(fragaText: string) {
    const rensad = fragaText.trim();
    if (!rensad || skriver) return;
    setText("");

    const nyHistorik: ChattMeddelande[] = [...historik, { roll: "user", text: rensad }];
    setHistorik([...nyHistorik, { roll: "assistant", text: "" }]);
    setSkriver(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await skickaTillBot(
        nyHistorik,
        (bit) => {
          setHistorik((nuvarande) => {
            const kopia = nuvarande.slice();
            const sista = kopia[kopia.length - 1];
            kopia[kopia.length - 1] = { roll: "assistant", text: sista.text + bit };
            return kopia;
          });
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("[chatt] fel", error);
        setHistorik((nuvarande) => {
          const kopia = nuvarande.slice();
          kopia[kopia.length - 1] = { roll: "assistant", text: FEL_SVAR };
          return kopia;
        });
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setSkriver(false);
    }
  }

  function skicka(event: FormEvent) {
    event.preventDefault();
    void fraga(text);
  }

  return (
    <div className={`chatt ${oppen ? "oppen" : ""}`}>
      {oppen && (
        <section className="chatt-panel" aria-label="Chatt med CasaVita">
          <header className="chatt-header">
            <span className="brand-mark" aria-hidden="true">C</span>
            <div>
              <strong>CasaVita-assistenten</strong>
              <small>{harChattBackend ? "Svarar direkt · svenska" : "Demo · svarar på vanliga frågor"}</small>
            </div>
            <button className="chatt-close" onClick={() => setOppen(false)} aria-label="Stäng chatten">×</button>
          </header>

          <div className="chatt-lista" ref={listaRef}>
            <div className="chatt-bubbla bot">{HALSNING}</div>
            {historik.map((m, i) => (
              <div key={i} className={`chatt-bubbla ${m.roll === "user" ? "jag" : "bot"}`}>
                {m.text || (skriver && i === historik.length - 1 ? <span className="chatt-prick" aria-label="Skriver" /> : "")}
              </div>
            ))}
            {historik.length === 0 && (
              <div className="chatt-forslag" aria-label="Förslag på frågor">
                {FORSLAG_FRAGOR.map((f) => (
                  <button key={f} type="button" onClick={() => void fraga(f)}>{f}</button>
                ))}
              </div>
            )}
          </div>

          <form className="chatt-form" onSubmit={skicka}>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv din fråga…"
              maxLength={2000}
              aria-label="Din fråga"
              autoComplete="off"
            />
            <button type="submit" disabled={skriver || !text.trim()} aria-label="Skicka">↑</button>
          </form>
          <small className="chatt-fotnot">
            Allmän vägledning, inte personlig rådgivning. Belopp är uppskattningar. Skriv inte personnummer eller kortuppgifter.
          </small>
        </section>
      )}

      <button
        className="chatt-knapp"
        onClick={() => setOppen((o) => !o)}
        aria-expanded={oppen}
        aria-label={oppen ? "Stäng chatten" : "Öppna chatten"}
      >
        {oppen ? "×" : <><span aria-hidden="true">💬</span> Fråga CasaVita</>}
      </button>
    </div>
  );
}
