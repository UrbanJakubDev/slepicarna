---
description: Technologický stack a architektonická pravidla
globs: ["src/server/**/*.ts", "src/app/**/*.tsx", "prisma/*.prisma"]
---

# Tech Stack & Architektura

Tento projekt striktně dodržuje pravidla z `COOKBOOK.md` z domovského Obsidian Vaultu.

## Core Pravidla
1. **Prisma Schema:** 
   - Vždy mapuj tabulky s prefixem projektu: `@@map("slepicarna_...")`
   - Vždy měj `id @default(cuid())`, `createdAt` a `updatedAt`.
2. **Architektura (Flow):**
   - NIKDY nevolej Prisma přímo v tRPC routeru.
   - Cesta dat: `tRPC Router` -> `Service` -> `Repository` -> `Prisma (DB)`.
3. **tRPC a Validace:**
   - Každý vstup musí být validován přes Zod.
4. **Klientský Kód:**
   - Používej vytvořené hooky v `src/hooks/`, nikdy nevolej `api.*.useQuery()` přímo uvnitř komponent.
   - Vždy ošetřuj Loading a Error stavy.
5. **Autentizace (PIN):**
   - Implementuj jednoduchý PIN login (4 číslice).
   - Úspěšné přihlášení ulož do `cookie` s expirací 30 dní.
   - Použij Next.js Middleware pro kontrolu přístupu k chráněným routám.
