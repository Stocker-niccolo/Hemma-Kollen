// Kunskapsbas för CasaVita-boten. ENDA källan till vad boten vet — används både
// av Claude-workern (som systemprompt) och av den lokala reservmotorn när
// ingen backend är konfigurerad. Håll texten kort, konkret och i CasaVitas ton
// (se docs/HANDOFF.md §11): enkelt, varmt, tryggt, handlingsinriktat.
//
// Regler som ALDRIG får brytas (handoffens §9, §12 + FI-linjen):
// - Besparingar är uppskattningar, aldrig utfall.
// - CasaVita förmedlar aldrig försäkring, lån eller kredit — jämför och länkar.
// - Ersättning från partner märks alltid ut. Priset för användaren påverkas inte.
// - Ingen juridisk eller finansiell rådgivning som ersätter en expert.

export interface FaqPost {
  /** Kort id, används i tester och loggar. */
  id: string;
  /** Ord/fraser (gemener) som matchar frågan. */
  nyckelord: string[];
  /** Svaret, 1–3 meningar. */
  svar: string;
}

export const CASAVITA_FAKTA = `
CasaVita är en digital hemmapartner för svenska hushåll. Appen samlar hushållets
återkommande kostnader (el, försäkringar, mobil, bredband, streaming, gym),
avtal, bindningstider och viktiga datum på ett ställe — och säger till när det
är läge att agera: innan bindningstiden löper ut, innan en provperiod börjar
kosta, innan en räkning förfaller.

Produktlöfte: CasaVita samlar ditt hem, håller koll åt dig och hjälper dig fatta
bättre beslut — kostnadsfritt.

Så fungerar det:
1. Lägg in hushållets avtal och räkningar (manuellt i dag; kvitto-/fakturatolkning kommer senare).
2. CasaVita bevakar bindningstider, uppsägningsfönster och förfallodatum.
3. När något ser dyrt ut förklarar CasaVita varför, vad du kan göra och ungefär vad du kan spara.
4. Du bestämmer alltid själv. CasaVita byter aldrig avtal åt dig.

Funktioner i dag: översikt över månadskostnad, räkningar med förfallodatum,
avtal per kategori, inköpslista och sysslor som kan delas i hushållet, samt
förslag på besparingar (el, hemförsäkring, mobil/bredband först).

Affärsmodell och transparens: Appen är gratis för användaren. Inga
kortuppgifter, ingen bankinloggning. Om du tecknar ett avtal via CasaVita kan
vi få ersättning från leverantören. Det påverkar inte ditt pris — och vi säger
alltid till. Ett erbjudande visas aldrig bara för att ersättningen är hög. Om
hela marknaden inte jämförs ska det framgå.

Integritet: GDPR-anpassad behandling, dataminimering, du kan exportera och
radera dina data. En hushållsmedlem ser inte automatiskt en annan persons
privata kostnader. Data säljs aldrig vidare som rå kunddata. Bankkoppling byggs
i så fall via behörig Open Banking-partner, aldrig via egen hantering av
bankinloggning.

Status: CasaVita är under uppbyggnad. Hemsidan visar en demo med fiktiva data.
Hushållsdelning, påminnelser med notiser och riktiga partnerjämförelser byggs
stegvis. På sikt planeras även Grannhjälpen — hjälp från grannar med praktiska
saker som att rengöra sopkärl, skotta eller klippa häcken — men den finns inte
ännu.
`.trim();

