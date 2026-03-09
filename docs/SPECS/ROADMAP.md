# 🗺️ Slepičárna (Egg Tracker) - Roadmapa

## 🧭 Kontext a Usecase
Aplikace slouží pro bleskovou evidenci snůšky vajec a následnou analýzu.
- **Taťka (Hnědá vejce):** Potřebuje rychlost, obří tlačítka, terénní režim.
- **Švagr (Bílá vejce):** Pražák, chce grafy, efektivitu a finance.

---

## 🔐 FÁZE 0: SECURITY (PIN Login)
- **PIN Vstup:** Numerická klávesnice (4 cifry).
- **Persistence:** Hash v cookies na 30 dní.
- **Middleware:** Ochrana všech rout (Sběr, Stats, Finance).

## 🥚 FÁZE 1: CORE SBĚR (Hotovo ✅)
- Číselná mřížka (0-12+), barevně oddělené sekce.
- tRPC API + Prisma (SQLite).
- Haptická odezva (toasty).

## 📊 FÁZE 2: STATISTIKY (Pro Švagra)
- Týdenní/Měsíční grafy (Recharts).
- Srovnání Hnědá vs. Bílá.
- Historie záznamů s možností opravy.

## 💰 FÁZE 3: FINANCE A SKLAD
- Evidence Prodeje (Kč/ks) a Nákladů (krmivo).
- Virtuální Sklad (Sneseno - Prodáno/Snědeno).
- ROI Kalkulačka (Příjmy vs. Výdaje).

## 📱 FÁZE 4: PWA A OFFLINE
- Instalace na plochu (PWA).
- Offline support (LocalStorage sync).
- PDF reporty pro rodinu.

---

## 🛠️ Striktní Tech Stack
- **Framework:** Next.js 15 (App Router)
- **API:** tRPC v11
- **DB:** Prisma + SQLite
- **UI:** Tailwind CSS + Shadcn/ui + Lucide
- **Stats:** Recharts
- **Auth:** Custom PIN + Cookies (30 dní)
