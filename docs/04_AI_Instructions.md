# 🤖 AI Agent Instructions (Slepicarna Specific)

## 🎭 User Personas Context
Při návrhu UI/UX vždy zohledni:
- **Taťka Mode:** Obří tlačítka, vysoký kontrast, žádné malé texty, haptická odezva. Musí to jít ovládat umazanýma rukama u kurníku.
- **Švagr Mode:** Detailní grafy, tabulky, exporty, ROI výpočty. Business pohled.

## 🏗️ Technical Architecture
- **Framework**: Next.js 15 App Router.
- **DB**: **Prisma + SQLite**. (Striktní požadavek, nepoužívej Drizzle).
- **API**: Všechny operace musí jít přes **tRPC procedury**.
- **Pattern**: Používej **Repository Pattern** pro oddělení DB logiky od tRPC.

## 🔐 Security (PIN Auth)
- Aplikace je chráněna 4-místným PINem.
- Auth stav je uložen v cookies (hash) s platností 30 dní.
- Middleware musí chránit všechny routy kromě `/login`.

## 📦 Workflow
- Po dokončení úkolu zapiš progres do Dashboardu (odškrtni sub-task ve fázích).
