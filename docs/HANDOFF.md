# Hemmakollen – komplett projekthandoff

**Dokumenttyp:** Strategisk, kommersiell och teknisk projekthandoff  
**Projekt:** Hemmakollen  
**Marknad:** Sverige  
**Primär produkt:** Kostnadsfri konsumentapp för att samla, förstå och förbättra hushållets ekonomi och vardag  
**Affärsmodell:** Provision, affiliateintäkter och partnerersättning – inte abonnemangsavgift från konsumenten  
**Status:** Koncept- och planeringsfas inför produktdefinition, design och MVP-utveckling  
**Senast uppdaterad:** 31 augusti 2026

---

## 1. Instruktion till den som tar över projektet

Det här dokumentet ska vara den huvudsakliga utgångspunkten för fortsatt arbete med Hemmakollen. Läs hela dokumentet innan du föreslår funktioner, design, teknisk arkitektur, affärsmodell eller prioriteringar.

Arbetssätt:

1. Bevara grundidén: Hemmakollen ska kännas som en varm och trygg hemmapartner, inte som ett kallt finansverktyg.
2. Gör inte produkten större än nödvändigt i första versionen.
3. Skilj alltid mellan beslutade krav, rekommendationer och öppna frågor.
4. Prioritera verklig användarnytta före mängden funktioner.
5. Varje funktion ska kunna kopplas till minst ett av följande mål:
   - spara pengar;
   - skapa kontroll;
   - minska administration;
   - förebygga missade betalningar eller dåliga avtal;
   - förenkla samarbete i hushållet;
   - skapa en relevant och användarvänlig intäktsmöjlighet för Hemmakollen.
6. Undvik att presentera annonser och partnererbjudanden som neutral rådgivning. Transparens och förtroende är centrala.
7. Vid osäkerhet: dokumentera antagandet och ställ en konkret fråga innan en irreversibel lösning byggs.

---

## 2. Sammanfattning av projektet

Hemmakollen är en svensk konsumentapp som ska ge människor en samlad bild av hushållets ekonomi, avtal, räkningar, inköp och gemensamma uppgifter. Appen ska vara kostnadsfri för användaren.

Problemet är att hushållets vardag är utspridd mellan banken, mejlen, kalendern, operatörernas appar, försäkringsbolag, elleverantörer, anteckningar och chattar. Många betalar för mycket, missar uppsägningstider, glömmer återkommande kostnader eller saknar en gemensam överblick över vem som ansvarar för vad.

Hemmakollen samlar denna vardag på ett ställe och hjälper användaren att agera vid rätt tidpunkt. Det långsiktiga värdet ligger inte bara i att visa information, utan i att upptäcka relevanta situationer och föreslå nästa bästa handling.

Exempel:

- Elräkningen har stigit samtidigt som bindningstiden snart löper ut.
- Ett mobilabonnemang kostar mer än jämförbara alternativ.
- En kostnadsfri provperiod övergår snart till betalning.
- Hemförsäkringen saknar en relevant del eller går att förbättra.
- Två personer i hushållet betalar för överlappande tjänster.
- En faktura närmar sig förfallodatum.

Hemmakollen ska då förklara situationen på vanlig svenska och erbjuda en relevant åtgärd. Om användaren väljer ett partnererbjudande kan Hemmakollen få provision.

---

## 3. Vision, mission och produktlöfte

### Vision

Att bli Sveriges mest omtyckta och betrodda digitala hemmapartner – platsen där hushåll får kontroll över sin ekonomi, sina avtal och sin gemensamma vardag.

### Mission

Hemmakollen ska göra det enkelt för vanliga människor att förstå vad hushållet kostar, vad som behöver göras och när ett bättre beslut finns att fatta.

### Produktlöfte

**Hemmakollen samlar ditt hem, håller koll åt dig och hjälper dig fatta bättre beslut – kostnadsfritt.**

### Önskad känsla

Varumärket och produkten ska upplevas som:

- varm;
- svensk och hemnära;
- enkel;
- trygg;
- omtänksam;
- modern utan att kännas teknisk;
- smart utan att skryta om AI;
- transparent och på användarens sida.

### Hemmakollen ska inte kännas som

- en bankapp;
- en aggressiv jämförelsesajt;
- ett redovisningssystem;
- en reklamplattform;
- ett komplicerat produktivitetsverktyg;
- ännu en app som kräver omfattande manuell administration.

---

## 4. Problembild

### Huvudproblem

1. Hushållets återkommande kostnader är splittrade och svåra att överblicka.
2. Användaren vet ofta inte vad abonnemang, avtal och försäkringar faktiskt kostar totalt.
3. Uppsägningstider, bindningstider och prisförändringar glöms bort.
4. Det är tidskrävande att jämföra alternativ vid rätt tillfälle.
5. Par och familjer saknar ofta en gemensam struktur för utgifter, inköp och uppgifter.
6. Befintliga lösningar visar ofta historik men hjälper inte användaren att faktiskt agera.
7. Många erbjudanden på marknaden känns generiska eller styrda av annonsintäkter.