export const AMNEN: Array<{ rubrik: string; text: string }> = [
  {
    rubrik: "Elavtal",
    text: `Elkostnaden består av elhandel (avtalet du kan byta), elnät (kan inte bytas, beror på var du bor) och skatter/moms. Fast pris ger förutsägbarhet, rörligt pris följer marknaden. Bindningstid och uppsägningstid står i avtalet; vid utgången flyttas man ofta till ett dyrare "tillsvidarepris" om man inte agerar. Kolla alltid jämförpris (öre/kWh inklusive avgifter) och om det finns påslag eller månadsavgift. Oberoende jämförelse: Elpriskollen (Energimarknadsinspektionen).`,
  },
  {
    rubrik: "Hemförsäkring",
    text: `Hemförsäkring täcker lösöre, ansvar, rättsskydd, överfall och reseskydd. Villa-/bostadsrättstillägg täcker själva bostaden. Jämför självrisk, maxbelopp för lösöre, drulle (allrisk) och om reseskyddet räcker. Byte sker vanligen vid huvudförfallodag, men många bolag tillåter byte när som helst med 1 månads uppsägning. CasaVita jämför och länkar vidare — vi förmedlar aldrig försäkring och ger inte individuell försäkringsrådgivning. Oberoende vägledning: Konsumenternas Försäkringsbyrå.`,
  },
  {
    rubrik: "Mobil och bredband",
    text: `Vanliga fällor: bindningstid 12–24 månader, kampanjpris som höjs efter några månader, outnyttjad surf och dubbla tjänster i hushållet. Uppsägningstid är oftast 1–3 månader. Kolla faktiskt behov av surf/hastighet, om familjeabonnemang lönar sig och vad priset blir efter kampanjen. Nummerflytt (portering) är gratis och sköts av den nya operatören.`,
  },
  {
    rubrik: "Streaming och prenumerationer",
    text: `Räkna ihop alla prenumerationer en gång per kvartal. Provperioder övergår ofta tyst i betalning. Pausa eller säg upp det ni inte använt på en månad. Många tjänster kan delas i hushåll enligt sina villkor.`,
  },
  {
    rubrik: "Räkningar och förfallodatum",
    text: `Betala i tid för att slippa påminnelseavgift (max 60 kr) och inkasso. Autogiro eller e-faktura minskar risken att missa något. CasaVita påminner inför förfallodatum och visar vad som är obetalt. Vid betalningssvårigheter: kontakta leverantören tidigt och be om anstånd eller delbetalning; kommunens budget- och skuldrådgivning är gratis.`,
  },
  {
    rubrik: "Avtal, bindningstid och uppsägning",
    text: `Tre datum styr: bindningstidens slut, sista dag att säga upp (uppsägningstid före slutet) och förnyelsedatum. Säg upp skriftligt och spara bekräftelsen. Enligt lag får bindningstid för konsumenter normalt vara högst 24 månader, och uppsägningstid efter bindningstiden högst 1 månad för abonnemangstjänster. Ångerrätt 14 dagar gäller vid distansköp. Oberoende hjälp: Hallå konsument (Konsumentverket).`,
  },
  {
    rubrik: "Hushåll och delning",
    text: `Ett hushåll i CasaVita har en ägare och medlemmar. Räkningar, avtal, inköpslistor och sysslor kan delas. Privata kostnader syns inte automatiskt för andra. Swish-betalningar mellan medlemmar görs via vanliga Swish-länkar, CasaVita hanterar aldrig pengar.`,
  },
  {
    rubrik: "Besparingar och förslag",
    text: `CasaVitas förslag bygger på regler, t.ex. avtal som löper ut inom 30 dagar, kostnad över ett riktvärde, prisökning, dubbletter eller provperiod som blir betald. Alla belopp är uppskattningar baserade på marknadssnitt och visas alltid som "cirka". Vi säger varför något föreslås och vilka data som använts. Du kan rätta fel, och inget byts utan ditt uttryckliga godkännande.`,
  },
  {
    rubrik: "Grannhjälpen (planerad)",
    text: `Grannhjälpen är en planerad funktion där hushåll kan be grannar om hjälp med praktiska sysslor — rengöra sopkärl, skotta, klippa gräs, bära möbler, vattna blommor. Den finns inte ännu. Villkor, ersättning och försäkringsfrågor är inte beslutade.`,
  },
];

/** Förslag som visas som chips innan användaren skrivit något. */
export const FORSLAG_FRAGOR = [
  "Vad är CasaVita?",
  "Kostar det något?",
  "Hur tjänar ni pengar?",
  "När ska jag byta elavtal?",
  "Vad är Grannhjälpen?",
];

