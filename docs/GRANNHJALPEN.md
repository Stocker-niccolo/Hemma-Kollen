# Grannhjälpen — beslutsunderlag

Uppdaterad: 5 oktober 2026. Löser det öppna strategibeslutet i
[`BESLUT.md`](./BESLUT.md) §6. Inget här är byggt; dokumentet finns för att
ägaren ska kunna säga ja/nej per punkt, därefter planeras bygget.

Idén (ägaren, 1 oktober): *välj en syssla — rengöra sopkärl, skotta tomten,
klippa häck … — och få hjälp av grannar via hemsidan.*

---

## 1. Kort svar

Grannhjälpen är värd att göra, men **inte som ett eget grannnätverk med
betalning mellan privatpersoner**. Det spåret bär skatt-, försäkrings- och
ansvarsfrågor som Hemmakollen inte kan lösa själv, och ger ingen intäkt som
passar affärsmodellen.

**Rekommendation:** bygg Grannhjälpen som en **beställningsfunktion** i
Hemmakollen där hushållet väljer syssla och vi förmedlar jobbet till en
partner som redan löst allt det svåra (anställning, skatt, RUT, försäkring).
Känslan "en granne hjälper till" bevaras genom att partnern är lokal och
hjälparen bor i närområdet. Hemmakollen tar leadersättning — exakt samma
intäktslogik och transparensregel som el, försäkring och mobil.

Tre steg, varje steg är ett eget ägar-ja:

| Steg | Vad | Vad som krävs | Intäkt |
|---|---|---|---|
| **V0 — Beställ hjälp** | Formulär per syssla i appen → förfrågan skickas till 1–3 lokala RUT-företag/partners. Hushållet får svar och avtalar direkt med företaget. | Avtal med några företag i ett startområde. Ingen integration. | Fast leadavgift eller provision per bokat jobb (partneravtal). |
| **V1 — Partnerplattform** | Samma knapp, men bokningen går in i en plattform av Yepstr-typ (ungdomar i närområdet, anställda av plattformen) via deras API/affiliate. | Partneravtal + teknisk koppling. | Affiliate/provision per genomfört jobb. |
| **V2 — Eget grannnätverk** | Hushåll ↔ grannar direkt i Hemmakollen. | Betalpartner, försäkringslösning, juridik, moderering, kritisk massa per område. | Oklar; kräver sannolikt serviceavgift. |

V2 byggs **inte** förrän V0/V1 visat efterfrågan och ett område har tillräckligt
många hushåll. Det kan mycket väl bli så att V2 aldrig behövs.

---

## 2. Svar på de fem frågorna ur BESLUT §6

### (a) Vem är hjälparen?

| Alternativ | Fördel | Problem |
|---|---|---|
| **Grannar privat** (ägarens ursprungsidé) | Varm, lokal, billig för hushållet. | Hushållet blir "arbetsgivare": över 10 000 kr/år till samma person ⇒ arbetsgivaravgifter och skatteavdrag via förenklad arbetsgivardeklaration. Under 10 000 kr ska mottagaren ändå ta upp inkomsten. Ingen RUT (kräver F-skatt/företag). Ingen försäkring. Hemmakollen kan inte kontrollera vem som dyker upp. |
| **Plattformsanställda** (Yepstr-modellen: plattformen anställer hjälparna, betalar lön, avgifter, pension, försäkrar dem) | Löser skatt, försäkring och RUT åt hushållet. Hjälparna är ofta ungdomar i grannskapet ⇒ "granne"-känslan finns på riktigt. | Beroende av partner; tar bara sysslor partnern erbjuder. |
| **Lokala RUT-företag** (städ, trädgård, snö, flytt) | Finns överallt, vana vid RUT, egna försäkringar, F-skatt. Enklast att avtala med. | Mindre "granne", mer "firma". Prisnivå högre än en tonåring. |

**Svar:** plattformsanställda eller RUT-företag. Aldrig privatpersoner i V0/V1.