### Kärninsikt

Det största kommersiella och användarmässiga värdet uppstår när Hemmakollen kan hjälpa användaren precis när ett beslut är relevant. En generell lista med erbjudanden är svag. Ett begripligt förslag som bygger på användarens situation, timing och möjliga besparing är starkt.

---

## 5. Målgrupper

### Primär målgrupp för MVP

Svenska hushåll med en eller två vuxna som har flera återkommande utgifter och vill ha bättre kontroll utan att själva bygga kalkylblad.

Typiska egenskaper:

- 20–45 år;
- bor ensamma, som par eller i mindre familj;
- använder mobilen som primärt verktyg;
- har abonnemang, elavtal, försäkring, bredband och andra återkommande kostnader;
- uppskattar enkelhet men vill inte lägga mycket tid på administration;
- är intresserade av att spara pengar, men inte av avancerad privatekonomi.

### Sekundära målgrupper

- barnfamiljer med mer komplex hushållsplanering;
- sambor som vill fördela kostnader och ansvar;
- unga vuxna som nyligen flyttat hemifrån;
- personer som nyligen flyttat och behöver teckna flera avtal;
- vuxna barn som hjälper en förälder att få ordning på hushållets avtal;
- kollektiv eller delade boenden.

### Exempelpersonas

#### 1. Ensamboende förstagångsanvändare

Vill se alla månadskostnader och bli varnad innan abonnemang förnyas. Behöver snabb onboarding och omedelbart värde.

#### 2. Samboparet

Vill samla gemensamma räkningar, dela inköpslista och se vem som betalar vad. Behöver hushållsdelning och tydliga behörigheter.

#### 3. Barnfamiljen

Har fler försäkringar, abonnemang, inköp och uppgifter. Behöver påminnelser, samarbete och en tydlig månadsvy.

---

## 6. Produktens kärnpelare

### 6.1 Ekonomisk överblick

Användaren ska kunna se:

- hushållets totala återkommande månadskostnad;
- kostnader per kategori;
- kommande betalningar;
- förändringar jämfört med tidigare period;
- vilka avtal och abonnemang som är aktiva;
- kostnader som kräver uppmärksamhet.

### 6.2 Avtal och abonnemang

Exempel på kategorier:

- el;
- bredband;
- mobilabonnemang;
- streaming;
- musik;
- molnlagring;
- gym;
- larm;
- försäkringar;
- lån och finansiering;
- parkering;
- kollektivtrafik;
- matkassar;
- medlemskap;
- tidningar och digitala tjänster;
- leasing och hyrtjänster.

Varje post bör kunna innehålla:

- leverantör;
- produkt eller tjänst;
- månadskostnad eller betalningsintervall;
- startdatum;
- bindningstid;
- uppsägningstid;
- nästa betalning;
- avtalets slutdatum;
- kontaktuppgifter;
- dokument eller kvitto;
- ansvarig person i hushållet;
- egna anteckningar.

### 6.3 Smarta insikter och rekommendationer

Hemmakollen ska identifiera relevanta händelser och formulera dem enkelt.

En rekommendation ska helst innehålla:

1. vad Hemmakollen har upptäckt;
2. varför det är relevant nu;
3. vad användaren kan göra;
4. uppskattad effekt eller besparing;
5. om Hemmakollen får ersättning från en partner.

Exempel:

> Din elkostnad har ökat tre månader i rad och ditt avtal löper ut om 21 dagar. Det kan vara ett bra tillfälle att jämföra alternativ. En möjlig besparing är cirka 180 kr per månad.

### 6.4 Hushållssamarbete

På sikt ska flera personer kunna ingå i samma hushåll och:

- se gemensamma kostnader;
- tilldelas ansvar;
- dela inköpslistor;
- dela uppgifter;
- markera saker som betalda eller klara;
- få individuella påminnelser;
- styra vad som är privat respektive gemensamt.

### 6.5 Vardagsplanering

Potentiella funktioner:

- inköpslistor;
- återkommande hushållsuppgifter;
- gemensamma påminnelser;
- enkel kalender;
- ansvarsfördelning;
- historik över utförda uppgifter.

Denna pelare får inte göra MVP:n för bred. Ekonomisk överblick och avtal bör valideras först.

---

## 7. Rekommenderad MVP

MVP:n ska bevisa tre saker:

1. Användare vill samla sina återkommande hushållskostnader i Hemmakollen.
2. Översikten och påminnelserna skapar tillräckligt värde för återkommande användning.
3. Relevanta rekommendationer kan leda till handling och intäkter utan att skada förtroendet.

