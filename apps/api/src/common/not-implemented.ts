import { NotImplementedException } from '@nestjs/common';

/**
 * Marker used by every stub endpoint in this codebase.
 *
 * STUB CONVENTION
 * ---------------
 * Modules created during the foundation handoff expose their full route +
 * method surface so the API shape is visible and testable, but their logic is
 * not yet written. Each unimplemented method calls `notImplemented()` which
 * returns HTTP 501. Replace the call with real logic and remove the TODO.
 *
 * How to implement a stub:
 *   1. Read the referenced spec section and acceptance criteria in the TODO.
 *   2. Follow the "golden path" pattern documented in CONTRIBUTING.md
 *      (see the Weddings module for a complete, working reference).
 *   3. Keep wedding isolation intact: wedding-scoped routes must use
 *      JwtAuthGuard + WeddingAccessGuard and the correct @RequireWeddingPermission.
 *   4. Delete the notImplemented() call once the method works.
 */
export function notImplemented(feature: string): never {
  throw new NotImplementedException(
    `${feature} is not implemented yet. See the TODO in the source and docs/BUILD-GUIDE.md.`,
  );
}
