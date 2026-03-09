---
name: Brand & Product Strategy
project: Slepicarna
version: 2026.1
---

# 🌾 Brand & Product Strategy (Slepičárna)

Tento dokument definuje "duši" aplikace. Slepičárna není jen databáze; je to digitální asistent pro moderní venkov. Spojujeme chladnou analytiku (pro Švagra) s hřejivým, haptickým zážitkem (pro Taťku).

## 1. Pozice na trhu (The Hook)
- **Kategorie**: Micro-Farming SaaS / Hobby Agriculture.
- **Tone of Voice**: Přátelský, rustikální, ale technologicky suverénní. Nemluvíme jako korporát, mluvíme jako soused přes plot, který má shodou okolností doktorát z datové analytiky.
- **Motto**: *"Chytrý kurník v kapse."* (Smart coop in your pocket).

## 2. Vizuální Identita (Moderní Venkov)
Aplikace nesmí vypadat jako klasický Bootstrap/Tailwind dashboard. Musí evokovat přírodu, ale zůstat extrémně čistá.

### Barevná paleta (Eggshell Palette)
- **Background (Skořápka)**: `#FAFAF7` (Teplá, lomená bílá, nikoliv sterilní `#FFFFFF`).
- **Primary (Terakota/Cihla)**: `#D95D39` (Barva střech a cihel, používá se pro hlavní akce).
- **Secondary (Sláma)**: `#E8C37D` (Zlatavá žlutá pro hnědá vejce a highlighty).
- **Text/Borders (Uhel)**: `#2D2A26` (Měkká černá, lepší pro oči na slunci).
- **Accent (Zelená)**: `#4A7C59` (Barva trávy pro pozitivní stavy a růst).

### Typografie
- **Nadpisy (Headings)**: Font s jemnými patkami nebo rustikálním nádechem (např. *Fraunces* nebo *Merriweather*), který evokuje farmářské trhy.
- **UI/Data (Body)**: Čistý bezpatkový font (např. *Inter* nebo system default) pro maximální čitelnost čísel u kurníku.

## 3. UI/UX Principy (Haptika a Gesta)

Taťka u kurníku nemá čas trefovat se do malých input políček.
- **Obří Touch Targety**: Tlačítka pro sběr musí mít minimálně `64x64px`.
- **Haptická odezva (Vibrace)**: Kdykoliv se přidá vejce, telefon musí zavibrovat (využití `navigator.vibrate` v PWA). Fyzické potvrzení je klíčové.
- **Sunlight Mode**: UI musí mít dostatečný kontrast, aby bylo čitelné venku na přímém slunci.

## 4. Gamifikace a "Delight" (Whimsy Injector)
Aplikace musí dělat radost.
- **Empty States**: Když není sebráno žádné vejce, nezobrazuj "No data". Zobraz smutnou slepici s textem: *"Holky si dneska daly pauzu."*
- **Easter Eggs**: Když sebereš více než 15 vajec za den, přes obrazovku přeběhne zlatá slepice nebo spadne konfeta ve tvaru peříček.
- **Mikro-animace**: Počítadlo vajec by nemělo jen přeskočit z 5 na 6, ale číslo by se mělo "protočit" (slot machine efekt).

## 5. Cesta k Monetizaci (Future SaaS)
I když je to projekt pro rodinu, designuj ho tak, aby šel škálovat:
1. **Free Tier**: Sběr do 20 slepic zdarma.
2. **Pro Tier (Švagr Mode)**: 49 Kč/měsíc za pokročilé finanční grafy, ROI kalkulačku a exporty do PDF.
3. **Marketplace (Vize)**: Napojení lokálních chovatelů na lidi z města, kteří hledají domácí vejce.
