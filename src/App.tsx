import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  DEMO_AVTAL,
  DEMO_HUSHALL,
  DEMO_HUSHALLSAVTAL,
  DEMO_INKOP,
  DEMO_RAKNINGAR,
  DEMO_SYSSLOR,
} from "./data/demo";
import type {
  Avtalskategori,
  Hushallsavtal,
  Inkopskategori,
  Inkopsvara,
  Rakning,
  Syssla,
  Vertikal,
} from "./domain/types";
import { beraknaBesparingar, totalArsbesparing } from "./engine/besparingar";
import {
  hamtaEllerSkapaHushall,
  hamtaHushallsavtal,
  hamtaInkop,
  hamtaRakningar,
  hamtaSysslor,
  sattInkopsvaraKopd,
  sattRakningBetald,
  sattSysslaKlar,
  skapaHushallsavtal,
  skapaInkopsvara,
  skapaRakning,
  skapaSyssla,
} from "./lib/database";
import { harSupabase, loggaInMedEpost, loggaUt, supabase } from "./lib/supabase";
import "./App.css";

type Vy = "oversikt" | "rakningar" | "sysslor" | "inkop" | "avtal";
type Formular = "rakning" | "syssla" | "inkop" | "avtal" | null;
type DataKalla = "demo" | "synkar" | "live";

const NU = new Date();

const nav: Array<{ id: Vy; ikon: string; etikett: string }> = [
  { id: "oversikt", ikon: "⌂", etikett: "Översikt" },
  { id: "rakningar", ikon: "▤", etikett: "Räkningar" },
  { id: "sysslor", ikon: "✓", etikett: "Sysslor" },
  { id: "inkop", ikon: "◌", etikett: "Inköp" },
  { id: "avtal", ikon: "◇", etikett: "Avtal" },
];

const vyRubriker: Record<Vy, string> = {
  oversikt: "",
  rakningar: "Räkningar",
  sysslor: "Sysslor",
  inkop: "Inköp",
  avtal: "Avtal & abonnemang",
};

const avtalskategorier: Record<Avtalskategori, { etikett: string; ikon: string }> = {
  forsakring: { etikett: "Försäkringar", ikon: "▣" },
  bredband: { etikett: "Bredband", ikon: "⌁" },
  streaming_tv: { etikett: "Streaming & TV", ikon: "▻" },
  mobil: { etikett: "Mobil", ikon: "▯" },
  el: { etikett: "El", ikon: "ϟ" },
  vatten: { etikett: "Vatten", ikon: "◒" },
  gym: { etikett: "Gym", ikon: "↔" },
};

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

