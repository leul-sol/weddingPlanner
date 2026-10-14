# WedLink — Build Guide

A phase-by-phase plan for the team completing WedLink. Each phase lists the
stub modules to implement, the spec sections that define them, and the
acceptance criteria to satisfy. Build in order; preserve the isolation
invariant at every step.

Status legend: ✅ implemented · 🔲 stubbed (returns 501, has TODOs)

---

## Phase 1 — Foundation ✅ (done)

Monorepo, database schema + migrations, auth (JWT cookies + bcrypt), RBAC
(platform + wedding guards), multi-wedding isolation, wedding CRUD + selector,
admin/wedding dashboards from real records, idempotent seed, web shell.

This phase is the **reference**. When implementing later phases, copy the
patterns in `apps/api/src/weddings` and `apps/api/src/admin`.

---

## Phase 2 — Invitations & Guests 🔲

| Stub module | Spec | Implement |
|---|---|---|
| `guests` | §6 | Guest CRUD, categories, Excel/CSV import workflow, export |
| `invitations` | §5, §8.1 | Create (with opaque token), publish/unpublish, revoke, regenerate token, public page by token |
| `rsvp` | §7 | Public RSVP by token with allowance enforcement, organizer summary |
| `templates` | §5.1–§5.2 | Global template library + per-wedding customization |

Key rules:
- Guest import must not silently create duplicates or mis-assign weddings (§6.3).
- Invitation tokens are opaque and unique; regeneration invalidates the old one (§8.1).
- RSVP `confirmedCount` ≤ `maxAttendees`, enforced server-side (§7).

Acceptance: #7–#11. Relevant test scenarios: 2, 11.

---

## Phase 3 — Check-in 🔲

| Stub module | Spec | Implement |
|---|---|---|
| `checkin` | §8.2–§8.5 | `verify` (read-only preview), `admit` (concurrency-safe), manual search, attendance report |

Key rules:
- `admit` runs inside a transaction with a `SELECT ... FOR UPDATE` locked read
  on the invitation row, re-checks eligibility, counts prior `ADMITTED` records,
  and rejects if the allowance would be exceeded. The skeleton with the exact
  approach is in `checkin.service.ts`.
- Enforce event-specific access: an invitation only authorizes its linked events
  (or `openToAllGuests`).
- Attendance is append-only; repeated scans never silently add records.

Acceptance: #12–#17. Relevant test scenarios: 3, 4, 5, 6, 7, 8.

---

## Phase 4 — Wedding Albums 🔲

| Stub module | Spec | Implement |
|---|---|---|
| `albums` | §9.1, §9.4 | Album CRUD, privacy (PRIVATE/INVITED/PUBLIC), public access by token |
| `albums` (MediaService) | §9.2, §9.3 | Upload (presigned URL), guest uploads, moderation (approve/reject), delete |
| `storage` | §9.2, §16 | Replace `MockStorageService` with a real S3/MinIO client |

Key rules:
- Media lives in **private** object storage; serve via short-lived signed URLs.
- Private albums must not be reachable by guessing a URL (§9.4).
- When moderation is on, guest uploads stay `PENDING` and are invisible until
  approved (§9.3).
- The `storage` module currently returns labeled `mock://` URLs — swap it before
  claiming media works.

Acceptance: #18–#22. Relevant test scenario: 9, 10.

---

## Phase 5 — Production readiness 🔲

| Stub module | Spec | Implement |
|---|---|---|
| `reports` | §11 | Guest/attendance/RSVP reports + CSV/Excel export, authorization-gated |
| `notifications` | §14 | Real email/SMS providers; keep mock mode when unconfigured; only mark SENT on confirmed delivery |
| `audit` | §13 | Already a working helper — call it from sensitive mutations |
| (tests) | §19 | Automated tests for the 12 scenarios below |

Also in this phase: performance passes, logging, backups, deployment docs.

Acceptance: #23–#26.

---

## Acceptance criteria (spec §18) — quick checklist

Multi-wedding isolation
1. Platform manages many weddings simultaneously ✅
2. Creating one wedding never modifies another ✅
3. Each wedding has its own guests/invitations/events/QR/attendance/albums ✅ (schema) 🔲 (features)
4. Owners cannot access another wedding's private data without authorization ✅
5. Switching the current wedding updates the dashboard ✅
6. Reports only include authorized records 🔲

Invitations
7. Each active invitation has a unique secure token 🔲
8. Revoked invitations cannot be checked in 🔲
9. Guests reach the correct personalized invitation 🔲
10. Updating wedding details updates the published invitation 🔲
11. Invitation allowances enforced by the backend 🔲

QR verification
12–17. Valid check-in, invalid/revoked rejection, no duplicate, group support,
no over-allowance under concurrency, event-specific access 🔲

Albums
18–22. Album belongs to wedding, private protection, guest-upload settings,
moderation gating, backend-enforced permissions 🔲

Administration
23–26. Live dashboard stats ✅, authorized report export 🔲, auditable actions
(helper ✅, call sites 🔲), mobile + desktop 🔲

---

## Test scenarios (spec §19) to automate in Phase 5

1. Multiple wedding creation — each has its own dashboard/data.
2. Guest isolation — Wedding A owner cannot read Wedding B guests. *(isolation
   proven at the API level in Phase 1; extend to guests.)*
3. QR validation — valid invitation checks in for the correct event.
4. Invalid QR — unknown/revoked invitation denied.
5. Duplicate check-in — second scan creates no duplicate record.
6. Group invitation — 3 allowed, 2 in, 1 remaining can enter.
7. Concurrent check-in — simultaneous scans never exceed the limit.
8. Event-specific access — invitation for event 1 cannot enter event 2.
9. Album isolation — Wedding A guest cannot open Wedding B private album.
10. Media moderation — guest photo stays unpublished until approved.
11. Invitation updates — venue change reflects on the published invitation.
12. Reporting — attendance/RSVP totals match underlying records.

Prefer running these against a real Postgres test database (isolation and
concurrency cannot be meaningfully tested with mocks).

---

## Provider-dependent / mocked features (be honest in the UI)

- **Object storage** — `MockStorageService` returns fake URLs; no bytes stored.
- **Email/SMS/WhatsApp** — `NotificationsService` runs in mock mode without
  provider credentials and records `deliveryStatus = 'MOCK'`.
- **QR camera scanning** — frontend scanner not yet built.

Do not present any of these as working until implemented and tested (spec §21).
