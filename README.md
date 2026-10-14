# WedLink

A multi-wedding platform for digital invitations, QR-based guest check-in, and
wedding album management. One platform serves many independent weddings with
centralized administration and strict wedding-level data isolation.

> **Status: Phase 1 (Foundation) complete and verified end-to-end.**
> Monorepo, database, authentication, role-based access control, multi-wedding
> isolation, wedding management, and dashboards are implemented and tested
> against a live PostgreSQL database. See [Roadmap](#roadmap) for what is built
> versus planned.

---

## Architecture

| Layer    | Technology |
|----------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend  | NestJS 10, TypeScript, REST API |
| Database | PostgreSQL 16 + Prisma ORM (versioned migrations) |
| Storage  | S3-compatible object storage (MinIO in dev) — *wired in Phase 4* |
| Auth     | JWT access + refresh tokens in httpOnly cookies, bcrypt password hashing |

Monorepo managed with pnpm workspaces + Turborepo:

```
apps/
  api/        NestJS backend (auth, RBAC, weddings, admin)
  web/        Next.js frontend
packages/
  shared/     Shared roles, permissions, and domain enums (single source of truth)
```

### The core principle: wedding isolation

Every wedding-owned record carries a `weddingId`. The backend **never trusts a
`weddingId` supplied by the client**. For any wedding-scoped request, the
`WeddingAccessGuard` loads the authenticated user's `WeddingMembership` from the
database and verifies access server-side. A wedding owner cannot read another
wedding's data by changing an ID in a URL — this is enforced and tested.

### Access-control model

- **Platform roles** (on the user account): `SUPER_ADMIN`, `USER`.
- **Wedding roles** (per membership): `OWNER`, `ORGANIZER`, `ENTRANCE_STAFF`,
  `PHOTOGRAPHER`.
- **Fine-grained permissions** per membership. An `OWNER` implicitly holds all
  permissions; other roles hold only what the owner explicitly grants. Nothing
  is auto-granted.
- **Guests** access invitations through unguessable opaque tokens, no account
  required.

---

## Local development

### Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable`, or install from https://pnpm.io)
- Docker Desktop (for PostgreSQL, Redis, MinIO)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

The defaults work out of the box for local development. Host ports are shifted
to an uncommon range (Postgres `55432`, Redis `56379`, MinIO `59000/59001`) to
avoid clashing with any existing local services. Change them in `.env` if
needed.

> Replace the `JWT_*` secrets with strong random values for any shared or
> production environment.

### 3. Start infrastructure

```bash
pnpm db:up        # starts postgres, redis, minio via docker compose
```

### 4. Apply migrations and seed sample data

```bash
pnpm db:migrate   # applies Prisma migrations
pnpm db:seed      # loads three sample weddings + accounts
```

### 5. Run the apps

In two terminals (or use `pnpm dev` from the root to run both via Turborepo):

```bash
pnpm --filter @wedlink/api dev     # http://localhost:4100/api
pnpm --filter @wedlink/web dev     # http://localhost:3000
```

Open http://localhost:3000.

### Sample accounts (development only)

| Role             | Email                   | Password      |
|------------------|-------------------------|---------------|
| Super Admin      | admin@wedlink.dev       | admin1234     |
| Owner (Abebe&Hana) | abebe@wedlink.dev     | password123   |
| Owner (Dawit&Selam) | dawit@wedlink.dev    | password123   |
| Owner (Michael&Sara) | michael@wedlink.dev | password123   |
| Organizer        | organizer@wedlink.dev   | password123   |

These credentials are for local development only. Never use them elsewhere.

---

## API (Phase 1)

Base URL: `http://localhost:4100/api`

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/auth/register` | Create account | Public |
| POST | `/auth/login` | Sign in (sets cookies) | Public |
| POST | `/auth/refresh` | Rotate tokens | Cookie |
| POST | `/auth/logout` | Sign out | Cookie |
| GET  | `/auth/me` | Current user | Authenticated |
| POST | `/weddings` | Create a wedding (creator becomes owner) | Authenticated |
| GET  | `/weddings` | List weddings you can manage | Authenticated |
| GET  | `/weddings/selector/mine` | Compact list for the wedding selector | Authenticated |
| GET  | `/weddings/:weddingId` | Wedding details | Member of wedding |
| GET  | `/weddings/:weddingId/dashboard` | Live dashboard counts | Member of wedding |
| PATCH | `/weddings/:weddingId` | Update wedding | `WEDDING_EDIT` |
| PATCH | `/weddings/:weddingId/status` | Change status | `WEDDING_EDIT` |
| GET  | `/admin/stats` | Platform-wide statistics | `SUPER_ADMIN` |

All dashboard and stats figures are computed from real database records.

---

## Security notes

- Passwords hashed with bcrypt (cost 12).
- Access + refresh tokens delivered as httpOnly, SameSite=Lax cookies; refresh
  tokens are hashed at rest and rotated on use.
- Every wedding-scoped request is authorized against a database-backed
  membership — client-supplied IDs are never trusted.
- Server-side request validation via `class-validator` DTOs with a global
  whitelisting validation pipe.
- `.env` is git-ignored; only `.env.example` (no real secrets) is committed.

---

## Roadmap

Phase 1 is complete. Later phases are scaffolded in the schema but not yet
implemented in application code.

- **Phase 1 — Foundation** ✅ monorepo, schema, auth, RBAC, multi-wedding
  isolation, wedding CRUD, dashboards.
- **Phase 2 — Invitations & Guests** — guest management, Excel import,
  invitation designer, templates, QR generation, RSVP.
- **Phase 3 — Check-in** — QR scanner, concurrency-safe check-in, event-specific
  access, attendance reports.
- **Phase 4 — Albums** — media storage (MinIO/S3), uploads, privacy, guest
  uploads, moderation.
- **Phase 5 — Production readiness** — automated test suite, performance,
  logging, backups, deployment docs.

### Not yet implemented (do not assume these work)

- QR code generation and scanning.
- Guest-facing invitation pages and RSVP.
- Album/media upload and object storage integration.
- Email/SMS/WhatsApp delivery (notification service runs in mock mode when
  provider credentials are absent).
- Automated test suite.