### (b) Betalning

Hemmakollen ska **aldrig** stå mellan pengarna. Att ta emot betalning för
annans räkning är betaltjänstverksamhet (tillstånd från Finansinspektionen
eller avtal med licensierad betalpartner). Det är samma linje som redan gäller
för försäkring och lån i handoffen §18 och i botens regler.

**Svar:** hushållet betalar partnern direkt (faktura med RUT-avdrag redan
draget). Hemmakollen fakturerar partnern för leads/provision i efterhand.

### (c) Försäkring och ansvar

Partnern (företaget/plattformen) bär ansvarsförsäkring och arbetsskadeansvar.
Hemmakollens villkor ska säga tydligt att vi förmedlar en förfrågan och inte
är part i avtalet om arbetet. Vid privatpersoner (V2) finns ingen motsvarighet
— hemförsäkringens ansvarsskydd täcker inte självklart "grannen som skottade",
och det är ett av huvudskälen att V2 ligger sist.

### (d) Skatt

Löst av partnern i V0/V1 (anställning respektive F-skatt). RUT-avdraget
(50 % av arbetskostnaden, max 75 000 kr per person och år tillsammans med ROT)
gäller för städning, fönsterputs, gräsklippning, snöskottning, trädgårdsarbete,
flytthjälp m.m. — det vill säga nästan alla sysslor på ägarens lista. Det är
ett **säljargument** i appen: "ca 50 % av arbetskostnaden dras av direkt på
fakturan". Rengöring av sopkärl är inte uttryckligen listat hos Skatteverket;
partnern avgör vad de fakturerar som RUT.

### (e) Intäkt för Hemmakollen

