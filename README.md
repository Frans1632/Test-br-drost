# Tryck & studs!

## En enklare lekyta för småbarn

Figurerna är större och alla kort går att trycka på. Namnen är korta och sidan använder små utrop som ”Kvack!” och ”Tittut!” i stället för långa instruktioner. Korten markerar när en animation pågår och svarar visuellt när du trycker.

Ljuden har lägre volym och mjukare klang. Inställningen för minskad rörelse på datorn eller mobilen respekteras också.

På stor skärm visas tre kort i bredd, på surfplatta två och på mindre mobilskärmar ett. Inga konton eller köp behövs och sidan fungerar utan internet.

En hemsida att lära sig med, med tjugo färgglada leksaker. Tryck direkt på figurerna för att starta animationerna. Raketen startas genom att trycka på raketen eller den stora röda knappen, och fyller skärmens nederkant med eld och rök. Klick på sidan sprider stjärnstoft över bakgrunden. Effekterna försvinner efter en stund och blockerar inte andra klick.

Tryck på en figur eller på dess kort. Varje leksak fyller bakgrunden med passande saker: grodor, blommor, ballonger, snö och annat. Brödrosten sprider ett halvtransparent gult smörlager över skärmen. Robotarna kommer fram bakom kortet och dansar. Bilen kör ut ur kortet och runt skärmen, och enhörningen flyger runt innan den återvänder. Effekterna försvinner automatiskt.

Brödrostens spak går fortfarande att dra. Glassen får strössel och grodan jagar en fluga, gör en volt och plaskar i sin damm. De tio senaste figurerna är robot, anka, fjäril, bil, bi, dinosaurie, enhörning, snögubbe, fotboll och regnbåge.

Alla går att använda igen, även med tangentbordets Tab och Enter eller mellanslag. Varje figur har ett eget lekfullt ljud: motorbrum, raketsus, trummor, kväkande grodor, robotdisco och annat. Ljuden skapas i webbläsaren och fungerar utan internet. Klicka på **Ljud på** högst upp för att tysta ljuden, och klicka igen för att slå på dem. Ljuden spelas först när du aktiverar en figur. Sidan anpassar rörelserna om du har valt minskad rörelse i datorns eller mobilens inställningar.

## Uppdatera ditt befintliga GitHub-projekt

1. Öppna GitHub Desktop och välj projektet `Test-br-drost`.
2. Klicka på **Repository → Show in Explorer**.
3. Kopiera de fyra nya filerna till projektmappen. Välj att ersätta de gamla filerna.
4. Dubbelklicka på `index.html` för att prova uppdateringen lokalt.
5. I GitHub Desktop skriver du `Större figurer och enklare lek för småbarn` under **Summary** och klickar på **Commit to main**.
6. Klicka på **Push origin**. GitHub Pages uppdaterar den befintliga hemsidan efter en stund. Uppdatera webbläsaren för att se den nya versionen.

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
