import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';

/**
 * RSVP management — Phase 2 (spec §7).
 *
 * CRITICAL RULE: the backend MUST validate that confirmedCount never exceeds
 * the invitation's maxAttendees (spec §7, acceptance #11; test Scenario in §19).
 * Never trust a count supplied by the client.
 */
@Injectable()
export class RsvpService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TODO(Phase 2, §7): PUBLIC — submit/update an RSVP via the invitation's
   * opaque token (guests have no account). Validate:
   *   - invitation exists and is PUBLISHED (not REVOKED)
   *   - confirmedCount <= invitation.maxAttendees
   *   - RSVP deadline / "can update" settings on the wedding
   * Then upsert the RSVPResponse and set respondedAt.
   */
  async submitByToken(token: string) {
    void token;
    void this.prisma;
    return notImplemented('RSVP submission by token');
  }

  /** TODO(Phase 2, §7, §10): RSVP summary stats for a wedding dashboard. */
  async summary(weddingId: string) {
    void weddingId;
    return notImplemented('RSVP summary');
  }
}