/** FAQ för den lokala reservmotorn (när ingen Claude-backend är konfigurerad). */
export const FAQ: FaqPost[] = [
  {
    id: "vad-ar",
    nyckelord: ["vad är casavita", "vad gör casavita", "vad är det här", "vad är appen", "berätta om casavita"],
    svar: "CasaVita är en digital hemmapartner som samlar hushållets kostnader, avtal och viktiga datum på ett ställe — och säger till i rätt tid när det är läge att agera. Gratis för dig som användare.",
  },
  {
    id: "pris",
    nyckelord: ["kostar", "pris", "gratis", "avgift", "betala för appen", "prenumeration på casavita"],
    svar: "CasaVita är gratis för dig som användare. Inga kortuppgifter, ingen bankinloggning. Vi kan få ersättning från en leverantör om du tecknar ett avtal via oss — det påverkar inte ditt pris, och vi säger alltid till.",
  },
  {
    id: "affar",
    nyckelord: ["tjänar ni pengar", "tjänar pengar", "affärsmodell", "ersättning", "provision", "affiliate", "hur finansieras"],
    svar: "Appen är gratis. CasaVita kan få ersättning från leverantören när du väljer ett avtal via oss. Det påverkar inte ditt pris, och vi visar aldrig ett erbjudande bara för att ersättningen är hög.",
  },
  {
    id: "el",
    nyckelord: ["elavtal", "elpris", "byta el", "elbolag", "rörligt", "fast pris", "kwh", "elhandel", "elnät"],
    svar: "Byt elavtal i god tid innan bindningstiden går ut — annars hamnar du ofta på ett dyrare tillsvidarepris. Jämför jämförpris i öre/kWh inklusive avgifter. Elnätet kan du inte byta, bara elhandelsavtalet. Oberoende jämförelse finns på Elpriskollen.",
  },
  {
    id: "forsakring",
    nyckelord: ["hemförsäkring", "försäkring", "självrisk", "drulle", "allrisk", "villaförsäkring", "bostadsrättstillägg"],
    svar: "Jämför självrisk, maxbelopp för lösöre, allrisk (drulle) och reseskydd. Många bolag låter dig byta när som helst med en månads uppsägning. CasaVita jämför och länkar vidare men förmedlar aldrig försäkring — för personlig rådgivning, vänd dig till Konsumenternas Försäkringsbyrå.",
  },
  {
    id: "mobil",
    nyckelord: ["mobil", "abonnemang", "bredband", "operatör", "surf", "fiber", "telefon", "portering", "nummerflytt"],
    svar: "Vanliga fällor är kampanjpriser som höjs efter några månader, outnyttjad surf och dubbla tjänster i hushållet. Kolla priset efter kampanjen och säg upp i tid — uppsägningstiden är oftast 1–3 månader. Nummerflytt är gratis.",
  },
  {
    id: "streaming",
    nyckelord: ["streaming", "netflix", "spotify", "viaplay", "prenumerationer", "provperiod", "disney", "hbo", "max"],
    svar: "Räkna ihop alla prenumerationer en gång per kvartal och pausa det ni inte använt på en månad. Provperioder övergår ofta tyst i betalning — CasaVita kan påminna innan det händer.",
  },
  {
    id: "rakning",
    nyckelord: ["räkning", "faktura", "förfallodatum", "betala", "påminnelseavgift", "inkasso", "autogiro", "e-faktura", "obetald"],
    svar: "Betala i tid så slipper du påminnelseavgift och inkasso. Autogiro eller e-faktura minskar risken att missa något. CasaVita visar vad som är obetalt och påminner inför förfallodatum. Vid betalningssvårigheter: kontakta leverantören tidigt.",
  },
  {
    id: "uppsagning",
    nyckelord: ["säga upp", "uppsägning", "bindningstid", "uppsägningstid", "avsluta avtal", "ångerrätt", "förnyelse", "avtal löper ut"],
    svar: "Tre datum styr: bindningstidens slut, sista dag att säga upp och förnyelsedatum. Säg upp skriftligt och spara bekräftelsen. Bindningstid för konsumenter är normalt högst 24 månader och uppsägningstid efter bindningstiden högst 1 månad. Oberoende hjälp: Hallå konsument.",
  },
  {
    id: "hushall",
    nyckelord: ["hushåll", "familj", "dela", "medlem", "bjud in", "partner", "sambo", "swish"],
    svar: "Ett hushåll har en ägare och medlemmar som kan dela räkningar, avtal, inköpslistor och sysslor. Privata kostnader syns inte automatiskt för andra. Swish mellan medlemmar sker via vanliga Swish-länkar — CasaVita hanterar aldrig pengar.",
  },
  {
    id: "besparing",
    nyckelord: ["spara", "besparing", "förslag", "rekommendation", "hur mycket kan jag spara", "dyrt"],
    svar: "CasaVitas förslag bygger på tydliga regler, t.ex. avtal som snart löper ut eller en kostnad som ligger över marknadssnittet. Alla belopp är uppskattningar och visas som 'cirka'. Vi förklarar alltid varför, och inget byts utan ditt godkännande.",
  },
  {
    id: "integritet",
    nyckelord: ["integritet", "gdpr", "personuppgifter", "data", "säkerhet", "bank", "bankid", "radera", "lagras"],
    svar: "CasaVita är GDPR-anpassad och bygger på dataminimering. Du kan exportera och radera dina data, och vi säljer aldrig data vidare. Ingen bankinloggning krävs — bankkoppling skulle i så fall gå via en behörig Open Banking-partner.",
  },
  {
    id: "grannhjalp",
    nyckelord: ["grannhjälp", "granne", "grannar", "sopkärl", "skotta", "klippa gräs", "hjälp med", "snöskottning", "häck"],
    svar: "Grannhjälpen är en planerad funktion där du kan be grannar om hjälp med praktiska sysslor — rengöra sopkärl, skotta, klippa gräs. Den finns inte ännu; villkor och ersättning är inte beslutade. Vill du bli notifierad när den lanseras, säg till!",
  },
  {
    id: "komigang",
    nyckelord: ["kom igång", "börja", "logga in", "skapa konto", "registrera", "ladda ner", "app store", "finns det en app"],
    svar: "Just nu kan du utforska demon direkt på hemsidan. Riktiga konton och hushållsdelning lanseras stegvis — webbappen kommer först, en mobilapp senare. Inga kortuppgifter behövs.",
  },
  {
    id: "dokument",
    nyckelord: ["ladda upp", "kvitto", "fotografera", "ocr", "skanna", "e-post", "mejl", "automatiskt"],
    svar: "I dag lägger du in avtal och räkningar manuellt. Kvitto- och fakturatolkning, och på sikt e-postimport med ditt uttryckliga samtycke, är planerade nästa steg.",
  },
];