### Funktioner som bör ingå

#### Konto och onboarding

- skapa konto och logga in;
- godkänna villkor och integritetspolicy;
- skapa ett hushåll;
- ange boendesituation och antal personer;
- välja vilka kostnadskategorier som finns;
- snabbregistrera de första tre till fem kostnaderna;
- visa omedelbar summering efter onboarding.

#### Hemskärm

- uppskattad total månadskostnad;
- kommande betalningar;
- antal aktiva avtal;
- prioriterade händelser eller varningar;
- genväg för att lägga till kostnad eller avtal.

#### Kostnader och avtal

- lägga till, redigera och ta bort poster manuellt;
- välja kategori och betalningsintervall;
- automatiskt räkna om kostnaden till månadsvärde;
- registrera bindnings- och uppsägningstid;
- filtrera och söka;
- se lista och detaljvy.

#### Påminnelser

- kommande betalning;
- avtalslut;
- sista dag för uppsägning;
- prishöjning eller manuell kontrollpunkt;
- inställningar för push och e-post.

#### Insikter

- grundläggande kategoriöversikt;
- förändringar som användaren själv registrerat;
- enkla regelbaserade rekommendationer;
- tydlig partner- och provisionsmärkning.

#### Enkel hushållsdelning

- bjuda in en ytterligare vuxen;
- gemensam åtkomst till valda poster;
- enkel rollmodell: ägare och medlem.

#### Administration

- hantera användare och supportärenden;
- skapa och aktivera partnererbjudanden;
- styra vilka rekommendationsregler som är aktiva;
- se grundläggande statistik och konvertering;
- logga viktiga administrativa ändringar.

### Funktioner som inte bör blockera MVP-lanseringen

- automatisk bankkoppling;
- automatisk avläsning av all e-post;
- avancerad AI-assistent;
- fullständig fakturabetalning;
- cashback-plånbok;
- avancerad budgetering;
- komplett uppgiftssystem för familjen;
- elförbrukning i realtid;
- automatisk leverantörsförhandling;
- omfattande gamification;
- stöd för flera länder och valutor.

---

## 8. Prioriterad användarresa

### Första sessionen

1. Användaren möts av ett tydligt löfte: kontroll över hushållets kostnader, kostnadsfritt.
2. Konto skapas med så få steg som möjligt.
3. Användaren skapar sitt hushåll.
4. Hemmakollen frågar vilka typer av återkommande kostnader som finns.
5. Användaren lägger till några faktiska kostnader.
6. Appen visar en första sammanställning och ett konkret värde.
7. Användaren uppmanas att lägga till avtalsdatum och aktivera påminnelser.
8. Först efter att värde skapats erbjuds hushållsinbjudan eller fler uppgifter.

### Återkommande användning

1. Användaren öppnar appen via en påminnelse eller egen kontroll.
2. Hemskärmen visar vad som har ändrats och vad som kräver uppmärksamhet.
3. Användaren öppnar en relevant händelse.
4. Hemmakollen förklarar situationen och erbjuder en åtgärd.
5. Användaren markerar händelsen som hanterad, skjuter upp den eller går vidare till jämförelse/partner.
6. Appen uppdaterar status och sparar historik.

### Kritisk princip

Varje session bör börja med svaret på: **Vad behöver jag veta eller göra just nu?** Inte med en tom dashboard eller en katalog av erbjudanden.

---

## 9. Affärsmodell och intäkter

### Grundmodell

Appen ska vara gratis för konsumenten. Hemmakollen tjänar i första hand pengar när användaren väljer en relevant produkt eller tjänst genom appen.

### Möjliga intäktskällor

- affiliateersättning;
- fast ersättning per kvalificerad lead;
- provision på genomfört byte eller köp;
- intäktsdelning med jämförelse- eller distributionspartner;
- sponsrade men tydligt märkta placeringar;
- på sikt B2B-licensiering eller white-label, om detta inte stör konsumentfokuset.

### Prioriterade partnerkategorier

- elavtal;
- hem-, bil- och personförsäkring;
- mobilabonnemang;
- bredband;
- streaming och digitala tjänster;
- matkassar och matrelaterad cashback;
- larm och smarta hemtjänster;
- bolån, privatlån eller refinansiering – endast med rätt tillstånd, partnerskap och riskhantering;
- flyttjänster;
- energibesparing och laddning.

### Kommersiell princip

Hemmakollen ska rekommendera rätt åtgärd vid rätt tillfälle, inte visa flest möjliga erbjudanden. Ett erbjudande ska inte visas enbart för att ersättningen är hög.

### Transparens

När Hemmakollen kan få ersättning ska detta framgå tydligt. Exempel:

> Om du tecknar avtalet via Hemmakollen kan vi få ersättning från leverantören. Det påverkar inte ditt pris.

