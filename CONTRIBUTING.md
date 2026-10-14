# Contributing to WedLink

This guide gets you productive and keeps the codebase consistent. Read
`docs/ARCHITECTURE.md` first — especially the **isolation invariant** — then
this document.

---

## Repository layout

```
apps/
  api/        NestJS backend
    src/
      auth/         JWT auth + guards (JwtAuthGuard, WeddingAccessGuard, PlatformRolesGuard)
      weddings/     Phase 1 — the GOLDEN PATH reference module (fully implemented)
      admin/        Phase 1 — platform-wide stats
      guests/       Phase 2 stub — detailed reference stub
      invitations/  Phase 2 stub
      rsvp/         Phase 2 stub
      templates/    Phase 2 stub
      checkin/      Phase 3 stub (concurrency-critical)
      albums/       Phase 4 stub (+ media moderation)
      storage/      Object-storage abstraction (MOCK until S3 wired)
      reports/      Phase 5 stub
      notifications/ Phase 5 — mock-mode notification service
      audit/        Audit-log helper
      common/       crypto.util, not-implemented
      prisma/       PrismaModule / PrismaService
      config/       env configuration
    prisma/         schema.prisma, migrations, seed.ts
  web/          Next.js frontend (App Router)
packages/
  shared/       roles, permissions, enums (used by api AND web)
docs/           ARCHITECTURE.md, DATABASE.md, BUILD-GUIDE.md
```

---

## Local setup

Prerequisites: Node 20+, pnpm 9+, Docker Desktop.

```bash
pnpm install
cp .env.example .env
pnpm db:up        # postgres, redis, minio
pnpm db:migrate
pnpm db:seed
pnpm dev          # api on :4100, web on :3000
```

Sample accounts are listed in the root `README.md`.

---

## Conventions

### Stub convention

Unimplemented features expose their full route + method surface but call
`notImplemented('<feature>')` (from `src/common/not-implemented.ts`), which
returns **HTTP 501**. Each stub method has a `TODO(Phase N, spec §X)` comment
with acceptance criteria. When you implement a method, write the logic and
**delete the `notImplemented` call and the TODO**.

### Naming & structure

- One folder per feature module: `<feature>.module.ts`, `<feature>.service.ts`,
  `<feature>.controller.ts`, and `dto/<feature>.dto.ts`.
- DTOs use `class-validator` decorators; the global `ValidationPipe`
  (`whitelist: true`) strips unknown fields.
- Keep business logic in services. Controllers only wire HTTP to service calls.
- Shared roles/permissions/enums live in `@wedlink/shared` — never redefine them
  locally.

### Access control (do this on every wedding-scoped route)

```ts
@Controller('weddings/:weddingId/<resource>')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class ThingController {
  @Get()
  @RequireWeddingPermission(WeddingPermission.SOMETHING_VIEW)
  list(@Param('weddingId') weddingId: string) {
    return this.things.list(weddingId);
  }
}
```

- Public, guest-facing (token-based) endpoints go under a separate
  `@Controller('public/...')` with **no** wedding guard.
- Platform-admin endpoints use `@UseGuards(JwtAuthGuard, PlatformRolesGuard)` +
  `@PlatformRoles(PlatformRole.SUPER_ADMIN)`.

### Data access

- Always filter wedding-owned queries by `weddingId`.
- Before mutating a child record, assert its `weddingId` matches the verified
  context.
- Use `prisma.$transaction` for multi-step writes; use a `FOR UPDATE` locked
  read for attendance/allowance logic (see `checkin.service.ts`).

---

## How to implement a stubbed module (recipe)

Use the **Weddings module as the reference** — it is the complete, working
pattern. To turn a stub into a feature:

1. **Read the TODOs** in the stub service and the matching section of
   `docs/BUILD-GUIDE.md` and the spec.
2. **Define/extend DTOs** in `dto/` with validation decorators.
3. **Implement the service methods**, filtering by `weddingId` and using
   transactions where needed. Remove each `notImplemented` call.
4. **Keep the controller guards** intact; adjust the required permission if the
   action's sensitivity changed.
5. **Audit sensitive mutations** via the injected `AuditService.record(...)`.
6. **Build and run** (see below), then exercise the endpoint.
7. **Add a test** for the behavior (see BUILD-GUIDE test scenarios).

---

## Building & running (important gotchas)

The repo uses pnpm installed to the user profile and a few Windows/monorepo
quirks were worked through during setup. The reliable commands:

- **Shared package must be compiled** — `apps/api` imports `@wedlink/shared`
  from its built `dist`. If you change `packages/shared`, rebuild it:
  ```bash
  pnpm --filter @wedlink/shared build
  ```
- **Build the API** from `apps/api`:
  ```bash
  pnpm --filter @wedlink/api build
  ```
  If a module is "not found" at runtime after moving files, the incremental
  build cache is stale — delete `apps/api/dist` and `*.tsbuildinfo`, then
  rebuild.
- **Run the API** needs `DATABASE_URL` and the JWT secrets in the environment.
  `pnpm --filter @wedlink/api dev` picks up the root `.env`.
- **Seed is idempotent** — safe to re-run; it resets tables first.
- Every feature module must `imports: [AuthModule]` so `JwtService` resolves for
  the guards. Forgetting this is the most common DI error.

---

## Testing

Automated tests are a Phase 5 deliverable. When adding tests, cover the twelve
acceptance scenarios in `docs/BUILD-GUIDE.md`. Prefer testing isolation and
concurrency behaviors against a real test database rather than mocks.

---

## Commit & PR etiquette

- Keep PRs scoped to one module or concern.
- Never commit `.env` or real secrets; only `.env.example` is tracked.
- Preserve the isolation invariant in every change — it is the heart of the
  product.
