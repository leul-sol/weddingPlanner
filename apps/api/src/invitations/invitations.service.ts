import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';
import { generateOpaqueToken } from '../common/crypto.util';

/**
 * Invitations + QR tokens — Phase 2 (spec §5, §8.1).
 *
 * Each invitation carries an opaque, unguessable `token` (already modelled on
 * the Invitation entity, unique). Use generateOpaqueToken() from crypto.util
 * for both the invitation token and album public tokens.
 */
@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** TODO(Phase 2, §5.4): list invitations for a wedding. Filter by weddingId. */
  async list(weddingId: string) {
    void weddingId;
    void this.prisma;
    return notImplemented('Invitation listing');
  }

  /**
   * TODO(Phase 2, §5, §8.1): create an invitation for a guest. Generate a
   * unique token with generateOpaqueToken(). Attach permitted events via
   * InvitationEvent. For GROUP type, create InvitationAttendee slots up to
   * maxAttendees. See seed.ts for a concrete example of this shape.
   */
  async create(weddingId: string) {
    // Example of the token helper the implementer will use:
    void generateOpaqueToken;
    void weddingId;
    return notImplemented('Invitation creation');
  }

  /**
   * TODO(Phase 2, §5.4): publish an invitation (status DRAFT -> PUBLISHED,
   * set publishedAt). Published invitations expose a public page by token.
   */
  async publish(weddingId: string, invitationId: string) {
    void weddingId;
    void invitationId;
    return notImplemented('Invitation publish');
  }

  /**
   * TODO(Phase 2, §8.1): revoke an invitation (status -> REVOKED, revokedAt).
   * Revoked invitations MUST be rejected at check-in (test Scenario 4).
   */
  async revoke(weddingId: string, invitationId: string) {
    void weddingId;
    void invitationId;
    return notImplemented('Invitation revoke');
  }

  /**
   * TODO(Phase 2, §8.1): regenerate the invitation token. Rotating the token
   * MUST invalidate the previous one (anyone holding the old QR can no longer
   * check in).
   */
  async regenerateToken(weddingId: string, invitationId: string) {
    void weddingId;
    void invitationId;
    return notImplemented('Invitation token regeneration');
  }

  /**
   * TODO(Phase 2, §5.5): PUBLIC — resolve an invitation by its opaque token for
   * the guest-facing invitation page. No auth required, but return ONLY safe,
   * presentational fields (no cross-guest data, no internal IDs beyond what the
   * page needs). This is the only invitation endpoint that is not wedding-guarded.
   */
  async getByPublicToken(token: string) {
    void token;
    return notImplemented('Public invitation lookup by token');
  }
}
