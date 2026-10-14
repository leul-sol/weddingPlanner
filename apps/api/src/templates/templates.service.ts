import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';

/**
 * Invitation templates — Phase 2 (spec §5.1, §5.2).
 *
 * Templates are reusable across weddings. The InvitationTemplate entity has
 * `isGlobal` (shared library) and an optional `weddingId` (a wedding-specific
 * customization). Global templates are readable by any authenticated user;
 * wedding-specific customizations must still respect wedding isolation.
 */
@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  /** TODO(Phase 2, §5.1): list global templates + the wedding's own customizations. */
  async list() {
    void this.prisma;
    return notImplemented('Template listing');
  }

  /**
   * TODO(Phase 2, §5.1): clone a global template into a wedding-specific
   * customization (isGlobal=false, weddingId set). Editing a customization
   * must never mutate the shared global template or another wedding's copy
   * (spec §5.1).
   */
  async customizeForWedding(weddingId: string, templateId: string) {
    void weddingId;
    void templateId;
    return notImplemented('Template customization');
  }
}
