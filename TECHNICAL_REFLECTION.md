# Teknisk reflektion

## 1. Från interaktion till resultat

Ett exempel är att användaren skriver `Swed` i sökfältet. Då utlöses ett `input`-event som kör `updateResults` i `src/main.js`. Funktionen läser både sökfältets värde och den valda regionen och skickar dem till `filterCountries` i `src/filters.js`.

Landinformationen kommer från API:et, men hämtas inte igen vid varje tangenttryckning. `loadCountries` har redan hämtat den med `fetchCountries` och sparat listan i variabeln `countries`. `filterCountries` jämför namnen utan hänsyn till stora och små bokstäver och behåller bara länder som även matchar regionen.

Den filtrerade listan skickas sedan till `renderCountries` i `src/render.js`. Där skapas nya listelement och kort med `document.createElement`. Texten sätts med `textContent`, och `replaceChildren` ersätter listans gamla innehåll. Till sist uppdaterar `updateResults` antalet träffar och statusmeddelandet. Om inget land matchar visas ett meddelande som hjälper användaren att ändra eller rensa filtren.

## 2. Tekniska val

Jag valde att dela upp JavaScript efter ansvar. `api.js` hämtar och kontrollerar data, `filters.js` filtrerar, `render.js` skapar kort och `main.js` kopplar ihop delarna med händelser och status. Det gör flödet lättare att följa och filtreringen går att testa utan en webbläsare. Ett alternativ hade varit att lägga allt i `main.js`, men då hade hämtning, DOM och logik blandats mer.

Jag valde också att hämta länderna en gång och sedan filtrera listan i minnet. För den här lilla datamängden ger det snabb återkoppling och färre nätverksanrop. Ett alternativ hade varit att anropa ett sök-API varje gång användaren skriver, men då hade även sökningen behövt hantera väntetid och nätverksfel.

REST Countries-data hämtas via Conventus-spegeln eftersom den ursprungliga v3.1-adressen är avvecklad. Spegeln behåller det format som används i uppgiften och kräver ingen nyckel. Det är ett beroende av en extern tjänst, så appen visar ett fel och en knapp för nytt försök om hämtningen misslyckas. `AbortSignal.timeout(15000)` förhindrar att den väntar hur länge som helst.

## 3. Tillgänglighet, UX och säkerhet

Sökfältet och regionväljaren har riktiga etiketter, vilket gör deras syfte tydligt även för skärmläsare. Semantiska element och rubriker beskriver sidans struktur. Tangentbordsanvändare får en tydlig fokusmarkering och kan använda en hopplänk till huvudinnehållet. Flaggbilderna har alt-text med landets namn, och statusmeddelandet använder `aria-live="polite"` för att meddela uppdateringar.

Ett UX-val är att sökning och regionfilter kan användas samtidigt och att antalet träffar visas direkt. Knappen **Rensa filter** återställer båda kontrollerna och placerar fokus i sökfältet. Under laddning är filtren avstängda, och vid fel visas **Försök igen**. Det blir tydligt vad användaren kan göra i varje läge.

En säkerhetsrisk är att text från ett externt API skulle kunna innehålla HTML eller skript. Korten byggs med `createElement` och `textContent`, så texten visas som text i stället för att köras. Koden kontrollerar också API-svarets grundstruktur och tillåter bara HTTPS-adresser för flaggbilder. Ingen känslig API-nyckel behövs eller ligger i projektet.

## 4. Testning

I `src/filters.test.js` finns testet `excludes name matches outside the selected region`. Det söker efter `ind` och väljer `Europe`. Testdatan innehåller India och Indonesia i Asia, så resultatet ska bli en tom lista.

Det är viktigt eftersom både sökningen och regionen måste stämma. Om logiken råkade använda antingen namn eller region som villkor skulle appen kunna visa länder utanför användarens valda region. Testet kontrollerar den här kombinationen utan att vara beroende av nätverket. API-testerna täcker dessutom misslyckade förfrågningar och felobjekt som kommer med HTTP-status 200.

## 5. AI och förbättring

AI användes som hjälp för att planera arbetet, skriva delar av kod och dokumentation, granska lösningen och föreslå förbättringar. Förslagen granskades och justerades för att passa en liten app med vanlig JavaScript. Ett konkret exempel är att API-adressen behövde ändras efter att det gamla svaret kontrollerats.

Implementationen kontrollerades genom att köra appen i Chrome, köra testerna med `npm test` och bygga med `npm run build`. Alla 21 tester godkändes och bygget lyckades. Sökning, regionfilter och deras kombination kontrollerades med riktiga API-data, liksom tangentbordsanvändning och mobil layout. Laddning, fel, nytt försök, tomma svar och saknade uppgifter kontrollerades med simulerade svar. Webbläsarkontrollen upptäckte också en trasig PNG-adress för en flagga, så koden justerades till att föredra SVG och använda PNG om SVG-adressen saknas.

Med mer tid skulle jag lägga till stöd för svenska landsnamn i sökningen. Just nu använder appen API:ets engelska namn och visar en hjälptext om det. Svenska namn skulle göra sökningen mer naturlig för en svensk användare.
