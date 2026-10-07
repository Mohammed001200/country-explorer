# Teknisk reflektion

## 1. Från interaktion till resultat

Jag har gjort så att sökningen uppdateras medan användaren skriver. Om användaren skriver `Swed` i sökfältet körs ett `input`-event. Det startar funktionen `updateResults` i `src/main.js`.

`updateResults` läser söktexten och den valda regionen. Sedan körs `filterCountries` i `src/filters.js`. Den filtrerar listan och behåller länder som passar både sökningen och regionen. Stora och små bokstäver spelar ingen roll.

När användaren söker har länderna redan hämtats från API:et. Hämtningen startar när sidan öppnas. Det görs i `loadCountries` med hjälp av `fetchCountries`. Listan sparas i variabeln `countries`. Därför behöver appen inte hämta samma data igen varje gång användaren skriver.

Efter filtreringen visar `renderCountries` resultatet på sidan. Funktionen finns i `src/render.js` och skapar landkorten med `document.createElement`. Texten läggs in med `textContent`. Med `replaceChildren` byts de gamla korten ut mot de nya. `updateResults` uppdaterar också antalet träffar och meddelandet på sidan. Om inget land hittas visas en text som förklarar det.

## 2. Tekniska val

Jag valde att dela upp JavaScript i fyra filer. `api.js` hämtar och kontrollerar landinformationen. `filters.js` sköter sökning och regionfilter. `render.js` skapar korten på sidan. `main.js` kopplar ihop delarna och hanterar det som användaren gör.

Jag tycker att uppdelningen gör koden lättare att läsa. Jag vet vilken fil jag ska titta i när jag vill ändra något. Jag kan också testa filtreringen utan att öppna en webbläsare. Ett alternativ hade varit att skriva all JavaScript i `main.js`. Det hade fungerat, men filen hade blivit längre och svårare att hitta i.

Mitt andra val var att hämta alla länder en gång och sedan filtrera dem lokalt i webbläsaren. Jag tycker att det passar bra eftersom listan är ganska liten. Sökningen blir snabb och behöver inte vänta på API:et varje gång. Ett alternativ hade varit att göra ett nytt API-anrop för varje sökning. Då hade sökningen också kunnat bli långsam eller misslyckas om nätverket inte fungerade.

Jag använder REST Countries via Conventus-spegeln. Den ursprungliga v3.1-adressen är avvecklad. Spegeln ger data i samma format och kräver ingen API-nyckel. Om hämtningen misslyckas visar appen ett fel och knappen **Försök igen**. Förfrågan avbryts efter 15 sekunder så att appen inte väntar hur länge som helst.

## 3. Tillgänglighet, UX och säkerhet

Jag har kopplat `label`-element till sökfältet och regionväljaren. Det gör det tydligt vad kontrollerna används till. Etiketterna hjälper också den som använder en skärmläsare.

Jag har lagt till en tydlig fokusmarkering med `:focus-visible`. När användaren går fram med Tab syns det vilken kontroll som är vald. Appen har också en hopplänk till huvudinnehållet. Flaggorna har alt-text med landets namn, så att det går att förstå vilken flagga bilden visar.

Jag använder semantisk HTML, till exempel `header`, `main`, `section` och rubriker. De hjälper till att beskriva sidans delar. Statusmeddelandet har `aria-live="polite"`. Det gör att en skärmläsare kan meddela när resultatet ändras.

Jag ville göra appen enkel att använda. Därför fungerar sökning och regionfilter tillsammans, och antalet träffar visas direkt. **Rensa filter** tömmer sökfältet och återställer regionen. Fokus hamnar sedan i sökfältet. När länderna laddas är filtren avstängda och ett meddelande visas. Vid fel går det att försöka igen.

En säkerhetsrisk som jag har tagit hänsyn till är XSS. Det kan hända om text från ett API tolkas som HTML och innehåller skadlig kod. Därför använder jag `createElement` och `textContent` när korten byggs. Jag lägger inte extern data direkt i `innerHTML`. Då visas innehållet som text. Appen kontrollerar också formatet på API-svaret och tillåter bara HTTPS-adresser för flaggbilder. Jag har ingen känslig API-nyckel i projektet.

## 4. Testning

Jag har valt testet `excludes name matches outside the selected region` i `src/filters.test.js`. Det söker efter `ind` och väljer regionen `Europe`. I testlistan finns India och Indonesia, men båda ligger i `Asia`. Därför ska resultatet vara en tom lista.

Jag tycker att testet behövs eftersom sökningen och regionfiltret ska fungera tillsammans. Om koden bara tog hänsyn till namnet skulle India och Indonesia kunna visas trots att användaren valt Europa. Testet hjälper mig att upptäcka ett sådant fel. Det använder en liten testlista och behöver ingen internetanslutning. Det finns också API-tester för misslyckade hämtningar och felaktiga svar, även när HTTP-statusen är 200.

## 5. AI och förbättring

Jag använde AI/Codex som hjälp i projektet. Codex hjälpte mig att planera arbetet, skapa delar av koden, testa och granska lösningen och skriva dokumentationen. Jag har läst igenom lösningen för att förstå hur delarna fungerar och hänger ihop.

Jag öppnade också appen själv och testade sökningen, regionfiltret och kombinationen av dem. Jag gick igenom resultatet för att se att appen visade rätt länder.

Codex hjälpte också till att köra de automatiserade testerna med `npm test` och bygget med `npm run build`. Alla 21 tester gick igenom och bygget lyckades. Det var Codex som körde dessa kommandon. Codex kontrollerade även appen i Chrome med riktiga API-data, tangentbord och mobil layout. Laddning, fel, nytt försök, tomma svar och saknade uppgifter kontrollerades med simulerade svar.

Jag gick igenom det Codex gjorde och testade att appen fungerade. Några saker behövde också ändras under arbetet. Den gamla API-adressen fungerade till exempel inte och behövde bytas. Vid kontrollen hittades också en trasig PNG-adress för en flagga. Koden ändrades därför till att använda SVG i första hand och PNG om SVG-adressen saknas.

Med mer tid skulle jag vilja lägga till stöd för svenska landsnamn. Nu behöver användaren söka på engelska namn, och det står i hjälptexten vid sökfältet. Jag tycker att svenska namn skulle göra appen enklare att använda för en svensk användare.