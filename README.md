# BGV Platform

Multi-tenant background verification (BGV) platform. Companies (tenants) across
six categories — MNC, Mart, Mall, Bank/Finance, Petrol Bunk, Industry — onboard
employees for background verification. Each category runs one of two flows:

- **MNC flow**: identity + address (Aadhar, PAN, permanent/current address)
  plus employment history (payslips, experience letter, relieving letter,
  Form-16).
- **Standard flow** (Mart/Mall/Bank/Petrol Bunk): identity + address only.
  Industry uses the standard flow plus a local proof / witness statement.

Aadhar and PAN are checked automatically through a pluggable KYC provider;
every other document always goes to a human agent for manual sign-off. Once
every required document is verified, the case is marked complete and
auto-reverifies annually, notifying both employee and employer by email and
WhatsApp.

## Roles & dashboards

| Role | Route | Does |
|---|---|---|
| Super Admin | `/admin` | Onboards tenant companies and verification agents |
| Employer Admin | `/employer` | Onboards employees, tracks case status, views reports |
| Employee | `/employee` | Uploads documents, tracks own verification checklist |
| Agent | `/agent` | Reviews the manual-verification queue, approves/rejects documents |

## Stack

- Next.js 16 (App Router, Turbopack, TypeScript, Tailwind CSS)
- PostgreSQL via Prisma 7 (driver adapters — `@prisma/adapter-pg`)
- Custom JWT session auth (`jose` + `bcryptjs`), no third-party auth service
- Pluggable KYC verification, notification (email/WhatsApp), and file storage
  providers — each ships with a working stub/mock and a documented seam for
  wiring in a real vendor

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, CRON_SECRET
npx prisma migrate dev # creates the schema
npx prisma db seed     # sample tenants/employees/cases across every scenario
npm run dev
```

Seed data covers all six tenant categories, each with:
- a fresh employee with no documents uploaded yet (`DOCS_PENDING`)
- a completed employee whose annual re-verification is already overdue (used
  to demo the cron sweep)

The MNC tenant additionally seeds a case awaiting manual agent review and a
rejected case. All seeded users share the password `Passw0rd!` — see
`prisma/seed.ts` for the full list of emails (e.g. `admin@bgv.example`,
`hr@acmetech.example`, `agent1@bgv.example`).

## Annual re-verification

`POST /api/cron/reverification` with `Authorization: Bearer $CRON_SECRET`
scans completed cases past their `nextReverificationDueAt`, notifies the
employee + employer, and opens a fresh case for each. It's idempotent — safe
to call repeatedly (`prisma/seed.ts` marks each case only once via
`reverificationNotifiedAt`). `vercel.json` wires this up as a daily Vercel
Cron job; any other scheduler (system cron, GitHub Actions) can hit the same
endpoint.

## Pluggable providers

Each provider is a small interface with one working implementation, selected
by an env var, plus a documented seam for a real vendor:

- **KYC** (`src/lib/kyc/`) — `KYC_PROVIDER=mock` today (deterministic format
  validation, no external calls). Implement `KycProvider` for a real vendor
  (Karza, Signzy, IDfy, Surepass, etc.) and register it in
  `src/lib/kyc/index.ts`.
- **Notifications** (`src/lib/notifications/`) — `EMAIL_PROVIDER=console` and
  `WHATSAPP_PROVIDER=console` log to stdout and still write every send to
  `NotificationLog`. Implement `EmailProvider`/`WhatsAppProvider` for SendGrid
  /SES or Twilio/WhatsApp Cloud API and register in
  `src/lib/notifications/providers.ts`.
- **Storage** (`src/lib/storage/`) — `STORAGE_PROVIDER=local` writes uploaded
  documents to `STORAGE_LOCAL_DIR` on disk. Implement `StorageProvider` for
  S3/R2/GCS and register in `src/lib/storage/index.ts`.

## Project layout

```
prisma/schema.prisma        Multi-tenant data model
prisma/seed.ts               Demo data across every tenant category/scenario
src/lib/flow-config.ts       Category -> flow type -> required document checklist
src/lib/case-service.ts      Core business logic: case creation, document
                              processing, completion evaluation, reverification
src/lib/kyc/                 Pluggable KYC verification
src/lib/notifications/       Pluggable email/WhatsApp notifications
src/lib/storage/             Pluggable document storage
src/lib/auth.ts, session.ts  JWT session auth
src/lib/rbac.ts              Server-side role guard for pages
src/proxy.ts                 Route-level auth guard (Next 16's middleware)
src/app/(admin|employer|employee|agent)/  One route group per dashboard
src/app/api/documents/       Upload + authenticated document retrieval
src/app/api/cron/reverification/  Annual re-verification sweep endpoint
```

## Notes on the stack

This was built against very recent major versions (Next.js 16.3, Prisma 7.9,
React 19.2) — both bundled their own AGENTS.md-style docs
(`node_modules/next/dist/docs/`, `.agents/skills/prisma-*` — gitignored) that
were used to get the details right, e.g.:

- Prisma 7's generated client has no `index.ts`; import runtime **enum
  values** from `@/generated/prisma/enums` (side-effect-free) rather than
  `@/generated/prisma/client` in any module that might be reached from a
  "use client" component — the latter also bundles the full PrismaClient
  runtime (Node builtins included), which breaks client-side bundling.
- Next 16 replaced `middleware.ts` with `proxy.ts` (`src/proxy.ts` here).
- Prisma 7 requires a driver adapter (`@prisma/adapter-pg`) rather than a bare
  `new PrismaClient()`.


I've created .env from the template — it's gitignored, so it stays local. Once you point it at a real database, this should get you running:

Edit DATABASE_URL (and ideally AUTH_SECRET) in .env for your Postgres instance.
npx prisma migrate deploy (or migrate dev if it's a fresh DB) to create the schema.
npx prisma db seed (or npx tsx prisma/seed.ts) to load test users — check prisma/seed.ts for the credentials it creates.
npm run dev and log in.
Let me know once the database's up if you want me to verify login and screenshot the dashboards — that'll complete the visual check I couldn't do without one.