Om hela marknaden inte jämförs ska detta också framgå.

---

## 10. Rekommendationsmotor – första versionen

AI är inte nödvändig för att skapa värde i början. MVP:n bör starta med tydliga, testbara regler.

### Exempel på triggers

| Trigger | Villkor | Användarmeddelande | Möjlig åtgärd |
|---|---|---|---|
| Avtal löper ut | 30 dagar kvar | Ditt avtal löper snart ut | Jämför eller förnya |
| Uppsägning krävs | Sista dag inom 14 dagar | Snart sista dagen att säga upp | Visa instruktion eller alternativ |
| Hög kostnad | Över fast eller relativt riktvärde | Den här kostnaden kan vara hög | Kontrollera erbjudanden |
| Prisökning | Nytt pris högre än tidigare | Kostnaden har ökat | Behåll, förhandla eller byt |
| Dubblett | Liknande tjänster i samma hushåll | Ni verkar betala för två liknande tjänster | Granska och avsluta |
| Provperiod | Övergår till betalning | Din provperiod blir snart betald | Behåll eller säg upp |
| Saknad kategori | Vanlig kostnad saknas | Har du redan ett relevant skydd/avtal? | Lägg till eller undersök |

### Krav på framtida intelligens

- kunna förklara varför något rekommenderas;
- skilja fakta från uppskattning;
- visa vilka data som använts;
- låta användaren rätta fel;
- undvika rekommendationer när informationen är otillräcklig;
- aldrig automatiskt byta avtal utan uttryckligt godkännande.

---

## 11. Design och varumärkesriktning

### Varumärkesidé

Namnet Hemmakollen säger precis vad produkten gör: koll på hemmet. Det ska upplevas varmt, mänskligt och lätt att säga. (Arbetsnamnet CasaVita byttes till Hemmakollen 1 oktober 2026.) Referenskänslan är ett möte mellan svenska, etablerade konsumentvarumärken och mjuk, modern teknik – mer Hemnet, IKEA och Aurora än fintech eller kryptotjänst.

### Visuell riktning

Rekommenderad riktning:

- ljusa, varma neutrala färger;
- benvit eller mjukt varm bakgrund;
- en trygg huvudfärg, exempelvis dämpad grön, blågrön eller varm terrakotta;
- begränsad användning av starka varningsfärger;
- rundade men inte barnsliga former;
- gott om luft;
- tydlig typografi;
- illustrationer eller ikoner med hemkänsla;
- diskreta rörelser som skapar liv utan att störa.

### Språk och tonalitet

Språket ska vara:

- enkelt och konkret;
- varmt men inte överdrivet personligt;
- tryggt utan myndighetston;
- handlingsinriktat;
- fritt från onödiga finans- och teknikord.

Exempel:

- Bra: “Ditt bredbandsavtal löper ut om 18 dagar.”
- Sämre: “Kontraktsperioden närmar sig terminalt datum.”
- Bra: “Du kan spara ungefär 140 kr i månaden.”
- Sämre: “Optimera hushållets återkommande OPEX.”

### Navigationsförslag för mobilappen

1. **Hem** – sammanfattning och det viktigaste just nu.
2. **Kostnader** – avtal, abonnemang och betalningar.
3. **Lägg till** – central snabbåtgärd.
4. **Hushåll** – medlemmar, delning och senare uppgifter/listor.
5. **Profil** – inställningar, notiser, säkerhet och integritet.

---

## 12. Data, integritet och säkerhet

Hemmakollen kommer att behandla privat och potentiellt känslig ekonomisk information. Förtroende måste därför vara ett produktkrav, inte bara ett juridiskt dokument.

### Grundkrav

- GDPR-anpassad behandling;
- tydlig rättslig grund för varje datatyp och behandling;
- dataminimering;
- uttryckligt samtycke där det krävs;
- möjlighet att exportera och radera data;
- tydlig information om partnerdelning;
- kryptering under överföring och lagring;
- säkra autentiseringsflöden;
- roll- och behörighetsstyrning för hushåll;
- revisionsloggar för känsliga ändringar;
- säker hantering av dokument;
- incidenthanteringsplan;
- personuppgiftsbiträdesavtal med relevanta leverantörer;
- separerade produktions- och testmiljöer;
- inga riktiga personuppgifter i utvecklings- eller demodata.

### Särskilt viktigt

- En hushållsmedlem ska inte automatiskt få se en annan persons privata kostnader.
- Samtycke till marknadsföring får inte gömmas i allmänna villkor.
- Data bör inte säljas vidare som rå kunddata.
- Finansiell rådgivning, försäkringsdistribution, kreditförmedling och betalningsfunktioner kan utlösa särskilda regelkrav. Juridisk specialist ska bedöma detta innan lansering.
- Bankkoppling ska byggas via behörig Open Banking-partner, inte genom egen hantering av bankinloggning.