function dagensRubrik() {
  const text = new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(NU);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function App() {
  const [vy, setVy] = useState<Vy>("oversikt");
  const [formular, setFormular] = useState<Formular>(null);
  const [rakningar, setRakningar] = useState<Rakning[]>(harSupabase ? [] : DEMO_RAKNINGAR);
  const [sysslor, setSysslor] = useState<Syssla[]>(harSupabase ? [] : DEMO_SYSSLOR);
  const [inkop, setInkop] = useState<Inkopsvara[]>(harSupabase ? [] : DEMO_INKOP);
  const [hushallsavtal, setHushallsavtal] = useState<Hushallsavtal[]>(harSupabase ? [] : DEMO_HUSHALLSAVTAL);
  const [notis, setNotis] = useState<string | null>(null);
  const [authKontrollerad, setAuthKontrollerad] = useState(!harSupabase);
  const [anvandarId, setAnvandarId] = useState<string | null>(null);
  const [visningsnamn, setVisningsnamn] = useState("Niccolò");
  const [hushallId, setHushallId] = useState(harSupabase ? "" : DEMO_HUSHALL);
  const [hushallsnamn, setHushallsnamn] = useState("Familjen Stocker");
  const [dataKalla, setDataKalla] = useState<DataKalla>(harSupabase ? "synkar" : "demo");

  useEffect(() => {
    const klient = supabase;
    if (!klient) return;

    let aktiv = true;
    void klient.auth.getSession().then(({ data }) => {
      if (!aktiv) return;
      const anvandare = data.session?.user;
      setAnvandarId(anvandare?.id ?? null);
      setVisningsnamn(
        String(anvandare?.user_metadata.display_name ?? anvandare?.email?.split("@")[0] ?? "hemma"),
      );
      setAuthKontrollerad(true);
    });

    const { data } = klient.auth.onAuthStateChange((_handelse, session) => {
      const anvandare = session?.user;
      setAnvandarId(anvandare?.id ?? null);
      setVisningsnamn(
        String(anvandare?.user_metadata.display_name ?? anvandare?.email?.split("@")[0] ?? "hemma"),
      );
      setAuthKontrollerad(true);
    });

    return () => {
      aktiv = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!harSupabase || !anvandarId) return;
    let aktiv = true;
    setDataKalla("synkar");

    void (async () => {
      try {
        const hushall = await hamtaEllerSkapaHushall(anvandarId);
        const [nyaRakningar, nyaSysslor, nyaInkop, nyaHushallsavtal] = await Promise.all([
          hamtaRakningar(hushall.id),
          hamtaSysslor(hushall.id),
          hamtaInkop(hushall.id),
          hamtaHushallsavtal(hushall.id),
        ]);
        if (!aktiv) return;
        setHushallId(hushall.id);
        setHushallsnamn(hushall.namn);
        setRakningar(nyaRakningar);
        setSysslor(nyaSysslor);
        setInkop(nyaInkop);
        setHushallsavtal(nyaHushallsavtal);
        setDataKalla("live");
      } catch (error) {
        console.error("Kunde inte synka hushållet", error);
        if (!aktiv) return;
        setHushallId(DEMO_HUSHALL);
        setHushallsnamn("Familjen Stocker");
        setRakningar(DEMO_RAKNINGAR);
        setSysslor(DEMO_SYSSLOR);
        setInkop(DEMO_INKOP);
        setHushallsavtal(DEMO_HUSHALLSAVTAL);
        setDataKalla("demo");
        visaNotis("Databasen är inte redo ännu — visar demo");
      }
    })();

    return () => {
      aktiv = false;
    };
  }, [anvandarId]);

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

  async function markeraBetald(id: string) {
    const befintlig = rakningar.find((rakning) => rakning.id === id);
    if (!befintlig) return;
    const betald = !befintlig.betald;
    setRakningar((nuvarande) =>
      nuvarande.map((rakning) =>
        rakning.id === id ? { ...rakning, betald } : rakning,
      ),
    );
    if (dataKalla !== "live") return;
    try {
      await sattRakningBetald(id, betald);
    } catch (error) {
      console.error("Kunde inte uppdatera räkningen", error);
      setRakningar((nuvarande) =>
        nuvarande.map((rakning) =>
          rakning.id === id ? { ...rakning, betald: befintlig.betald } : rakning,
        ),
      );
      visaNotis("Kunde inte spara ändringen");
    }
  }

  async function markeraSyssla(id: string) {
    const befintlig = sysslor.find((syssla) => syssla.id === id);
    if (!befintlig) return;
    const klar = !befintlig.klar;
    setSysslor((nuvarande) =>
      nuvarande.map((syssla) =>
        syssla.id === id ? { ...syssla, klar } : syssla,
      ),
    );
    if (dataKalla !== "live") return;
    try {
      await sattSysslaKlar(id, klar);
    } catch (error) {
      console.error("Kunde inte uppdatera sysslan", error);
      setSysslor((nuvarande) =>
        nuvarande.map((syssla) =>
          syssla.id === id ? { ...syssla, klar: befintlig.klar } : syssla,
        ),
      );
      visaNotis("Kunde inte spara ändringen");
    }
  }

  async function markeraInkopsvara(id: string) {
    const befintlig = inkop.find((vara) => vara.id === id);
    if (!befintlig) return;
    const kopd = !befintlig.kopd;
    setInkop((nuvarande) =>
      nuvarande.map((vara) => vara.id === id ? { ...vara, kopd } : vara),
    );
    if (dataKalla !== "live") return;
    try {
      await sattInkopsvaraKopd(id, kopd);
    } catch (error) {
      console.error("Kunde inte uppdatera inköpsvaran", error);
      setInkop((nuvarande) =>
        nuvarande.map((vara) => vara.id === id ? { ...vara, kopd: befintlig.kopd } : vara),
      );
      visaNotis("Kunde inte spara ändringen");
    }
  }

  async function laggTillRakning(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const innehall = {
      leverantor: String(data.get("leverantor")),
      belopp: Number(data.get("belopp")),
      forfallodatum: String(data.get("forfallodatum")),
      vertikal: String(data.get("kategori")) as Vertikal,
      kalla: "manuell" as const,
    };
    try {
      const ny = dataKalla === "live"
        ? await skapaRakning(hushallId, innehall)
        : { ...innehall, id: crypto.randomUUID(), hushallId: DEMO_HUSHALL, betald: false };
      setRakningar((nuvarande) => [...nuvarande, ny]);
      setFormular(null);
      visaNotis(dataKalla === "live" ? "Räkningen är sparad" : "Räkningen är tillagd i demon");
    } catch (error) {
      console.error("Kunde inte skapa räkningen", error);
      visaNotis("Kunde inte spara räkningen");
    }
  }

  async function laggTillSyssla(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const innehall = {
      titel: String(data.get("titel")),
      ansvarig: String(data.get("ansvarig")),
      forfallodatum: String(data.get("forfallodatum")),
      kategori: "hem" as const,
    };
    try {
      const ny = dataKalla === "live"
        ? await skapaSyssla(hushallId, innehall)
        : { ...innehall, id: crypto.randomUUID(), hushallId: DEMO_HUSHALL, klar: false };
      setSysslor((nuvarande) => [...nuvarande, ny]);
      setFormular(null);
      visaNotis(dataKalla === "live" ? "Sysslan är sparad" : "Sysslan är tillagd i demon");
    } catch (error) {
      console.error("Kunde inte skapa sysslan", error);
      visaNotis("Kunde inte spara sysslan");
    }
  }

  async function laggTillInkopsvara(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const innehall = {
      namn: String(data.get("namn")),
      antal: String(data.get("antal")),
      kategori: String(data.get("kategori")) as Inkopskategori,
    };
    try {
      const ny = dataKalla === "live"
        ? await skapaInkopsvara(hushallId, innehall)
        : { ...innehall, id: crypto.randomUUID(), hushallId: DEMO_HUSHALL, kopd: false };
      setInkop((nuvarande) => [...nuvarande, ny]);
      setFormular(null);
      visaNotis(dataKalla === "live" ? "Inköpet är sparat" : "Inköpet är tillagt i demon");
    } catch (error) {
      console.error("Kunde inte skapa inköpsvaran", error);
      visaNotis("Kunde inte spara inköpet");
    }
  }

  async function laggTillHushallsavtal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const underkategori = String(data.get("underkategori") ?? "").trim();
    const fornyasDatum = String(data.get("fornyasDatum") ?? "").trim();
    const innehall = {
      kategori: String(data.get("kategori")) as Avtalskategori,
      underkategori: underkategori || undefined,
      namn: String(data.get("namn")),
      leverantor: String(data.get("leverantor")),
      manadskostnad: Number(data.get("manadskostnad")),
      fornyasDatum: fornyasDatum || undefined,
      status: "aktivt" as const,
    };
    try {
      const nyttAvtal = dataKalla === "live"
        ? await skapaHushallsavtal(hushallId, innehall)
        : { ...innehall, id: crypto.randomUUID(), hushallId: DEMO_HUSHALL };
      setHushallsavtal((nuvarande) => [...nuvarande, nyttAvtal]);
      setFormular(null);
      visaNotis(dataKalla === "live" ? "Avtalet är sparat" : "Avtalet är tillagt i demon");
    } catch (error) {
      console.error("Kunde inte skapa avtalet", error);
      visaNotis("Kunde inte spara avtalet");
    }
  }

  if (harSupabase && !authKontrollerad) {
    return <LoadingScreen text="Öppnar Hemma Kollen…" />;
  }

  if (harSupabase && !anvandarId) {
    return <LoginScreen />;
  }

  if (dataKalla === "synkar") {
    return <LoadingScreen text="Hämtar hushållet…" />;
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
            <span><strong>{hushallsnamn}</strong><small>{dataKalla === "live" ? "Synkat hushåll" : "2 medlemmar"}</small></span>
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
            <p className="eyebrow">{dagensRubrik()}</p>
            <h1>{vy === "oversikt" ? `Hej ${visningsnamn}!` : vyRubriker[vy]}</h1>
          </div>
          <div className="topbar-actions">
            {dataKalla === "demo" && <span className="demo-pill">Demo</span>}
            {dataKalla === "live" && <span className="live-pill">Synkad</span>}
            <button className="icon-button" aria-label="Notiser">♢<span className="notification-dot" /></button>
            <button className="invite-button" onClick={() => visaNotis("Inbjudningar öppnas när kontot är anslutet")}>+ Bjud in</button>
            {harSupabase && <button className="logout-button" onClick={() => void loggaUt()}>Logga ut</button>}
          </div>
        </header>

        {vy === "oversikt" && (
          <Overview
            nastaRakning={nastaRakning}
            obetalda={obetalda}
            oppnaSysslor={oppnaSysslor}
            sysslor={sysslor}
            inkop={inkop}
            hushallsavtal={hushallsavtal}
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

        {vy === "inkop" && (
          <Shopping
            inkop={inkop}
            onToggle={markeraInkopsvara}
            onAdd={() => setFormular("inkop")}
          />
        )}

        {vy === "avtal" && (
          <Contracts
            avtal={hushallsavtal}
            onAdd={() => setFormular("avtal")}
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
            <h2 id="modal-title">
              {formular === "rakning" ? "Lägg till räkning" : formular === "syssla" ? "Ny syssla" : formular === "inkop" ? "Lägg till inköp" : "Lägg till avtal"}
            </h2>
            <p className="modal-intro">
              {formular === "rakning"
                ? "Fyll i det viktigaste nu. Du kan komplettera senare."
                : formular === "syssla"
                  ? "Gör det tydligt vad som ska göras och vem som tar den."
                  : formular === "inkop"
                    ? "Lägg till det som behövs. Alla i hushållet ser samma lista."
                    : "Samla kostnad och nästa viktiga datum på ett ställe."}
            </p>
            {formular === "rakning" ? (
              <BillForm onSubmit={laggTillRakning} />
            ) : formular === "syssla" ? (
              <ChoreForm onSubmit={laggTillSyssla} />
            ) : formular === "inkop" ? (
              <ShoppingForm onSubmit={laggTillInkopsvara} />
            ) : (
              <ContractForm onSubmit={laggTillHushallsavtal} />
            )}
          </section>
        </div>
      )}

      {notis && <div className="toast" role="status">✓ {notis}</div>}
    </div>
  );
}

function LoadingScreen({ text }: { text: string }) {
  return (
    <main className="auth-screen">
      <div className="auth-card loading-card" role="status">
        <span className="auth-brand-mark" aria-hidden="true">H</span>
        <div className="loading-dot" aria-hidden="true" />
        <p>{text}</p>
      </div>
    </main>
  );
}

function LoginScreen() {
  const [epost, setEpost] = useState("");
  const [skickad, setSkickad] = useState(false);
  const [skickar, setSkickar] = useState(false);
  const [fel, setFel] = useState<string | null>(null);

  async function skickaInloggningslank(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSkickar(true);
    setFel(null);
    const { error } = await loggaInMedEpost(epost);
    setSkickar(false);
    if (error) {
      console.error("Kunde inte skicka inloggningslänk", error);
      setFel("Länken kunde inte skickas. Kontrollera adressen och försök igen.");
      return;
    }
    setSkickad(true);
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">H</span>
          <span>Hemma Kollen</span>
        </div>
        <p className="eyebrow">Välkommen hem</p>
        <h1>Logga in utan lösenord.</h1>
        <p className="auth-intro">Vi skickar en säker engångslänk till din mejl. Första gången skapar vi ditt hushåll automatiskt.</p>

        {skickad ? (
          <div className="auth-success" role="status">
            <span aria-hidden="true">✓</span>
            <div><strong>Kolla inkorgen</strong><p>Öppna länken vi skickade till {epost}.</p></div>
          </div>
        ) : (
          <form className="form auth-form" onSubmit={skickaInloggningslank}>
            <label>
              E-postadress
              <input
                type="email"
                value={epost}
                onChange={(event) => setEpost(event.target.value)}
                placeholder="du@exempel.se"
                autoComplete="email"
                required
              />
            </label>
            {fel && <p className="form-error" role="alert">{fel}</p>}
            <button className="primary-button full" type="submit" disabled={skickar}>
              {skickar ? "Skickar…" : "Skicka inloggningslänk"}
            </button>
          </form>
        )}
        <small className="auth-privacy">Dina räkningar och sysslor skyddas per hushåll.</small>
      </section>
    </main>
  );
}

interface OverviewProps {
  nastaRakning?: Rakning;
  obetalda: Rakning[];
  oppnaSysslor: Syssla[];
  sysslor: Syssla[];
  inkop: Inkopsvara[];
  hushallsavtal: Hushallsavtal[];
  forslag: ReturnType<typeof beraknaBesparingar>;
  onOpenForm: (form: Formular) => void;
  onChangeView: (view: Vy) => void;
  onToggleChore: (id: string) => void;
}

function Overview({ nastaRakning, obetalda, oppnaSysslor, sysslor, inkop, hushallsavtal, forslag, onOpenForm, onChangeView, onToggleChore }: OverviewProps) {
  const obetalt = obetalda.reduce((summa, rakning) => summa + rakning.belopp, 0);
  const klara = sysslor.length - oppnaSysslor.length;
  const attKopa = inkop.filter((vara) => !vara.kopd).length;
  const avtalskostnad = hushallsavtal.reduce((summa, avtal) => summa + avtal.manadskostnad, 0);
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
            <button className="secondary-button" onClick={() => onOpenForm("inkop")}>+ Lägg till inköp</button>
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
        <button className="stat-card" onClick={() => onChangeView("inkop")}>
          <span className="stat-icon coral">◌</span>
          <span><small>På inköpslistan</small><strong>{attKopa} st</strong><em>mat, hem och djur</em></span>
          <span className="arrow">→</span>
        </button>
        <button className="stat-card" onClick={() => onChangeView("avtal")}>
          <span className="stat-icon green">◇</span>
          <span><small>Avtal & abonnemang</small><strong>{kronor(avtalskostnad)}</strong><em>per månad · {hushallsavtal.length} avtal</em></span>
          <span className="arrow">→</span>
        </button>
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

const inkopskategorier: Record<Inkopskategori, string> = {
  mat: "Mat",
  hushall: "Hushåll",
  djur: "Djur",
  ovrigt: "Övrigt",
};

function Shopping({ inkop, onToggle, onAdd }: { inkop: Inkopsvara[]; onToggle: (id: string) => void; onAdd: () => void }) {
  const [filter, setFilter] = useState<Inkopskategori | "alla">("alla");
  const filtrerade = inkop
    .filter((vara) => filter === "alla" || vara.kategori === filter)
    .sort((a, b) => Number(a.kopd) - Number(b.kopd));
  const kvar = inkop.filter((vara) => !vara.kopd).length;

  return (
    <section className="page-panel">
      <div className="page-intro shopping-intro">
        <div>
          <p>En gemensam lista för mat, hushållsvaror, djur och allt annat som behöver handlas.</p>
          <div className="filter-tabs category-tabs">
            <button className={filter === "alla" ? "aktiv" : ""} onClick={() => setFilter("alla")}>Alla</button>
            {(Object.entries(inkopskategorier) as Array<[Inkopskategori, string]>).map(([id, etikett]) => (
              <button key={id} className={filter === id ? "aktiv" : ""} onClick={() => setFilter(id)}>{etikett}</button>
            ))}
          </div>
        </div>
        <button className="primary-button" onClick={onAdd}>+ Lägg till inköp</button>
      </div>

      <div className="shopping-layout">
        <aside className="shopping-count" aria-label="Inköpsstatus">
          <span className="shopping-bag" aria-hidden="true">◌</span>
          <small>Kvar att handla</small>
          <strong>{kvar}</strong>
          <p>{kvar === 1 ? "sak på listan" : "saker på listan"}</p>
        </aside>
        <div className="shopping-list">
          {filtrerade.length ? filtrerade.map((vara) => (
            <button className={vara.kopd ? "shopping-row done" : "shopping-row"} key={vara.id} onClick={() => onToggle(vara.id)}>
              <span className="large-check">{vara.kopd ? "✓" : ""}</span>
              <span className="shopping-main"><strong>{vara.namn}</strong><small>{inkopskategorier[vara.kategori]}</small></span>
              <span className="quantity">{vara.antal}</span>
            </button>
          )) : (
            <div className="empty-state"><span>✓</span><strong>Listan är tom</strong><p>Lägg till något ni behöver köpa.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}

function Contracts({ avtal, onAdd }: { avtal: Hushallsavtal[]; onAdd: () => void }) {
  const [filter, setFilter] = useState<Avtalskategori | "alla">("alla");
  const filtrerade = avtal.filter((post) => filter === "alla" || post.kategori === filter);
  const total = avtal.reduce((summa, post) => summa + post.manadskostnad, 0);
  const nastaDatum = avtal
    .filter((post) => post.fornyasDatum)
    .sort((a, b) => String(a.fornyasDatum).localeCompare(String(b.fornyasDatum)))[0];

  return (
    <section className="page-panel">
      <div className="page-intro">
        <div><p>Samla försäkringar, abonnemang och löpande avtal. Se vad hemmet kostar och när det är dags att se över något.</p></div>
        <button className="primary-button" onClick={onAdd}>+ Lägg till avtal</button>
      </div>

      <div className="contract-summary">
        <article><small>Total månadskostnad</small><strong>{kronor(total)}</strong><span>{kronor(total * 12)} per år</span></article>
        <article><small>Aktiva avtal</small><strong>{avtal.filter((post) => post.status === "aktivt").length}</strong><span>i {new Set(avtal.map((post) => post.kategori)).size} kategorier</span></article>
        <article><small>Nästa viktiga datum</small><strong>{nastaDatum?.fornyasDatum ? kortDatum(nastaDatum.fornyasDatum) : "–"}</strong><span>{nastaDatum ? nastaDatum.namn : "Inget datum sparat"}</span></article>
      </div>

      <div className="filter-tabs category-tabs contract-tabs" aria-label="Filtrera avtal">
        <button className={filter === "alla" ? "aktiv" : ""} onClick={() => setFilter("alla")}>Alla</button>
        {(Object.entries(avtalskategorier) as Array<[Avtalskategori, { etikett: string; ikon: string }]>).map(([id, info]) => (
          <button key={id} className={filter === id ? "aktiv" : ""} onClick={() => setFilter(id)}>{info.etikett}</button>
        ))}
      </div>

      <div className="contract-grid">
        {filtrerade.map((post) => {
          const info = avtalskategorier[post.kategori];
          return (
            <article className="contract-card" key={post.id}>
              <div className={`contract-icon ${post.kategori}`} aria-hidden="true">{info.ikon}</div>
              <div className="contract-card-main">
                <div className="contract-meta"><span>{post.underkategori ?? info.etikett}</span><em>{post.status}</em></div>
                <h2>{post.namn}</h2>
                <p>{post.leverantor}</p>
              </div>
              <div className="contract-cost"><strong>{kronor(post.manadskostnad)}</strong><small>/ mån</small></div>
              <div className="contract-date">
                <span>{post.fornyasDatum ? `Nästa datum ${kortDatum(post.fornyasDatum)}` : "Löpande avtal"}</span>
                {post.uppsagningstidManader != null && <span>{post.uppsagningstidManader} mån uppsägning</span>}
              </div>
            </article>
          );
        })}
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

function ShoppingForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Vad behövs?<input name="namn" placeholder="Till exempel havremjölk" required /></label>
      <div className="form-row">
        <label>Mängd<input name="antal" defaultValue="1 st" placeholder="1 st" required /></label>
        <label>Kategori<select name="kategori" defaultValue="mat"><option value="mat">Mat</option><option value="hushall">Hushåll</option><option value="djur">Djur</option><option value="ovrigt">Övrigt</option></select></label>
      </div>
      <button className="primary-button full" type="submit">Lägg till på listan</button>
    </form>
  );
}

function ContractForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [kategori, setKategori] = useState<Avtalskategori>("forsakring");
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Kategori
        <select name="kategori" value={kategori} onChange={(event) => setKategori(event.target.value as Avtalskategori)}>
          {(Object.entries(avtalskategorier) as Array<[Avtalskategori, { etikett: string }]>).map(([id, info]) => <option key={id} value={id}>{info.etikett}</option>)}
        </select>
      </label>
      {kategori === "forsakring" ? (
        <label>Vad är försäkrat?<select name="underkategori" defaultValue="Hem"><option>Hem</option><option>Bil</option><option>Djur</option><option>Resa</option><option>Person</option><option>Annat</option></select></label>
      ) : (
        <label>Typ eller paket, valfritt<input name="underkategori" placeholder="Till exempel Fiber 500 eller familj" /></label>
      )}
      <label>Namn<input name="namn" placeholder="Till exempel Hemförsäkring" required /></label>
      <label>Leverantör<input name="leverantor" placeholder="Företag eller organisation" required /></label>
      <div className="form-row">
        <label>Kostnad per månad<input name="manadskostnad" type="number" min="0" step="1" placeholder="0 kr" required /></label>
        <label>Förnyas / löper ut<input name="fornyasDatum" type="date" /></label>
      </div>
      <button className="primary-button full" type="submit">Spara avtalet</button>
    </form>
  );
}
