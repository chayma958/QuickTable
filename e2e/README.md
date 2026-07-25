# QuickTable E2E Tests

Playwright end-to-end tests that run against a real, already-running QuickTable frontend
(local dev, staging, or production) — this suite never boots its own server.

## Setup

```bash
cd e2e
npm install
npm run install:browsers   # downloads the Chromium binary Playwright drives
cp .env.example .env       # then edit E2E_BASE_URL if not testing localhost:5173
```

Make sure the target you're pointing at is actually reachable — for local dev that means
Postgres/Redis (`docker-compose up -d` at the repo root), the backend (`npm start` in
`backend/`), and the frontend (`npm run dev` in `frontend/`) are all running, and that the
backend's demo seed data (`npm run seed` in `backend/`) has been applied at least once.

## Running

```bash
npm test              # full suite, headless
npm run test:headed   # same, with a visible browser
npm run test:ui       # Playwright's interactive UI mode — best for debugging
npm run test:debug    # step through with the Playwright inspector
npm run report        # open the last run's HTML report
```

## How it's organized

```
src/pages/                Page Object Model — one class per page or reusable modal/sheet component
src/fixtures/test.ts       Custom `test`/`expect` that wires every Page Object in as a fixture
src/helpers/               Test-data generators (unique names/phone numbers)
tests/auth.setup.ts        Logs in once per staff role, saves each session to playwright/.auth/*.json
tests/*.spec.ts            The actual spec files
```

Every spec imports `test`/`expect` from `../src/fixtures/test`, **not** from `@playwright/test`
directly — that's what makes the Page Object fixtures (`menuPage`, `cartPage`,
`kitchenDisplayPage`, etc.) available without each test having to construct them.

### Authenticated tests

`auth.setup.ts` runs once before the real spec files (wired via the `setup` → `chromium`
project dependency in `playwright.config.ts`) and logs in as the Owner, Kitchen, and Waiter
demo accounts through the real UI, saving each resulting session as Playwright `storageState`.
A spec that needs to run as one of those roles opts in at the top of the file:

```ts
test.use({ storageState: 'playwright/.auth/owner.json' });
```

Customer-facing specs need no auth and get a clean context by default. The realtime spec
manually opens *additional* browser contexts (one per actor) within a single test — see
`tests/realtime-order-lifecycle.spec.ts` for the pattern.

## Why only 4 spec files

This suite deliberately covers a handful of **realistic user journeys** end-to-end rather than
many small, isolated assertions:

- `auth.spec.ts` — every demo role logs in and lands in the right place; invalid credentials
  and role-mismatched access are both rejected correctly.
- `customer-ordering-journey.spec.ts` — browse, filter, search, customize an item, check out,
  and land on a real order-tracking page.
- `owner-menu-management.spec.ts` — an owner's new dish actually reaches the live customer
  menu (checked from a second, unauthenticated browser context), not just the dashboard.
- `realtime-order-lifecycle.spec.ts` — the flagship test: a single order is followed live
  across three simultaneous sessions (customer, kitchen, waiter) from placement through to
  delivery, proving the realtime sync that's the whole point of the app actually works.

## A note on shared test data

These tests run against the same persistent seed data a human would use locally — there's no
disposable per-run database to reset. Anything a test creates is timestamp-tagged (see
`src/helpers/test-data.ts`) so parallel/repeated runs never collide, and tests that create
owner-side data (like a menu item) delete it again at the end. Orders placed by the customer
journeys are left in place (there's no customer-facing "cancel" flow to invoke), so expect a
small number of `E2E Customer …`-named orders to accumulate in the demo restaurant's order
history over time — safe to ignore or periodically clear from the database directly.

## Adding a new test

1. If the page/flow you need doesn't have a Page Object yet, add one under `src/pages/`
   (extend `BasePage` for full pages; plain classes for modals/sheets that can appear over
   any page).
2. Wire it into `src/fixtures/test.ts` if you want it available as a fixture.
3. Add a spec under `tests/`. Prefer extending an existing journey over adding a new file for
   a single extra assertion — keep the suite meaningful, not sprawling.