Leadavgift per kvalificerad förfrågan eller provision per genomfört jobb,
enligt partneravtal. Passar grundmodellen i handoffen §9 ("fast ersättning per
kvalificerad lead", "provision på genomfört köp"). Transparensregeln gäller:

> Om du bokar hjälp via Hemmakollen kan vi få ersättning från företaget som
> utför jobbet. Det påverkar inte ditt pris.

Ingen partner får visas enbart för att ersättningen är hög (handoffen §9,
BESLUT §3).

---

## 3. V0 i detalj — "Beställ hjälp"

Det som byggs när ägaren sagt ja. Avsiktligt litet.

**Var i appen:** en knapp "Få hjälp med det här" på varje syssla i Sysslor-vyn,
plus en egen ingång "Grannhjälpen" på Översikten. Sysslor-vyn är idag
sekundär (BESLUT §1) — det ändras inte; Grannhjälpen är en ingång, inte en
ny huvudflik.

**Sysslor i första versionen** (RUT-berättigade, säsongsvisa — passar
påminnelsemotorn):

- snöskottning och sandning (nov–mar)
- gräsklippning (apr–okt)
- häck- och buskklippning (vår/höst)
- lövkrattning och höststädning
- fönsterputs
- hemstädning / storstädning
- flytthjälp och bortforsling
- *rengöring av sopkärl* — med om partnern tar det, annars senare

**Flöde:**

1. Hushållet väljer syssla, beskriver kort (fritext + ev. foto senare), anger
   önskat tidsfönster, adress hämtas från hushållet.
2. Appen visar vilka partners som får förfrågan och ersättningstexten.
3. Förfrågan skickas till 1–3 partners i området (e-post/API hos partnern).
4. Partnern kontaktar hushållet och lämnar pris. Avtal och betalning sker
   mellan dem.
5. Hushållet markerar i appen "bokad" / "klar" / "ingen passade" — det ger oss
   konverteringsdata och underlag för leadfakturering.

**Datamodell (skiss, byggs inte nu):**
`hjalpforfragan` (hushåll, syssla, beskrivning, tidsfönster, status,
skapad), `hjalppartner` (namn, område/postnummer, sysslor, kontakt,
ersättningsmodell), `hjalpforfragan_partner` (vilken partner fick vilken
förfrågan, när, utfall).

**Botens roll:** `kunskap.ts` säger idag "planerad, finns inte ännu". Vid V0-
lansering byts texten till hur Beställ hjälp fungerar, inklusive att
Hemmakollen inte är part i avtalet och kan få ersättning. Boten får inte
lova pris, tid eller tillgänglighet.

**Vad V0 inte innehåller:** betalning, chatt mellan parter, betyg på
hjälpare, realtidsmatchning, egna hjälparprofiler, karta. Allt det är V2-
frågor.

---

## 4. Vad som måste vara sant innan V0 byggs

1. **Startområde valt.** Grannhjälpen fungerar bara lokalt. Ett område
   (kommun/stadsdel) där ägaren kan få avtal med 2–3 företag.
2. **Minst två partners signerade** — annars finns ingen att skicka
   förfrågan till och funktionen ser trasig ut. Lämpliga typer: lokal
   trädgårds-/snöfirma, städfirma, samt en plattform av Yepstr-typ om de har
   partnerprogram.
3. **Juridisk koll** (ingår i ägarsteg 6 i BESLUT): villkorstext om
   förmedlarroll, personuppgiftsbiträdesavtal med partner (adress och
   kontaktuppgifter delas), marknadsföringssamtycke.
4. **Efterfrågesignal.** Billigaste testet, före all kod: lägg knappen
   "Få hjälp med det här" i Sysslor-vyn som endast registrerar klick och
   visar "Vi öppnar Grannhjälpen i ditt område snart — vill du bli
   meddelad?". Ger lista på intresserade hushåll och vilka sysslor som
   efterfrågas. Detta är ett **separat, litet bygge** och kan gå före
   punkt 1–3 om ägaren vill mäta innan hen jagar partners.

---

## 5. Mätetal

- andel hushåll som klickar "Få hjälp" per syssla (efterfrågan)
- förfrågningar per månad och område
- svarsfrekvens från partner inom 48 h
- bokningsgrad (förfrågan → "bokad")
- leadintäkt per förfrågan
- förtroende: andel som markerar "nöjd med hjälpen" (enkel tumme upp/ner)

---

## 6. Risker

| Risk | Hantering |
|---|---|
| Ingen partner svarar ⇒ dålig upplevelse | Max 48 h svarstid i partneravtalet; vid tyst partner visas "ingen tillgänglig just nu" och förfrågan loggas. |
| Glider mot betalförmedling | Hård regel: inga pengar genom Hemmakollen. Samma som Swish-regeln för hushåll. |
| Breddar produkten före ekonomikärnan är validerad (handoffen §18) | V0 byggs efter påminnelser (byggsteg 3 i BESLUT). Efterfrågetestet i §4.4 får gå före eftersom det är minimalt. |
| Ägarens idé om riktiga grannar tunnas ut | Partnern väljs lokal; ungdomsplattformar ger faktiska grannar. V2 står kvar i planen om efterfrågan visar sig. |
| RUT-regler ändras | Avdragstexten i appen hämtas från ett ställe (konstant) så den kan uppdateras utan kodändring i flöden. |

---

## 7. Beslut ägaren behöver fatta

1. **Modell:** V0 lead till RUT-företag/partnerplattform (rekommenderas) —
   eller insistera på eget grannnätverk (då krävs betal- och
   försäkringspartner först, och planen görs om).
2. **Efterfrågetest först?** Ja/nej till den lilla "Få hjälp"-knappen som
   bara mäter intresse.
3. **Startområde** för partnerjakt.
4. **Sysslelistan** i §3 — stryk/lägg till.
5. **Placering i byggordningen:** efter påminnelser (rekommenderas) eller
   tidigare.

Källor för regler i detta dokument: Skatteverket (ROT/RUT, förenklad
arbetsgivardeklaration för privata tjänster), Yepstr (plattformsanställning
sedan 2021). Siffror och regler ska kontrolleras igen med jurist/Skatteverket
före lansering — de är underlag, inte juridisk rådgivning.