---

## 13. Rekommenderad teknisk struktur

Den slutliga stacken är inte beslutad. Följande är en rekommenderad, pragmatisk struktur för en snabb men seriös MVP.

### Klient

- mobil först;
- React Native med Expo för iOS och Android, alternativt en välbyggd responsiv webbapp/PWA för snabbaste validering;
- TypeScript;
- komponentbaserat designsystem;
- tillgänglighet från start.

### Backend

- TypeScript-baserat API eller backend-as-a-service;
- PostgreSQL som huvuddatabas;
- Supabase kan vara ett lämpligt MVP-val för databas, autentisering, lagring och radnivåsäkerhet;
- schemalagda jobb för påminnelser och rekommendationstriggers;
- separat administrationsgränssnitt;
- händelselogik som senare kan flyttas till kö eller worker-system vid behov.

### Tredjepartstjänster

- transaktionell e-post;
- pushnotiser;
- produktanalys;
- felövervakning;
- samtyckes- och integritetsfunktioner;
- framtida Open Banking-leverantör;
- partner-/affiliateintegrationer.

### Föreslagen kärndatamodell

- `users`
- `households`
- `household_members`
- `expenses`
- `contracts`
- `providers`
- `categories`
- `reminders`
- `insights`
- `recommendation_rules`
- `partner_offers`
- `offer_clicks`
- `conversions`
- `documents`
- `notifications`
- `consents`
- `audit_logs`

### Viktiga arkitekturprinciper

- hushållet ska vara en central domänmodell;
- användare och hushåll får inte blandas ihop;
- privat och gemensam data ska kunna separeras;
- partnererbjudanden ska vara separerade från användarens grunddata;
- rekommendationer ska kunna granskas och förklaras;
- regler och kommersiella prioriteringar ska kunna ändras utan ny appversion;
- alla känsliga operationer ska kontrolleras på servern, inte bara i klienten.

---

## 14. Översiktlig datamodell och relationer

En användare kan vara medlem i ett eller flera hushåll. Ett hushåll har flera medlemmar, kostnader och avtal. Ett avtal kan generera påminnelser och insikter. En insikt kan kopplas till ett partnererbjudande, men ska kunna existera utan kommersiellt erbjudande.

Viktiga relationer:

- användare ↔ hushåll: många-till-många via medlemskap;
- hushåll → kostnader: en-till-många;
- kostnad → avtal: valfri relation;
- avtal → påminnelser: en-till-många;
- avtal/kostnad → insikter: en-till-många;
- insikt → partnererbjudande: noll eller en aktiv rekommendation;
- användare → samtycken: en-till-många med versionshistorik.

---

## 15. Analys, mätetal och validering

### Primärt produktmått

**Aktiva hushåll som varje månad får och hanterar minst en relevant händelse i Hemmakollen.**

Detta mäter mer verkligt värde än enbart registrerade konton.

### Aktiveringsmått

- andel som slutför onboarding;
- andel som lägger till minst tre kostnader;
- andel som registrerar minst ett avtalsdatum;
- tid till första synliga värde;
- andel som aktiverar notiser;
- andel som bjuder in en hushållsmedlem.

### Engagemang och retention

- aktiva hushåll per vecka och månad;
- retention efter 7, 30 och 90 dagar;
- antal aktiva kostnader per hushåll;
- antal öppnade och hanterade påminnelser;
- andel insikter som markeras som relevanta;
- antal avtal som uppdateras efter påminnelse.

### Kommersiella mått

- klickfrekvens på relevanta erbjudanden;
- startade jämförelser;
- kvalificerade leads;
- genomförda byten eller köp;
- intäkt per aktivt hushåll;
- intäkt per partnerkategori;
- återtag eller annullerade affärer;
- uppskattad användarbesparing;
- klagomål eller avregistrering efter erbjudanden.

### Förtroendemått

- andel användare som förstår varför en rekommendation visas;
- rapporterade fel i kostnader och insikter;
- antal integritets- och supportärenden;
- andel rekommendationer som avfärdas som irrelevanta;
- NPS eller motsvarande förtroendefråga.

---

## 16. Rekommenderad roadmap

### Fas 0 – Validering och beslut

Mål: bekräfta problem, målgrupp och MVP innan omfattande utveckling.

- genomför 15–25 användarintervjuer;
- testa klickbar prototyp;
- testa vilka kostnader användarna är villiga att registrera;
- kartlägg juridiska risker;
- välj teknisk stack;
- definiera varumärke och enkel designgrund;
- definiera de första tre partnerkategorierna;
- skapa mätplan;
- besluta exakt MVP-scope.

### Fas 1 – MVP

Mål: låta riktiga hushåll skapa överblick och få relevanta påminnelser.

