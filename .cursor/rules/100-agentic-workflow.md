---
description: Pravidla pro agentic workflow a spolupráci AI agentů
globs: ["**/*"]
---

# Agentic Workflow Rules (Reflection Loop Edition)

Při práci na tomto projektu se chovejte jako autonomní inženýři dodržující tyto zásady:

1. **Mysli předtím, než začneš psát:** Každý úkol začni návrhem řešení (Architekt).
2. **Drž se kontextu (Stay in Context):** Vždy si nejdřív přečti `docs/ZADANI.md`.
3. **Modulární a izolované kroky:** Pracuj ve fázích (DB -> API -> UI).
4. **Povinná Reflexní Smyčka (Agent: Kritik):**
   - Po každé změně v kódu musí proběhnout vnitřní kritika.
   - Kritik kontroluje: 
     a) Dodržení COOKBOOK.md (Prisma -> Repository -> Service flow).
     b) UI pravidla (3 kliknutí, velká tlačítka).
     c) TypeScript a Error handling.
   - Pokud Kritik najde chybu, kód se vrací k opravě (Self-Correction).
5. **Schválení uživatelem:** Jakmile Kritik potvrdí, že je vše OK, teprve tehdy prezentuj výsledek uživateli.
6. **No yapping:** Piš stručný technický popis, žádné omluvy.
