# Hemma Kollen — produktspecifikation

## Produktlöfte

Hemma Kollen ger svenska hushåll ett gemensamt ställe för det som annars
försvinner mellan inkorgar, lappar och chattar: räkningar, sysslor, avtal och
viktiga datum. Appen ska minska vardagsstress först och hitta onödiga kostnader
som ett extra värde.

## Beslutad leveransordning

1. Ett versionshanterat GitHub-repo med automatiska kvalitetskontroller.
2. En säker Supabase-databas för användare och hushållsdata.
3. En mobilanpassad webbapp som kopplas till databasen.
4. Fakturaimport och tolkning efter att manuell registrering är stabil.
5. Partner- och besparingsflöden efter att kärnnyttan är verifierad.

## Målgrupp

Par, familjer och andra personer som delar ett hem och behöver samsyn kring
pengar och ansvar utan att införa ännu ett tungt projektverktyg.

## MVP-flöde

1. Användaren skapar konto via en e-postlänk.
2. Användaren skapar eller ansluter till ett hushåll.
3. Hushållet registrerar en räkning, syssla, ett inköp eller avtal manuellt.
4. Alla medlemmar ser samma uppdaterade översikt.
5. En medlem markerar räkningen betald eller sysslan klar.
6. Hemma Kollen visar nästa viktiga datum och veckans framsteg.
7. När tillräcklig kostnadsdata finns visas ett transparent besparingsförslag.

## Ingår i första byggfasen

- E-postbaserad autentisering.
- Ett hushåll och flera medlemmar.
- Medlemsrollerna ägare och medlem.
- Räkningar: leverantör, kategori, belopp, förfallodatum och status.
- Sysslor: titel, ansvarig, deadline, status och enkel återkomst.
- Inköp: namn, mängd, kategori och köpstatus i en gemensam lista.
- Avtal: kategori, undertyp, leverantör, månadskostnad och nästa viktiga datum.
- Avtalskategorier: försäkringar, bredband, streaming/TV, mobil, el, vatten och gym.
- Försäkringsundertyper: hem, bil, djur, resa, person och annat.
- Översikt, Sysslor, Inköpslista, Räkningar och Jämför avtal som separata
  mobilanpassade huvudval.
- Manuell inmatning som alltid fungerande reservväg.
- Supabase RLS, tidsstämplar och grundläggande datavalidering.
- Demo-läge när backend saknas.
- Lint, tester, produktionsbygge och GitHub Actions.

## Nästa byggfas

- Inbjudningar till hushåll.
- Uppladdning av PDF eller bild på räkning.
- Extraktion av leverantör, belopp och förfallodatum.
- Rättningsvy innan importerade uppgifter sparas.
- Dokumentöversikt och påminnelser.
- Partnerlänk, attribution och händelsemätning.

## Inte i första versionen

- Open Banking eller automatisk bankåtkomst.
- Kivra-integration.
- Automatisk Swish-bekräftelse.
- Egen försäkringsrådgivning eller försäkringsförmedling.
- Betalabonnemang.
- Matbeställning, hantverkar- eller marknadsplatsfunktioner.
- Avancerad AI-chat.

## Datamodell

### Profil

Kopplas 1:1 till Supabase Auth. Innehåller endast visningsnamn och tekniska
tidsstämplar.

### Hushåll och medlemskap

Varje hushåll har en skapare. Medlemskapet binder användaren till hushållet och
styr om personen är ägare eller medlem. Ägare administrerar hushållet;
medlemmar arbetar med dess vardagsdata.

### Räkning

Tillhör exakt ett hushåll. Kärnfält är leverantör, kategori, belopp,
förfallodatum, status och källa. Källan visar om uppgifterna är manuella,
OCR-tolkade eller senare kommer från Open Banking.

### Syssla

Tillhör exakt ett hushåll. Kärnfält är titel, ansvarig, deadline, status,
kategori och eventuell återkomst.

### Inköpsvara

Tillhör exakt ett hushåll och syns för alla medlemmar. Kärnfält är namn, mängd,
kategori och status. Kategorierna är mat, hushåll, djur och övrigt.

### Avtal och abonnemang

Tillhör exakt ett hushåll. Kärnfält är kategori, eventuell undertyp, namn,
leverantör, månadskostnad, status och eventuellt förnyelse- eller slutdatum.
Försäkring har tydliga undertyper för hem, bil, djur, resa och person, medan
övriga kategorier är bredband, streaming/TV, mobil, el, vatten och gym.

## Behörighet och integritet

- All hushållsdata har RLS aktiverat.
- Endast hushållets medlemmar får läsa och ändra räkningar, sysslor, inköp och avtal.
- Endast ägare får administrera hushåll och medlemskap.
- En medlem får inte läsa eller gissa data från ett annat hushåll.
- Klienten använder endast publik URL och anon key; service role key får aldrig
  exponeras i webbläsaren.
- Export, fullständig radering och lagringstider specificeras innan publik beta.

## Besparingsmotorn

Motorn är deterministisk och får datum injicerat för testbarhet. Den kan reagera
på kostnad över ett verifierat riktmärke, tydlig prisökning eller ett avtal som
snart löper ut. Alla belopp presenteras som uppskattningar och med synliga
antaganden.

Regulatorisk copy säger exempelvis **”vi hittade ett alternativ hos X”**. Den
säger aldrig **”vi rekommenderar”** när försäkring berörs.

## Acceptanskriterier för byggstarten

- [x] Produktnamnet är Hemma Kollen i klient och dokumentation.
- [x] Webbappen har fungerande vyer för översikt, räkningar och sysslor.
- [x] Webbappen har separata vyer för gemensamma inköp och avtal/abonnemang.
- [x] Alla beslutade avtalskategorier och försäkringsundertyper finns i klienten.
- [x] Inköp och avtal har CRUD-grund, demo-data och RLS-migrering.
- [x] Räkningar och sysslor kan läggas till och ändra status i demo-läge.
- [x] Auth, första hushållet och CRUD är kopplade till Supabase-klienten.
- [x] Databasmigrering med RLS finns versionshanterad.
- [x] GitHub Actions-konfiguration finns.
- [x] Test, lint och produktionsbygge passerar lokalt.
- [ ] GitHub-repot är skapat och den lokala historiken är pushad.
- [ ] Supabase-projektet är skapat, länkat och migreringen är applicerad.
- [ ] Miljövariabler är kopplade till en publicerad webbversion.

## Mätetal inför beta

- Minst 80 % klarar att lägga till en räkning utan instruktion.
- Tid till första sparade hushållspost är under två minuter.
- Minst 90 % av manuellt eller automatiskt tolkade kärnfält är korrekta efter
  användarens rättning.
- Inga kritiska data- eller behörighetsincidenter.
