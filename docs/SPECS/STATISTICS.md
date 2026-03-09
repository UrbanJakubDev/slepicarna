# Statistiky a Vyhodnocování

Tento dokument popisuje, jaké statistiky projekt sleduje, jak se vypočítávají a co vyhodnocujeme.

## 1. Produkce (Sběr vajec)

Sledování denní snůšky rozdělené podle barvy/skupiny.

- **Sledované metriky:**
    - **Hnědá (Taťka):** Počet hnědých vajec sebraných za den.
    - **Bílá (Filip):** Počet bílých vajec sebraných za den.
    - **Celkem:** Součet hnědých a bílých vajec.
- **Vyhodnocování:**
    - **Průměr / den:** Celkový počet sebraných vajec vydělený počtem dní se záznamem.
    - **Vývoj snůšky (14 dní):** Lineární graf zobrazující trend produkce v posledních dvou týdnech.
    - **Podíl produkce:** Koláčový graf zobrazující celkový procentuální podíl hnědých vs. bílých vajec v historii.

## 2. Sklad a Inventura

Systém sleduje aktuální stav zásob na základě rozdílu mezi sebranými a odebranými vejci.

- **Výpočet skladu:** `(Celkem sebráno) - (Celkem odebráno)`.
- **Aktuální sklad:** Zobrazuje přesný počet kusů vajec "na skladě" (v lednici).
- **Poměrové rozdělení odběru:**
    - Při odběru (např. 1 krabice = 10ks) systém automaticky odečte vejce ze skladu podle aktuálního poměru hnědých a bílých vajec v inventáři.
    - Tím je zajištěno, že virtuální sklad barvy odpovídá realitě, i když se odebírají mixované krabice.

## 3. Finance a ROI

Ekonomické vyhodnocení chovu na základě prodejů a nákladů.

- **Kategorie transakcí:**
    - **SALE (Prodej):** Příjem z prodeje vajec (včetně počtu kusů).
    - **EXPENSE (Náklad):** Výdaje na krmivo, vybavení atd.
- **Vyhodnocované metriky:**
    - **Zisk / Ztráta (ROI):** `(Celkové příjmy) - (Celkové náklady)`.
    - **Virtuální Sklad:** Rozdíl `(Celkem sebráno) - (Prodáno přes Finance)`. Tato metrika slouží k porovnání s reálným skladem a ukazuje, kolik vajec bylo "spotřebováno" (domácím užitím) nebo zbývá k prodeji.

## 4. Technická implementace

- **Data:** Prisma modely `EggRecord`, `Withdrawal`, `Transaction`.
- **Logika:** 
    - `eggService.getInventory()`: Klíčová funkce pro výpočet stavu skladu.
    - `eggService.withdraw()`: Implementuje logiku poměrového rozdělení.
- **Frontend:** 
    - `/stats`: Vizualizace (Recharts) a historie sběrů.
    - `/finance`: Dashboard finanční bilance a správa transakcí.