- konto och hushåll;
- manuell registrering;
- dashboard;
- avtal och abonnemang;
- påminnelser;
- regelbaserade insikter;
- ett begränsat antal partnererbjudanden;
- enkel administration;
- analys och felövervakning;
- slutna betatester.

### Fas 2 – Förbättrad automation

Mål: minska manuellt arbete och förbättra relevansen.

- dokument- och kvittotolkning;
- import via e-post med uttryckligt samtycke;
- förbättrade kostnadskategorier;
- fler hushållsroller;
- mer precisa rekommendationer;
- bättre partnerintegrationer;
- experiment med onboarding och retention.

### Fas 3 – Bank- och dataintegrationer

Mål: göra översikten mer automatisk.

- Open Banking via godkänd partner;
- automatisk identifiering av återkommande transaktioner;
- användarbekräftelse innan poster skapas;
- pris- och avtalsbevakning;
- fler leverantörsintegrationer;
- avancerad besparingsanalys.

### Fas 4 – Komplett hemmapartner

Mål: bredda från ekonomisk kontroll till hela hushållets samordning.

- inköpslistor;
- uppgifter och ansvar;
- familjekalender;
- flyttflöden;
- energi- och förbrukningsinsikter;
- proaktiv assistent;
- ytterligare tjänster där tydligt användarvärde finns.

---

## 17. Lanseringsstrategi

### Rekommenderad första lansering

1. Rekrytera en sluten grupp på cirka 30–50 hushåll.
2. Hjälp dem personligen genom onboarding.
3. Följ upp efter första dagen, första veckan och första månaden.
4. Mät inte bara registrering – kontrollera om appen förändrar ett verkligt beteende.
5. Justera registreringen och påminnelserna innan bredare lansering.
6. Expandera till 200–500 hushåll.
7. Lägg till kommersiella erbjudanden stegvis, med tydlig mätning av förtroende och konvertering.

### Möjliga förvärvskanaler

- korta videor med konkreta hushållsbesparingar;
- SEO-innehåll om abonnemang, avtal och hushållskostnader;
- guider för den som flyttar hemifrån eller blir sambo;
- rekommendationsprogram mellan hushåll;
- partnerskap med mäklare, flyttjänster och bostadsaktörer;
- jämförelse- och affiliatepartners;
- relevanta kreatörer inom privatekonomi, hem och vardagsplanering;
- PR kring kostnadsfri och transparent hushållshjälp.

### Innehållsvinklar

- “Vad kostar ditt hushåll egentligen varje månad?”
- “Fem abonnemang många glömmer att de betalar för.”
- “Så håller sambor koll på gemensamma kostnader.”
- “Avtalen du bör kontrollera före flytten.”
- “När är det faktiskt värt att byta elavtal?”

---

## 18. Största riskerna och hur de bör hanteras

### För bred produkt

**Risk:** Hemmakollen försöker samtidigt bli budgetapp, uppgiftssystem, kalender, jämförelsesajt och AI-assistent.  
**Motåtgärd:** Låt överblick över återkommande kostnader, avtal och rätt tajmade påminnelser vara MVP-kärnan.

### För mycket manuell registrering

**Risk:** Användaren lämnar innan appen skapat värde.  
**Motåtgärd:** Kort onboarding, smarta standardval, stegvis komplettering och senare säkra importfunktioner.

### Lågt förtroende

**Risk:** Rekommendationer uppfattas som reklam.  
**Motåtgärd:** Förklara varför rekommendationen visas, redovisa ersättning och tillåt icke-kommersiella råd.

### Regulatorisk komplexitet

**Risk:** Funktioner går in i reglerad rådgivning, försäkringsdistribution, kreditförmedling eller betalning.  
**Motåtgärd:** Juridisk granskning innan sådana flöden designas eller marknadsförs.

### Felaktiga insikter

**Risk:** Systemet tolkar data fel och ger dåliga råd.  
**Motåtgärd:** Användarbekräftelse, tydliga uppskattningar, förklarbar logik och enkel felrapportering.

### Svag retention

**Risk:** Användaren gör en engångskontroll och återkommer inte.  
**Motåtgärd:** Avtalsbevakning, förändringsnotiser, månadssammanfattning och händelser som skapar återkommande värde.

### Beroende av partner

**Risk:** Intäkten eller användarupplevelsen blir beroende av ett fåtal partners.  
**Motåtgärd:** Flera kategorier och leverantörer, egna användarvärden och tydliga reservflöden utan erbjudande.

---

## 19. Öppna beslut som måste fattas

Följande ska inte betraktas som slutligt beslutat:

### Produkt

- Ska första versionen vara mobilapp, PWA eller båda?
- Är hushållsdelning ett lanseringskrav eller version 1.1?
- Ska inköpslistor och uppgifter finnas i MVP:n eller först efter validering av ekonomidelen?
- Vilka tre kostnadskategorier ska få bäst specialstöd först?
- Ska användaren kunna ladda upp dokument i första versionen?

