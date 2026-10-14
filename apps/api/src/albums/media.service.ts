import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';

/**
 * Media moderation + lifecycle — Phase 4 (spec §9.3).
 *
 * When an album requires moderation, guest uploads stay PENDING and MUST NOT
 * be publicly visible until APPROVED (spec §9.3; test Scenario 10). Record each
 * decision in MediaModerationRecord.
 */
@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  /** TODO(Phase 4, §9.3): list PENDING media for moderation in a wedding. */
  async pendingForWedding(weddingId: string) {
    void weddingId;
    void this.prisma;
    return notImplemented('Pending media listing');
  }

  /**
   * TODO(Phase 4, §9.3): approve/reject a media file. Assert the media's
   * weddingId matches the route weddingId, set status, and write a
   * MediaModerationRecord with moderatorUserId + reason.
   */
  async moderate(
    weddingId: string,
    mediaId: string,
    decision: 'APPROVED' | 'REJECTED',
    moderatorUserId: string,
  ) {
    void weddingId;
    void mediaId;
    void decision;
    void moderatorUserId;
    return notImplemented('Media moderation');
  }

  /** TODO(Phase 4, §9.3): delete media (requires MEDIA_DELETE; remove object too). */
  async remove(weddingId: string, mediaId: string) {
    void weddingId;
    void mediaId;
    return notImplemented('Media deletion');
  }
}
