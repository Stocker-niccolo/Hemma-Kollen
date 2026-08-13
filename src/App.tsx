import { type FormEvent, useMemo, useState } from "react";
import { DEMO_AVTAL, DEMO_HUSHALL, DEMO_RAKNINGAR, DEMO_SYSSLOR } from "./data/demo";
import type { Rakning, Syssla, Vertikal } from "./domain/types";
import { beraknaBesparingar, totalArsbesparing } from "./engine/besparingar";
import { harSupabase } from "./lib/supabase";
import "./App.css";

type Vy = "oversikt" | "rakningar" | "sysslor";
type Formular = "rakning" | "syssla" | null;

const NU = new Date("2026-08-13T12:00:00+02:00");

const nav: Array<{ id: Vy; ikon: string; etikett: string }> = [
  { id: "oversikt", ikon: "⌂", etikett: "Översikt" },
  { id: "rakningar", ikon: "▤", etikett: "Räkningar" },
  { id: "sysslor", ikon: "✓", etikett: "Sysslor" },
];

function kronor(belopp: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(belopp);
}

function kortDatum(iso: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso.slice(0, 10)}T12:00:00`));
}

function dagarTill(iso: string) {
  const datum = new Date(`${iso.slice(0, 10)}T12:00:00+02:00`);
  return Math.ceil((datum.getTime() - NU.getTime()) / 86_400_000);
}

function forfallsText(iso: string) {
  const dagar = dagarTill(iso);
  if (dagar < 0) return `${Math.abs(dagar)} dagar sen`;
  if (dagar === 0) return "I dag";
  if (dagar === 1) return "I morgon";
  return `Om ${dagar} dagar`;
}

export default function App() {
  const [vy, setVy] = useState<Vy>("oversikt");
  const [formular, setFormular] = useState<Formular>(null);
  const [rakningar, setRakningar] = useState<Rakning[]>(DEMO_RAKNINGAR);
  const [sysslor, setSysslor] = useState<Syssla[]>(DEMO_SYSSLOR);
  const [notis, setNotis] = useState<string | null>(null);

  const forslag = useMemo(
    () => beraknaBesparingar(DEMO_AVTAL, rakningar, NU),
    [rakningar],
  );
  const obetalda = rakningar.filter((rakning) => !rakning.betald);
  const oppnaSysslor = sysslor.filter((syssla) => !syssla.klar);
  const nastaRakning = [...obetalda].sort((a, b) =>
    a.forfallodatum.localeCompare(b.forfallodatum),
  )[0];

  function bytVy(nyVy: Vy) {
    setVy(nyVy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function visaNotis(text: string) {
    setNotis(text);
    window.setTimeout(() => setNotis(null), 2800);
  }

  function markeraBetald(id: string) {
    setRakningar((nuvarande) =>
      nuvarande.map((rakning) =>
        rakning.id === id ? { ...rakning, betald: !rakning.betald } : rakning,
      ),
    );
  }

  function markeraSyssla(id: string) {
    setSysslor((nuvarande) =>
      nuvarande.map((syssla) =>
        syssla.id === id ? { ...syssla, klar: !syssla.klar } : syssla,
      ),
    );
  }

  function laggTillRakning(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ny: Rakning = {
      id: crypto.randomUUID(),
      hushallId: DEMO_HUSHALL,
      leverantor: String(data.get("leverantor")),
      belopp: Number(data.get("belopp")),
      forfallodatum: String(data.get("forfallodatum")),
      vertikal: String(data.get("kategori")) as Vertikal,
      betald: false,
      kalla: "manuell",
    };
    setRakningar((nuvarande) => [...nuvarande, ny]);
    setFormular(null);
    visaNotis("Räkningen är tillagd");
  }

  function laggTillSyssla(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ny: Syssla = {
      id: crypto.randomUUID(),
      hushallId: DEMO_HUSHALL,
      titel: String(data.get("titel")),
      ansvarig: String(data.get("ansvarig")),
      forfallodatum: String(data.get("forfallodatum")),
      kategori: "hem",
      klar: false,
    };
    setSysslor((nuvarande) => [...nuvarande, ny]);
    setFormular(null);
    visaNotis("Sysslan är tillagd");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Huvudmeny">
        <button className="brand" onClick={() => bytVy("oversikt")}>
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>Hemma Kollen</span>
        </button>

        <nav className="desktop-nav">
          {nav.map((item) => (
            <button
              key={item.id}
              className={vy === item.id ? "nav-item aktiv" : "nav-item"}
              onClick={() => bytVy(item.id)}
              aria-current={vy === item.id ? "page" : undefined}
            >
              <span aria-hidden="true">{item.ikon}</span>
              {item.etikett}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="household-switcher">
            <span className="avatar">NS</span>
            <span><strong>Familjen Stocker</strong><small>2 medlemmar</small></span>
            <span aria-hidden="true">⌄</span>
          </div>
          <div className="privacy-note">
            <span aria-hidden="true">●</span>
            Dina uppgifter stannar i hushållet.
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Torsdag 13 augusti</p>
            <h1>{vy === "oversikt" ? "Hej Niccolò!" : vy === "rakningar" ? "Räkningar" : "Sysslor"}</h1>
          </div>
          <div className="topbar-actions">
            {!harSupabase && <span className="demo-pill">Demo</span>}
            <button className="icon-button" aria-label="Notiser">♢<span className="notification-dot" /></button>
            <button className="invite-button" onClick={() => visaNotis("Inbjudningar öppnas när kontot är anslutet")}>+ Bjud in</button>
          </div>
        </header>

        {vy === "oversikt" && (
          <Overview
            nastaRakning={nastaRakning}
            obetalda={obetalda}
            oppnaSysslor={oppnaSysslor}
            sysslor={sysslor}
            forslag={forslag}
            onOpenForm={setFormular}
            onChangeView={bytVy}
            onToggleChore={markeraSyssla}
          />
        )}

        {vy === "rakningar" && (
          <Bills
            rakningar={rakningar}
            onToggle={markeraBetald}
            onAdd={() => setFormular("rakning")}
          />
        )}

        {vy === "sysslor" && (
          <Chores
            sysslor={sysslor}
            onToggle={markeraSyssla}
            onAdd={() => setFormular("syssla")}
          />
        )}
      </main>

      <nav className="mobile-nav" aria-label="Mobilmeny">
        {nav.map((item) => (
          <button key={item.id} className={vy === item.id ? "aktiv" : ""} onClick={() => bytVy(item.id)}>
            <span aria-hidden="true">{item.ikon}</span>{item.etikett}
          </button>
        ))}
      </nav>

      {formular && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setFormular(null)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" aria-label="Stäng" onClick={() => setFormular(null)}>×</button>
            <p className="eyebrow">Familjen Stocker</p>
            <h2 id="modal-title">{formular === "rakning" ? "Lägg till räkning" : "Ny syssla"}</h2>
            <p className="modal-intro">
              {formular === "rakning" ? "Fyll i det viktigaste nu. Du kan komplettera senare." : "Gör det tydligt vad som ska göras och vem som tar den."}
            </p>
            {formular === "rakning" ? (
              <BillForm onSubmit={laggTillRakning} />
            ) : (
              <ChoreForm onSubmit={laggTillSyssla} />
            )}
          </section>
        </div>
      )}

      {notis && <div className="toast" role="status">✓ {notis}</div>}
    </div>
  );
}

interface OverviewProps {
  nastaRakning?: Rakning;
  obetalda: Rakning[];
  oppnaSysslor: Syssla[];
  sysslor: Syssla[];
  forslag: ReturnType<typeof beraknaBesparingar>;
  onOpenForm: (form: Formular) => void;
  onChangeView: (view: Vy) => void;
  onToggleChore: (id: string) => void;
}

function Overview({ nastaRakning, obetalda, oppnaSysslor, sysslor, forslag, onOpenForm, onChangeView, onToggleChore }: OverviewProps) {
  const obetalt = obetalda.reduce((summa, rakning) => summa + rakning.belopp, 0);
  const klara = sysslor.length - oppnaSysslor.length;
  const framsteg = sysslor.length ? Math.round((klara / sysslor.length) * 100) : 0;

  return (
    <>
      <section className="welcome-card">
        <div className="welcome-copy">
          <span className="welcome-kicker">Läget hemma</span>
          <h2>Allt viktigt,<br />på ett ställe.</h2>
          <p>Ni har bra koll. En räkning förfaller snart och tre sysslor väntar den här veckan.</p>
          <div className="quick-actions">
            <button className="primary-button" onClick={() => onOpenForm("rakning")}>+ Lägg till räkning</button>
            <button className="secondary-button" onClick={() => onOpenForm("syssla")}>+ Ny syssla</button>
          </div>
        </div>
        <div className="home-illustration" aria-hidden="true">
          <div className="sun" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="house"><span className="roof" /><span className="door" /><span className="window" /></div>
          <div className="shrub shrub-one" /><div className="shrub shrub-two" />
        </div>
      </section>

      <section className="stats-grid" aria-label="Hushållets nuläge">
        <button className="stat-card" onClick={() => onChangeView("rakningar")}>
          <span className="stat-icon coral">▤</span>
          <span><small>Nästa räkning</small><strong>{nastaRakning ? kronor(nastaRakning.belopp) : "Klart"}</strong><em>{nastaRakning ? `${nastaRakning.leverantor} · ${kortDatum(nastaRakning.forfallodatum)}` : "Inget väntar"}</em></span>
          <span className="arrow">→</span>
        </button>
        <button className="stat-card" onClick={() => onChangeView("sysslor")}>
          <span className="stat-icon green">✓</span>
          <span><small>Sysslor kvar</small><strong>{oppnaSysslor.length} st</strong><em>{klara} av {sysslor.length} klara denna vecka</em></span>
          <span className="arrow">→</span>
        </button>
        <article className="stat-card">
          <span className="stat-icon gold">↗</span>
          <span><small>Möjlig besparing</small><strong>~{totalArsbesparing(forslag).toLocaleString("sv-SE")} kr</strong><em>per år · uppskattning</em></span>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="panel bills-panel">
          <div className="section-heading">
            <div><p className="eyebrow">Pengarna</p><h2>Kommande räkningar</h2></div>
            <button className="text-button" onClick={() => onChangeView("rakningar")}>Visa alla →</button>
          </div>
          <div className="bill-summary"><span>Obetalt denna månad</span><strong>{kronor(obetalt)}</strong></div>
          <div className="item-list">
            {obetalda.slice(0, 3).map((rakning) => (
              <div className="list-row" key={rakning.id}>
                <span className={`supplier-logo ${rakning.vertikal}`}>{rakning.leverantor.slice(0, 1)}</span>
                <span className="row-main"><strong>{rakning.leverantor}</strong><small>{forfallsText(rakning.forfallodatum)} · {kortDatum(rakning.forfallodatum)}</small></span>
                <strong>{kronor(rakning.belopp)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel chores-panel">
          <div className="section-heading">
            <div><p className="eyebrow">Att göra</p><h2>Veckans sysslor</h2></div>
            <button className="text-button" onClick={() => onChangeView("sysslor")}>Visa alla →</button>
          </div>
          <div className="progress-wrap">
            <span><strong>{klara} av {sysslor.length}</strong> klara</span><span>{framsteg}%</span>
            <div className="progress-track"><span style={{ width: `${framsteg}%` }} /></div>
          </div>
          <div className="item-list">
            {sysslor.slice(0, 4).map((syssla) => (
              <button className={syssla.klar ? "chore-row done" : "chore-row"} key={syssla.id} onClick={() => onToggleChore(syssla.id)}>
                <span className="checkmark">{syssla.klar ? "✓" : ""}</span>
                <span className="row-main"><strong>{syssla.titel}</strong><small>{syssla.ansvarig} · {kortDatum(syssla.forfallodatum)}</small></span>
              </button>
            ))}
          </div>
        </section>

        <section className="savings-card">
          <span className="savings-icon" aria-hidden="true">↗</span>
          <div>
            <p className="eyebrow">En smart koll</p>
            <h2>{forslag[0]?.rubrik ?? "Era kostnader ser bra ut"}</h2>
            <p>{forslag[0]?.anledning ?? "Vi fortsätter hålla koll och säger till när något förändras."}</p>
          </div>
          {forslag[0] && <a href={forslag[0].affiliateUrl} target="_blank" rel="noreferrer">Se jämförelsen →</a>}
          <small>Uppskattning baserad på generell marknadsdata. Hemma Kollen förmedlar inte avtal.</small>
        </section>
      </div>
    </>
  );
}

function Bills({ rakningar, onToggle, onAdd }: { rakningar: Rakning[]; onToggle: (id: string) => void; onAdd: () => void }) {
  const sorterade = [...rakningar].sort((a, b) => a.forfallodatum.localeCompare(b.forfallodatum));
  return (
    <section className="page-panel">
      <div className="page-intro"><div><p>Samla förfallodatum, belopp och betalstatus utan att leta i inkorgen.</p></div><button className="primary-button" onClick={onAdd}>+ Lägg till räkning</button></div>
      <div className="table-card">
        <div className="table-head"><span>Leverantör</span><span>Förfaller</span><span>Belopp</span><span>Status</span></div>
        {sorterade.map((rakning) => (
          <div className={rakning.betald ? "table-row paid" : "table-row"} key={rakning.id}>
            <span className="vendor-cell"><span className={`supplier-logo ${rakning.vertikal}`}>{rakning.leverantor.slice(0, 1)}</span><span><strong>{rakning.leverantor}</strong><small>{rakning.vertikal}</small></span></span>
            <span><small className="mobile-label">Förfaller</small>{kortDatum(rakning.forfallodatum)}</span>
            <strong><small className="mobile-label">Belopp</small>{kronor(rakning.belopp)}</strong>
            <button className={rakning.betald ? "status-button paid" : "status-button"} onClick={() => onToggle(rakning.id)}>{rakning.betald ? "✓ Betald" : "Markera betald"}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Chores({ sysslor, onToggle, onAdd }: { sysslor: Syssla[]; onToggle: (id: string) => void; onAdd: () => void }) {
  const personer = ["Alla", "Niccolò", "Anna"];
  const [filter, setFilter] = useState("Alla");
  const filtrerade = filter === "Alla" ? sysslor : sysslor.filter((syssla) => syssla.ansvarig === filter);
  return (
    <section className="page-panel">
      <div className="page-intro"><div><p>Fördela det som behöver göras och gör framstegen synliga för alla.</p><div className="filter-tabs">{personer.map((person) => <button key={person} className={filter === person ? "aktiv" : ""} onClick={() => setFilter(person)}>{person}</button>)}</div></div><button className="primary-button" onClick={onAdd}>+ Ny syssla</button></div>
      <div className="chore-grid">
        {filtrerade.map((syssla) => (
          <button className={syssla.klar ? "chore-card done" : "chore-card"} key={syssla.id} onClick={() => onToggle(syssla.id)}>
            <span className="large-check">{syssla.klar ? "✓" : ""}</span>
            <span><small>{syssla.kategori}</small><strong>{syssla.titel}</strong><em>{syssla.ansvarig} · {kortDatum(syssla.forfallodatum)}</em></span>
            {syssla.aterkommer && <span className="repeat-badge">↻ återkommer</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function BillForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Leverantör<input name="leverantor" placeholder="Till exempel Vattenfall" required /></label>
      <div className="form-row"><label>Belopp<input name="belopp" type="number" min="1" step="1" placeholder="0 kr" required /></label><label>Förfallodatum<input name="forfallodatum" type="date" required /></label></div>
      <label>Kategori<select name="kategori" defaultValue="el"><option value="el">El</option><option value="forsakring">Försäkring</option><option value="mobil">Mobil</option><option value="mat">Mat</option><option value="hantverk">Hem & hantverk</option></select></label>
      <button className="primary-button full" type="submit">Spara räkningen</button>
    </form>
  );
}

function ChoreForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Vad ska göras?<input name="titel" placeholder="Till exempel dammsuga" required /></label>
      <div className="form-row"><label>Ansvarig<select name="ansvarig" defaultValue="Niccolò"><option>Niccolò</option><option>Anna</option></select></label><label>Klart senast<input name="forfallodatum" type="date" required /></label></div>
      <button className="primary-button full" type="submit">Lägg till sysslan</button>
    </form>
  );
}