### Data och integrationer

- Ska MVP:n vara helt manuell?
- Vilken Open Banking-partner är aktuell på sikt?
- Ska e-postimport byggas, och i så fall hur begränsas åtkomsten?
- Vilka externa pris- och jämförelsedata finns med kommersiellt användbara villkor?

### Affär

- Vilka partnerkategorier kan Hemmakollen faktiskt teckna avtal inom först?
- Ska samarbeten ske direkt med leverantörer eller genom affiliatenätverk/jämförelsepartner?
- Hur beräknas och visas uppskattad besparing?
- Vilka kommersiella regler ska förhindra att provision styr rekommendationer fel?

### Varumärke

- Är Hemmakollen slutligt bolags- och produktnamn?
- Är domän, sociala användarnamn och varumärkesskydd kontrollerade?
- Vilken slutlig logotyp, färgpalett och typografi ska användas?
- Ska namnet kommuniceras med eller utan ett förklarande tillägg?

### Organisation

- Vilka personer ansvarar för produkt, teknik, partnerskap, juridik, design och marknadsföring?
- Vilken budget och lanseringstid finns?
- Ska utvecklingen göras internt, med byrå eller genom en kombination?

---

## 20. Rekommenderad projektstruktur

Projektet bör organiseras i följande arbetsområden:

### 1. Strategi och beslut

- vision;
- målgrupp;
- MVP-scope;
- affärsmodell;
- mätetal;
- beslutsliggare.

### 2. Produkt

- krav;
- användarresor;
- backlog;
- acceptanskriterier;
- användartester;
- releaseplan.

### 3. Design och varumärke

- varumärkesplattform;
- designsystem;
- prototyper;
- copy;
- tillgänglighet;
- design-QA.

### 4. Teknik

- arkitektur;
- datamodell;
- integrationer;
- miljöer;
- testning;
- säkerhet;
- drift och incidenter.

### 5. Juridik och integritet

- bolags- och partneravtal;
- användarvillkor;
- integritetspolicy;
- samtycken;
- GDPR-register;
- regulatorisk analys;
- personuppgiftsbiträden.

### 6. Partnerskap och intäkter

- prioriterade kategorier;
- partnerlista;
- kontaktstatus;
- ersättningsmodeller;
- integrationer;
- konvertering och avräkning.

### 7. Go-to-market

- målgrupp och budskap;
- betaprogram;
- innehåll;
- kanaler;
- kampanjer;
- PR;
- referrals.

### 8. Kundinsikt och support

- intervjuer;
- feedback;
- supportärenden;
- produktproblem;
- önskemål;
- kunskapsbank.

---

## 21. Förslag på första backlog

### P0 – måste göras före byggstart

- besluta exakt problem och MVP-scope;
- definiera primär persona;
- ta fram klickbar prototyp;
- genomföra användartester;
- besluta datamodell och behörighetsmodell;
- genomföra inledande juridisk kartläggning;
- välja teknisk stack;
- definiera de viktigaste produktmätetalen;
- kontrollera namn, domän och varumärkesrisk;
- skapa visuell grund och designsystem.

### P1 – MVP-utveckling

- autentisering;
- skapa hushåll;
- onboarding;
- kostnadsregistrering;
- avtalsregistrering;
- månadssummering;
- kommande händelser;
- påminnelser;
- regelbaserade insikter;
- enkel delning;
- administrationsvy;
- partnererbjudanden;
- samtycken och dataradering;
- analys och felövervakning;
- testautomatisering för kritiska flöden.

### P2 – efter första beta

- dokumentuppladdning;
- smartare import;
- förbättrad hushållsdelning;
- flera partnerkategorier;
- mer avancerade insikter;
- månadsrapport;
- export;
- rekommendationsprogram;
- experimentplattform.

---

## 22. Definition of Done

En funktion är inte klar enbart för att den syns i gränssnittet. Den är klar när:

- användarflödet är definierat;
- designen följer designsystemet;
- mobil och relevanta skärmstorlekar fungerar;
- tomma lägen, laddning och fel är hanterade;
- behörighet kontrolleras på servern;
- relevanta händelser mäts;
- tillgängligheten är kontrollerad;
- automatiska och manuella tester är genomförda;
- copy är begriplig och konsekvent;
- säkerhets- och integritetskonsekvenser är bedömda;
- support eller administration kan hantera vanliga problem;
- acceptanskriterierna är godkända.

---

## 23. Exempel på acceptanskriterier för första kärnflödet

### Lägg till återkommande kostnad

