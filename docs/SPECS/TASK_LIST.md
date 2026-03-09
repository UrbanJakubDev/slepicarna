# 📋 Task List: Expanded Analytics & Insights

This backlog defines the implementation steps for the advanced metrics and features described in `EXPANDED_ANALYTICS.md`.

## Phase 1: Foundation & Economic Metrics (Sprint 1)

### [x] Task 1: Refine Transaction Categorization
- **Assignee**: @database-expert-prisma
- **User Story**: As a User, I want to categorize my expenses (e.g., Feed vs. Others) so that I can see the real cost of egg production.
- **Acceptance Criteria**:
  - [x] Add `category` field to `Transaction` model (via enum expansion in TRPC).
  - [x] Migration to support existing "EXPENSE" entries (handled in UI filter).
  - [x] Update TRPC routers to handle the new category.

### [x] Task 2: Implement "Price per Egg" (Feed Cost Ratio) Logic
- **Assignee**: @engineering-backend
- **User Story**: As a User, I want to see the average cost of one egg based on feed expenses.
- **Acceptance Criteria**:
  - [x] Create `eggService.getProductionCost(days: number)` function.
  - [x] Logic: `Sum(Feed Expenses) / Total Eggs Produced` in given period.
  - [x] Handle division by zero.

### [x] Task 3: Feed Cost Ratio UI (Stats Dashboard)
- **Assignee**: @engineering-frontend
- **User Story**: As a User, I want to see the production cost on my dashboard in a beautiful card.
- **Acceptance Criteria**:
  - [x] Create a "Production Cost" card in `/stats`.
  - [x] Follow Brand Strategy (Teplá sůl, Terakota accents).
  - [x] Display as "X.XX Kč / vejce".

## Phase 2: Predictive & Advanced Insights (Sprint 2)

### [ ] Task 4: Production Forecast (ML Lite)
- **Assignee**: @engineering-backend
- **User Story**: As a User, I want to know how many eggs to expect tomorrow.
- **Acceptance Criteria**:
  - [ ] Implement weighted average algorithm of last 7 days.
  - [ ] Add trend indicator (up/down).
  - [ ] Return forecast range (e.g., "8-10 eggs").

### [ ] Task 5: Production Anomaly Alerts
- **Assignee**: @engineering-backend
- **User Story**: As a User, I want to be alerted if production drops significantly so I can check on the chickens.
- **Acceptance Criteria**:
  - [ ] Logic: `Today < 50% of Average(Last 3 Days)`.
  - [ ] Display a prominent alert in the Dashboard/Stats page.

## Phase 3: Gamification & Social (Sprint 3)

### [ ] Task 6: Achievement System (Milestones)
- **Assignee**: @engineering-backend
- **User Story**: As a User, I want to celebrate milestones like 1000 total eggs.
- **Acceptance Criteria**:
  - [ ] Implement "Golden Harvest" (12+ eggs/day) detection.
  - [ ] Implement "Millennium" (1000+ total eggs) detection.
  - [ ] Store achievements in database or calculate on-the-fly.

### [ ] Task 7: Achievement UI & Whimsy
- **Assignee**: @design-ui
- **User Story**: As a User, I want to see animations (confetti/feathers) when I hit a milestone.
- **Acceptance Criteria**:
  - [ ] Add "Whimsy Injector" micro-animations for milestones.
  - [ ] Add "Golden Chicken" easter egg.

### [ ] Task 8: Social Share Card
- **Assignee**: @engineering-frontend
- **User Story**: As a User, I want to easily share that I have surplus eggs on Facebook.
- **Acceptance Criteria**:
  - [ ] "Mám přebytky" button.
  - [ ] Generates a shareable image card (using html-to-image or similar).
  - [ ] Customizable text with current inventory count.

---
### 🛠️ Technical Notes for Developers
- **Prisma Schema**: The `Transaction` model currently has `type: String`. Update the `transactionRouter` Zod schema to include `'FEED'` category.
- **Analytics Period**: Default analytics should focus on the last 30 days but stay reactive to recent trends (last 3-7 days for anomalies).
- **Animations**: Use a library like `framer-motion` or simple CSS transitions for "slot machine" number effects.
- **Social Sharing**: Use `html-to-image` on a hidden component to generate the Facebook Share Card.

**Handing over to `@Engineering Orchestrator` to begin Sprint 1.**
