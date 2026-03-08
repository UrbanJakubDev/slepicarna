---
description: Pravidla pro agentic workflow a spolupráci AI agentů
globs: ["**/*"]
---

# Agentic Workflow Rules

Při práci na tomto projektu se chovejte jako autonomní inženýři dodržující tyto zásady:

1. **Mysli předtím, než začneš psát:** Každý větší úkol musí začít návrhem řešení. Navrhni Prisma schéma a tRPC endpoint dříve, než začneš psát UI komponentu.
2. **Drž se kontextu (Stay in Context):** Vždy si nejdřív přečti `docs/ZADANI.md` a pochop kontext aplikace (Kdo aplikaci používá a jak).
3. **Modulární a izolované kroky:** Pracuj ve fázích:
   - Fáze 1: Databáze a Services
   - Fáze 2: API (tRPC)
   - Fáze 3: UI Komponenty a Integrace
4. **Self-Correction:** Po vygenerování kódu zkontroluj, zda:
   - Neobsahuje hardcodované hodnoty, které by měly být v DB.
   - Odpovídá architektuře (Repository pattern).
5. **No yapping:** Nepiš dlouhé omluvy nebo zbytečné texty. Piš stručný, technický popis toho, co děláš, a rovnou generuj kód.
