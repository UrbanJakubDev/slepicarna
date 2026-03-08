---
description: Pravidla pro design uživatelského rozhraní a UX
globs: ["src/app/**/*.tsx", "src/components/**/*.tsx"]
---

# UI & UX Pravidla pro "Slepičárnu"

Aplikaci budou používat lidé, kteří nechtějí ztrácet čas. Aplikace se používá "v terénu" u kurníku.

1. **Mobile First:** Veškerý design začíná na mobilní obrazovce. Maximální šířka kontejneru `max-w-md mx-auto`.
2. **Pravidlo 3 Kliknutí:** Hlavní akce (zápis snůšky) musí jít odbavit na 3 dotyky displeje bez použití klávesnice.
3. **No Inputs (Kde to jde):** Nepoužívej `<input type="number">` pro počet vajec. Použij "Číselnou mřížku" velkých tlačítek. Klávesnice na mobilu nesmí vyskočit.
4. **Vizuální Kotvy:**
   - Sekce pro tátu (hnědá vejce) MUSÍ používat hnědé/zemité barvy.
   - Sekce pro švagra (bílá vejce) MUSÍ používat bílé/světle šedé barvy s dobrou čitelností.
5. **Velikost Tlačítka (Touch Targets):** Žádné klikatelné tlačítko nesmí být menší než `48x48px` (`h-12 w-12` v Tailwindu). Preferuj `h-16`.
6. **Jasná Zpětná Vazba:** Po stisknutí tlačítka "Uložit" použij velký Toast (`react-hot-toast`) a vyčisti formulář pro další den.
