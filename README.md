# Country Explorer

Country Explorer är en liten webbapp för att utforska världens länder och territorier. Varje kort visar flagga, namn, huvudstad, region och befolkning. Appen är byggd med HTML, vanlig CSS och JavaScript, med Vite för utveckling och bygge samt Vitest för automatiserade tester.

## Funktioner

- Sök på hela eller delar av ett lands engelska namn, till exempel `Sweden`. Sökningen bortser från stora och små bokstäver samt blanksteg i början och slutet.
- Filtrera på region och kombinera regionen med sökningen. Gränssnittet visar svenska regionnamn, men använder API:ets engelska värden, till exempel `Europe` för Europa.
- Rensa båda filtren med knappen **Rensa filter**.
- Se antal träffar samt tydliga meddelanden vid laddning, nätverksfel, tomma API-svar och sökningar utan resultat. Vid hämtningsfel finns **Försök igen**.
- Använd appen på mobil eller dator och navigera med tangentbordet.

## Externt API

Appen hämtar REST Countries v3.1-data via den publika [Conventus-spegeln](https://restcountries.conventus.de/):

```text
https://restcountries.conventus.de/v3.1/all?fields=name,capital,region,population,flags,cca3
```

Fälten begränsar svaret till den landinformation appen behöver. `cca3` är en landkod som också ingår i svaret. Ingen API-nyckel eller annan konfiguration behövs. Internetanslutning krävs för att hämta data och flaggbilder.

Den föreslagna adressen på `restcountries.com/v3.1/all` är avvecklad. Vid kontroll gav den ett felobjekt i stället för en lista, trots HTTP-status 200. Den ursprungliga tjänstens [dokumentation om API-versioner](https://restcountries.com/docs/countries/api-versions) beskriver att de äldre versionerna är avvecklade. Därför används spegeln, som behåller v3.1-formatet.

`fetchCountries` kontrollerar HTTP-status och att svaret är en lista med giltiga namn och regioner. Förfrågan avbryts efter 15 sekunder med `AbortSignal.timeout`. Efter hämtningen sparas listan i minnet; sökning och filtrering gör inga nya API-anrop.

## Installera och starta

Du behöver Node.js 24 eller senare samt npm. Projektet har kontrollerats med Node.js 24. Öppna en terminal i projektmappen där `package.json` ligger.

```bash
npm ci
npm run dev
```

`npm install` fungerar också för installation. Öppna den lokala adress som Vite skriver ut i terminalen.

Kör testerna en gång, utan bevakningsläge:

```bash
npm test
```

Skapa ett produktionsbygge och förhandsvisa det lokalt:

```bash
npm run build
npm run preview
```

Bygget hamnar i `dist/`. Förhandsvisningen behöver samma internetanslutning till API:et som utvecklingsversionen.

## Projektstruktur

```text
country-explorer/
├── public/
│   └── favicon.svg
├── src/
│   ├── api.js              # Hämtning, validering och sortering
│   ├── api.test.js         # Tester av lyckade och felaktiga API-svar
│   ├── filters.js          # Sökning och regionfilter
│   ├── filters.test.js     # Tester av filtreringen
│   ├── main.js             # Händelser, appens data och status
│   ├── render.js           # Skapar och uppdaterar landkorten
│   └── style.css           # Layout och responsiv stil
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── TECHNICAL_REFLECTION.md
└── KANBAN.md
```

`node_modules/` skapas vid installation och `dist/` vid bygge. De versionshanteras inte.

## Tillgänglighet och UX

Sökfältet och regionväljaren har kopplade `label`-element. Sidans struktur använder bland annat `header`, `main`, `section`, rubriker och en lista med landkort. Vanliga knappar och formulärkontroller fungerar med tangentbordet, och `:focus-visible` ger en tydlig fokusmarkering. En hopplänk leder direkt till innehållet.

Flaggor har alt-text som anger landet. SVG används när en sådan adress finns, annars används PNG. Statusmeddelanden har `role="status"` och `aria-live="polite"`, och listan markeras med `aria-busy` under laddning. Efter att filtren rensats flyttas fokus till sökfältet. Saknade uppgifter och flaggor får begripliga ersättningstexter.

## Säkerhet

Projektet innehåller ingen API-nyckel. Extern text läggs in med `document.createElement` och `textContent`, så att text från API:et inte tolkas som HTML. Flaggbilder accepteras bara med HTTPS-adresser. API-svaret valideras innan det används, och lokala miljöfiler är undantagna i `.gitignore`.

## Tester

`src/filters.test.js` testar bland annat delvisa namn, regioner, kombinerade filter, tomma resultat och att den ursprungliga listan inte ändras. `src/api.test.js` använder simulerade svar för att testa sortering, tomma svar, nätverksfel, HTTP-fel och ogiltig data. Tester gör alltså inga anrop till det externa API:et. Manuell kontroll av appen behövs också för layout, tangentbord och hela användarflödet.

Vid slutkontrollen godkändes alla 21 tester och produktionsbygget. Appen kontrollerades också i Chrome med riktiga API-data, sökning och filter, tangentbord och mobil layout. Laddning, fel, nytt försök, tomma svar och saknade uppgifter kontrollerades med simulerade svar.
