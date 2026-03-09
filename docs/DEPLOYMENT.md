# 🚀 Deployment & Prostředí (Slepicarna)

## ⚙️ Environment Variables (.env.local)
```env
# Database
POSTGRES_URL=postgres://...

# Auth (pokud bude potřeba)
NEXTAUTH_SECRET=your-secret
```

## 💾 Databázové Migrace
Vždy používejte Drizzle Kit:
1. `bun db:generate` - vytvoří SQL soubor
2. `bun db:push` - aplikuje změny přímo (pro dev)
