# Projekt: Slepičárna (Egg Tracker) - Kompletní Roadmapa

## Kontext a Usecase
Aplikace "Slepičárna" slouží pro bleskovou evidenci snůšky vajec a následnou analýzu pro dva typy uživatelů:
1. **Taťka (Hnědá vejce):** Potřebuje rychlost a obří tlačítka "v terénu".
2. **Švagr (Bílá vejce):** Pražák, který chce vidět grafy, efektivitu a finance.

---

## FÁZE 0: SECURITY (PIN Login 🔐)
- **Cíl:** Zabezpečit aplikaci jednoduchým PINem pro přístup, aby se do ní nedíval kdokoli cizí.
- **Funkce:**
    - **PIN Vstup:** Jednoduchá obrazovka s numerickou klávesnicí (4 cifry).
    - **Cookie Persistence:** Po správném zadání se uloží hash/token do cookies s dlouhou platností (např. 30 dní), aby uživatel nemusel PIN zadávat při každém otevření.
    - **Middleware:** Ochrana všech stránek (Sběr, Stats, Finance) – pokud není platná cookie, přesměruje na PIN login.

## FÁZE 1: CORE SBĚR (Hotovo ✅)
- **Cíl:** Umožnit zápis denní snůšky do 3 sekund bez klávesnice.
- **Funkce:**
    - Unifikovaný Dashboard s číselnou mřížkou (0-12+).
    - Barevně oddělené sekce (Hnědá vs. Bílá).
    - tRPC API + Prisma (SQLite) pro ukládání dat.
    - Haptická odezva (toasty) po uložení.

## FÁZE 2: STATISTIKY (Analýza pro Švagra 📊)
- **Cíl:** Vizualizovat produkci a porovnat "výkon" obou druhů slepic.
- **Funkce:**
    - **Týdenní/Měsíční přehled:** Grafy (Recharts) zobrazující křivku snůšky.
    - **Srovnávací graf:** Koláčový nebo sloupcový graf (Hnědá vs. Bílá).
    - **Průměry:** Výpočet průměrné denní snůšky za zvolené období.
    - **Historie:** Jednoduchý seznam (list) posledních záznamů s možností opravy chyby.

## FÁZE 3: FINANCE A SKLAD (Bussines Case 💰)
- **Cíl:** Sledovat, zda si slepice na sebe vydělají a kolik je "vajec v lednici".
- **Funkce:**
    - **Evidence Prodeje:** Tlačítko "Prodáno" (např. 30 vajec za 150 Kč).
    - **Evidence Nákladů:** Zápis nákupu krmiva, pšenice nebo vitamínů.
    - **Virtuální Sklad:** Automatický výpočet aktuálního stavu vajec (Celkem sneseno - Celkem prodáno/snědeno).
    - **ROI Kalkulačka:** Jednoduchý dashboard "Příjmy vs. Výdaje" za měsíc/rok.

## FÁZE 4: PWA A OFFLINE (Terénní Optimalizace 📱)
- **Cíl:** Fungovat i tam, kde u kurníku vypadává Wi-Fi.
- **Funkce:**
    - **PWA (Progressive Web App):** Možnost "Instalovat na plochu" jako nativní appku.
    - **Offline Support:** Ukládání do LocalStorage, pokud není signál, a sync po připojení.
    - **Sdílení:** Možnost vygenerovat PDF report pro švagra nebo taťku.

---

## Technologický Stack (Striktní)
- **Framework:** Next.js 15 (App Router)
- **API:** tRPC (všechny operace přes procedury)
- **DB:** Prisma + SQLite (pro lokální jednoduchost)
- **UI:** Tailwind CSS + Shadcn/ui + Lucide Icons
- **Stats:** Recharts
- **Architektura:** Repository Pattern (dle `COOKBOOK.md`)
- **Auth:** Custom PIN + Cookies (platnost 30 dní)