- Användaren kan välja kategori och leverantör.
- Användaren kan ange kostnad och betalningsintervall.
- Systemet visar korrekt beräknad genomsnittlig månadskostnad.
- Användaren kan ange nästa betalningsdatum.
- Användaren kan välja om posten är privat eller delad med hushållet.
- Endast behöriga hushållsmedlemmar kan läsa eller ändra posten.
- Posten visas omedelbart i hushållets summering när den är gemensam.
- Valideringsfel förklaras på enkel svenska.
- Händelser för skapad och slutförd post loggas utan att känsliga belopp skickas till onödiga analysverktyg.

### Påminnelse om avtalslut

- Användaren kan ange slutdatum och uppsägningstid.
- Systemet beräknar sista relevanta åtgärdsdag.
- Påminnelsen visas i appen och, om användaren valt det, via push eller e-post.
- Användaren kan markera som hanterad eller skjuta upp.
- Hemmakollen visar inte ett partnererbjudande om relevansregeln saknar tillräcklig information.
- Kommersiell ersättning märks tydligt när ett erbjudande visas.

---

## 24. Arbetsprinciper för AI och utvecklingsassistenter

När Claude, ChatGPT, Codex eller annan assistent arbetar med projektet ska den:

- börja med att läsa denna handoff och aktuell kod/dokumentation;
- kontrollera befintlig struktur innan nya filer eller system skapas;
- inte ändra produktens kärna utan uttryckligt beslut;
- inte hitta på partners, avtal, tillstånd eller användardata;
- dokumentera större arkitekturbeslut;
- skapa små, testbara leveranser;
- bevara användarens integritet och tydlig kommersiell transparens;
- prioritera mobil användbarhet;
- skriva all konsumentcopy på naturlig svenska;
- skapa exempeldata som är helt fiktiv;
- redovisa antaganden och öppna frågor;
- lämna en uppdaterad status och nästa steg efter varje större leverans.

### Färdig startprompt till Claude eller annan AI

> Du tar nu över arbetet med Hemmakollen. Läs hela projekthandoff-dokumentet innan du börjar. Hemmakollen är en kostnadsfri svensk konsumentapp som ska samla hushållets återkommande kostnader, avtal och viktiga vardagshändelser, och hjälpa användaren att fatta bättre beslut vid rätt tidpunkt. Produkten ska kännas varm, trygg, enkel och hemnära – inte som ett kallt finansverktyg eller en aggressiv jämförelsesajt. Intäkter ska främst komma från transparent partnerersättning när en relevant användare frivilligt går vidare med ett erbjudande.
>
> Börja varje uppgift med att kontrollera om den tillhör beslutad MVP, senare roadmap eller ett öppet beslut. Hitta inte på beslut. Skydda användarnas data, håll lösningen enkel och mobilanpassad, och dokumentera antaganden. Om du arbetar med kod ska du först granska befintligt repository, instruktioner och aktuell status. Om något centralt saknas ska du ställa konkreta frågor innan du bygger en lösning som låser projektet.
>
> Din första leverans ska innehålla: 1) din förståelse av projektets kärna, 2) de viktigaste öppna besluten för den aktuella uppgiften, 3) en prioriterad arbetsplan och 4) vad som uttryckligen inte ska göras ännu.

---

## 25. Rekommenderade nästa steg från dagens läge

1. Bekräfta att Hemmakollen är slutligt namn och kontrollera domän, bolagsnamn och varumärkesrisk.
2. Bestäm den exakta första målgruppen: ensamhushåll, sambor eller båda.
3. Lås MVP:n till överblick, avtal, påminnelser och ett begränsat antal relevanta insikter.
4. Bestäm om första leveransen ska vara PWA eller native-app.
5. Intervjua minst 15 potentiella användare innan full utveckling.
6. Skapa en klickbar designprototyp för onboarding, hemskärm, lägg till kostnad och avtalsvarning.
7. Testa prototypen med minst fem personer och mät tid till första värde.
8. Kartlägg juridiska krav och risker för data, marknadsföring, jämförelser och partnerersättning.
9. Inled partnersamtal inom el, mobil/bredband och försäkring eller välj tre andra validerade startkategorier.
10. Skapa teknisk grund, datamodell, säkerhetsmodell och miljöstrategi.
11. Bygg en begränsad beta och följ de första hushållen personligen.
12. Utöka först när aktivering, retention, relevans och förtroende är bevisade.

---

## 26. Kort slutbild

Hemmakollen ska inte bara tala om vart pengarna gick. Produkten ska förstå hushållets återkommande åtaganden, uppmärksamma användaren när något faktiskt spelar roll och hjälpa till att genomföra ett bättre nästa steg.

Den vinnande första versionen är därför inte den med flest funktioner. Det är den som snabbast får en användare att känna:

> “Nu har jag koll på mitt hem, och Hemmakollen säger till när jag behöver göra något.”

Detta är projektets kärna och ska bevaras genom produktutveckling, partnerskap, design och kommersiella beslut.
