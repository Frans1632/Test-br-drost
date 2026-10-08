# Tryck & studs!

En första hemsida att lära sig med: dra ned brödrostens spak så hoppar brödet upp, eller starta raketen och se den räkna ned från tre.

## Öppna hemsidan

Dubbelklicka på `index.html`. Sidan fungerar direkt i webbläsaren, utan installationer eller internet.

## De tre delarna

- `index.html` är innehållet: rubriker, objekt och knappar.
- `style.css` är utseendet: färger, storlekar och rörelser.
- `script.js` är beteendet: vad som händer när du drar eller klickar.

Kommentarerna i koden förklarar några av grunderna.

## Lägg projektet i GitHub Desktop

1. Välj **File → New repository**.
2. Skriv namnet `tryck-och-studs` och välj var projektet ska sparas. Klicka på **Create repository**.
3. Kopiera filerna från den här mappen till mappen GitHub Desktop skapade.
4. Skriv `Min första hemsida` i fältet **Summary** och klicka på **Commit to main**. En commit sparar en version av din kod.
5. Klicka på **Publish repository** för att lägga projektet på ditt GitHub-konto. Välj själv om koden ska vara privat eller offentlig.

## Gör hemsidan tillgänglig på webben

För den enklaste vägen med GitHub Free använder du ett offentligt repository. Öppna projektet på GitHub och välj **Settings → Pages**. Under **Build and deployment**, välj **Deploy from a branch**, grenen **main** och mappen **/(root)**. Klicka på **Save**. GitHub visar adressen när hemsidan är publicerad.

## Små saker att prova

1. Byt rubriken i `index.html` och uppdatera webbläsaren.
2. Ändra brödrostens färg genom att byta `#f476a3` i `style.css`.
3. Ändra `wait(900)` i `script.js` till `wait(2000)` för att rosta längre.

Spara filen efter varje ändring. Uppdatera webbläsaren för att se resultatet. När du är nöjd sparar du en ny commit i GitHub Desktop och väljer **Push origin** för att skicka ändringarna till GitHub.
