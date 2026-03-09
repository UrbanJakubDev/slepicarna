# 🧺 Business Case: Projekt Slepičárna

## 1. Executive Summary
Projekt **Slepičárna** je moderní progresivní webová aplikace (PWA) určená pro malochovatele drůbeže. Převádí tradiční, často papírovou evidenci sběru vajec a krmiva do digitální podoby, která je optimalizovaná pro použití přímo v terénu (u kurníku). Aplikace kombinuje extrémně jednoduché rozhraní pro starší generace s hlubokou datovou analytikou pro ekonomické vyhodnocení chovu.

## 2. Definice problému (Problem Statement)
*   **Nepřesná evidence:** Sběr vajec je často zaznamenáván nárazově nebo vůbec, což vede ke ztrátě přehledu o globální výkonnosti hejna.
*   **Netransparentní sklad:** Členové rodiny nebo sousedé si berou vejce ("odběry"), aniž by bylo jasné, kolik jich aktuálně zbývá v lednici bez fyzické inventury.
*   **Skryté náklady a výnosnost:** Chovatelé často netuší, kolik je skutečně stojí jedno domácí vejce a kolik jich průměrně snese jedna slepice. Chybí snadná evidence velikosti hejna a následné rozvedení do čísel.
*   **Technologická bariéra:** Existující zemědělské systémy jsou příliš komplexní pro hobby chovatele a nejsou uzpůsobeny pro snadné ovládání přímo u kurníku.

## 3. Cílové skupiny (Persona Analysis)
Aplikace obsluhuje dvě klíčové archetypy uživatelů:
1.  **Taťka/Farmář (Operativa):** Potřebuje veliká tlačítka, haptickou odezvu a co nejmenší administrativní zátěž. Chce jen "pípnout" celkový počet sebraných vajec nebo rovnou zapsat nový počet slepic v hejně.
2.  **Analytik (Švagr/Zvědavec):** Zajímají ho grafy, trendy, průměrná nosnost jedné slepice, návratnost investic (ROI) a cena za jedno vejce. Chce vidět globální zdraví byznysu přes posuvné období úrody (14 dní, rok atd.).

## 4. Klíčové funkce (Solution)

### A. Digitální sběrna a Hejno
*   Rychlé přičítání snesených vajec celkem pomocí velkých touch targetů.
*   Samostatná evidence "Hejna" pro uchování historie změn počtu slepic probíhajících v reálném čase mimo běžný denní sběr.
*   Možnost zpětné editace a výběru data.

### B. Virtuální sklad a odběry
*   Aktuální stav společných zásob v reálném čase.
*   Evidence "odběrů" (kdo si vzal kolik vajec, do jakých krabiček) s možností zanechat vzkaz ("Díky za vajíčka!").
*   Automatické odečítání ze skladu vajec k odbavení a zachování finanční plynulosti.

### C. Finanční modul (Ekonomika chovu)
*   Evidence příjmů (prodej vajec) a výdajů (krmivo, vybavení).
*   **Production Cost Ratio:** Automatický výpočet "ceny za vejce" na základě nákladů na nedávně koupené krmivo.
*   Výpočet celkového zisku či ztráty (ROI).

### D. Analytics Dashboard
*   Dynamický graf "Vývoj snůšky" pro vybraná časová období (např. 14 dní, měsíc, půlrok, rok).
*   Výpočet objemu průměrné snášky vajec za den napojený na průběžnou historii velikosti hejna -> výsledkem je přesná metrika **vajec na slepici/den**.
*   Historie sběrů a exportů.

## 5. Vizuální a technická identita
*   **Modern Country:** Design, který propojuje rustikální prvky (Terakota, Sláma) s moderní čistou typografií (Inter, Fraunces).
*   **Sunlight Readiness:** Vysoký kontrast a lomená bílá (Eggshell) pro čitelnost na přímém slunci.
*   **PWA (Progressive Web App):** Instalace na plochu telefonu bez nutnosti App Store, offline podpora pro místa se slabým signálem u kurníku.

## 6. Business Hodnota (Value Proposition)
1.  **Úspora času:** Digitální zápis trvá vteřiny a automaticky generuje reporty, které by jinak vyžadovaly hodiny ručního počítání.
2.  **Optimalizace chovu:** Díky trendům lze včas identifikovat pokles produkce (např. nemoc nebo špatné krmivo).
3.  **Ekonomická osvěta:** Uživatel přesně vidí bod zlomu (break-even point), kdy se mu vrací investice do slepic.
4.  **Sociální aspekt:** Evidence odběrů v rámci rodiny zlepšuje komunikaci a plánování spotřeby.

## 7. Budoucí vize
*   **Gamifikace:** Odznáčky za rekordní snášku nebo milníky (1000. vejce).
*   **Predikce:** AI odhad budoucí produkce na základě historických dat a počasí.
*   **Marketplace:** Propojení přebytků z kurníku s lidmi v okolí hledajícími domácí produkty.
