import { useMemo } from "react";
import { beraknaBesparingar, totalArsbesparing } from "./engine/besparingar";
import { byggFridayEvent } from "./lib/friday";
import { harSupabase } from "./lib/supabase";
import { DEMO_AVTAL, DEMO_HUSHALL, DEMO_RAKNINGAR } from "./data/demo";
import "./App.css";

// MVP-yta: besparings-motorn synlig. Kör på demo-data tills Supabase är kopplat.
// "Nu" injiceras (ej Date.now i motorn) — här sätter vi dagens datum för UI.
const NU = new Date();

export default function App() {
  const forslag = useMemo(
    () => beraknaBesparingar(DEMO_AVTAL, DEMO_RAKNINGAR, NU),
    [],
  );
  const total = totalArsbesparing(forslag);
  const obetalda = DEMO_RAKNINGAR.filter((r) => !r.betald);
  const fridayEvent = useMemo(
    () => byggFridayEvent(DEMO_HUSHALL, DEMO_RAKNINGAR, forslag),
    [forslag],
  );

  return (
    <main className="wrap">
      <header className="topp">
        <h1>Hemkoll</h1>
        <p className="tagline">Koll på hushållet — och pengarna.</p>
        {!harSupabase && (
          <span className="demo-badge">Demo-läge (ingen backend kopplad)</span>
        )}
      </header>

      <section className="hero-kort">
        <div className="hero-siffra">
          <span className="belopp">~{total.toLocaleString("sv-SE")} kr</span>
          <span className="etikett">uppskattad besparing per år · estimat</span>
        </div>
        <div className="hero-meta">
          <div>
            <strong>{obetalda.length}</strong> obetalda räkningar
          </div>
          <div>
            <strong>{forslag.length}</strong> bytesmöjligheter hittade
          </div>
        </div>
      </section>

      <section>
        <h2>Besparingar</h2>
        <ul className="lista">
          {forslag.map((f) => (
            <li key={f.vertikal} className="kort">
              <div className="kort-topp">
                <span className={`taggen v-${f.vertikal}`}>{f.vertikal}</span>
                {f.arsbesparingKr > 0 && (
                  <span className="spar">
                    ~{f.arsbesparingKr.toLocaleString("sv-SE")} kr/år
                  </span>
                )}
              </div>
              <h3>{f.rubrik}</h3>
              <p className="rad">
                <span className="dim">Nu:</span> {f.nuvarande}
              </p>
              <p className="rad">
                <span className="dim">Alternativ:</span> {f.alternativ}
              </p>
              <p className="anledning">{f.anledning}</p>
              <a
                className="cta"
                href={f.affiliateUrl}
                target="_blank"
                rel="noreferrer"
              >
                Jämför alternativ →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Obetalda räkningar</h2>
        <ul className="lista rak">
          {obetalda.map((r) => (
            <li key={r.id} className="rakning">
              <span>{r.leverantor}</span>
              <span className="dim">
                förfaller {r.forfallodatum.slice(0, 10)}
              </span>
              <span className="belopp-liten">{r.belopp} kr</span>
            </li>
          ))}
        </ul>
      </section>

      <details className="friday">
        <summary>FRIDAY-event (skickas till navet)</summary>
        <pre>{JSON.stringify(fridayEvent, null, 2)}</pre>
      </details>
    </main>
  );
}
